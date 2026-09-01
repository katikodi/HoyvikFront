
using Hoyvik.API.Configuration;
using Hoyvik.API.Data;
using Hoyvik.API.Exceptions;
using Hoyvik.API.Models;
using Hoyvik.API.Models.Requests;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using Npgsql;
using Stripe;
using Stripe.Checkout;

namespace Hoyvik.API.Services;

public class BookingService(Database db, IConfiguration configuration, IOptionsMonitor<BookingConfiguration> bookingConfiguration, ILogger<BookingService> logger) : IBookingService
{

	/// <summary>
	/// Status: Confirmed blocks availability
	/// Status: Pending + not expired blocks availability
	/// Status: Pending + expired does not block
	/// Status: Cancelled Does not block
	/// </summary>
	/// <param name="checkIn"></param>
	/// <param name="checkOut"></param>
	/// <param name="ct"></param>
	/// <returns></returns>
	public async Task<bool> CheckAvailability(DateOnly checkIn, DateOnly checkOut, CancellationToken ct = default)
	{
		var now = DateTime.UtcNow;
		logger.LogInformation("Checking availability: {CheckIn} -> {CheckOut}", checkIn, checkOut);
		return !await db.Bookings.AnyAsync(x =>
		(
			x.Status == BookingStatus.Confirmed || (x.Status == BookingStatus.Pending && x.ExpiresAt > DateTime.UtcNow)
		) &&
		x.CheckIn < checkOut && x.CheckOut > checkIn, ct);
	}

	public async Task<bool> ConfirmBooking(int bookingId, string stripeSessionId, CancellationToken ct = default)
	{
		var booking = await db.Bookings
		   .SingleOrDefaultAsync(x => x.Id == bookingId, ct);

		if(booking is null)
		{
			logger.LogWarning(
				"Booking {BookingId} not found",
				bookingId);

			return false;
		}

		// Make sure this Stripe session belongs to this booking
		if(booking.StripeSessionId != null &&
			booking.StripeSessionId != stripeSessionId)
		{
			logger.LogError(
				"Booking {BookingId} has Stripe session {ExistingSessionId}, " +
				"but webhook contains {WebhookSessionId}",
				booking.Id,
				booking.StripeSessionId,
				stripeSessionId);

			return false;
		}

		// Already confirmed
		if(booking.Status == BookingStatus.Confirmed)
		{
			return true;
		}

		// Don't confirm cancelled/expired bookings
		if(booking.Status != BookingStatus.Pending)
		{
			logger.LogWarning(
				"Booking {BookingId} has status {Status}, cannot confirm",
				booking.Id,
				booking.Status);

			return false;
		}

		booking.Status = BookingStatus.Confirmed;
		booking.StripeSessionId = stripeSessionId;

		await db.SaveChangesAsync(ct);

		logger.LogInformation("Booking {BookingId} confirmed", booking.Id);

		return true;
	}

	public async Task<bool> ExpireBooking(int bookingId, string stripeSessionId, CancellationToken ct = default)
	{
		var booking = await db.Bookings
			.SingleOrDefaultAsync(x => x.Id == bookingId, ct);

		if(booking is null)
		{
			logger.LogWarning(
				"Booking {BookingId} not found",
				bookingId);

			return false;
		}

		// Make sure this Stripe session belongs to this booking
		if(booking.StripeSessionId != null &&
			booking.StripeSessionId != stripeSessionId)
		{
			logger.LogError(
				"Booking {BookingId} has Stripe session {ExistingSessionId}, " +
				"but webhook contains {WebhookSessionId}",
				booking.Id,
				booking.StripeSessionId,
				stripeSessionId);

			return false;
		}

		if(booking.Status != BookingStatus.Pending)
		{
			return false;
		}

		booking.Status = BookingStatus.Expired;

		await db.SaveChangesAsync(ct);

		logger.LogInformation(
			"Booking {BookingId} expired",
			booking.Id);

		return true;
	}

	public async Task<string> CreateCheckoutSession(CreateSessionRequest request, string? userId, CancellationToken ct)
	{

		var available = await CheckAvailability(request.CheckIn, request.CheckOut, ct);

		if(!available)
			throw new BookingNotAvailableException();


		var numberOfNights = request.CheckOut.DayNumber - request.CheckIn.DayNumber;


		var pricePerNight = bookingConfiguration.CurrentValue.PricePerNight.Value; //configuration.GetValue<decimal?>("Settings:PricePerNight") ?? throw new Exception("PricePerNight is missing.");

		var totalPrice = numberOfNights * pricePerNight;


		var booking = new Booking
		{
			CheckIn = request.CheckIn,
			CheckOut = request.CheckOut,
			Price = totalPrice, //1050kr
			Status = BookingStatus.Pending,
			UserId = userId,
			NumberOfGuests = request.NumberOfGuests,
			CreatedAt = DateTime.UtcNow,
			ExpiresAt = DateTime.UtcNow.AddMinutes(bookingConfiguration.CurrentValue.ExpirationTime.Value)
		};


		try
		{
			db.Bookings.Add(booking);
			await db.SaveChangesAsync(ct);
		}
		catch(PostgresException ex) when(ex.SqlState == PostgresErrorCodes.ExclusionViolation)
		{
			throw new BookingNotAvailableException();
		}

		var frontendUrl = configuration.GetConnectionString("FrontendUrl") ?? "http://localhost:54131";

		var options = new SessionCreateOptions
		{
			Mode = "payment",
			SuccessUrl = $"{frontendUrl}/payment/payment-success?session_id={{CHECKOUT_SESSION_ID}}",
			CancelUrl = $"{frontendUrl}/payment/payment-cancel",
			Currency = "nok",
			Metadata = new() {
				{"BookingId", booking.Id.ToString()}
			},
			LineItems =
			[
				new SessionLineItemOptions
				{
					PriceData = new()
					{
						Currency = "nok",
						ProductData = new()
						{
							Name =
								$"Hoyvika " +
								$"{booking.CheckIn:dd MMM} to " +
								$"{booking.CheckOut:dd MMM}",

							Description =
								$"{request.NumberOfGuests} guests • " +
								"Check-in after 15:00"
						},
						UnitAmount = (long)(booking.Price * 100)
					},
					Quantity = 1
				}
			]
		};

		var service = new SessionService();

		Session session;

		try
		{
			session = await service.CreateAsync(options, cancellationToken: ct);
		}
		catch(StripeException ex)
		{
			logger.LogError(
				ex,
				"Failed to create Stripe checkout session for booking {BookingId}",
				booking.Id);

			db.Bookings.Remove(booking);
			await db.SaveChangesAsync(ct);
			throw;
		}

		booking.StripeSessionId = session.Id;
		await db.SaveChangesAsync(ct);
		return session.Url;
	}


}
