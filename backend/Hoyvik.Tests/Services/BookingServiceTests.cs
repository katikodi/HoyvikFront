using FluentAssertions;
using Hoyvik.API.Configuration;
using Hoyvik.API.Data;
using Hoyvik.API.Exceptions;
using Hoyvik.API.Models;
using Hoyvik.API.Models.Requests;
using Hoyvik.API.Models.Stripe;
using Hoyvik.API.Services;
using Hoyvik.API.Services.Abstractions;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging.Abstractions;
using Microsoft.Extensions.Options;
using Moq;

namespace Hoyvik.Tests.Services;

public class BookingServiceTests
{
    private static Database CreateDatabase()
    {
        var options = new DbContextOptionsBuilder<Database>()
            .UseInMemoryDatabase(Guid.NewGuid().ToString())
            .Options;

        return new Database(options);
    }

    private static BookingService CreateService(
        Database db,
        Mock<IStripePaymentService>? stripeMock = null)
    {
        var bookingConfig = new BookingConfiguration
        {
            PricePerNight = 1050,
            ExpirationTime = 30
        };

        var optionsMonitorMock =
            new Mock<IOptionsMonitor<BookingConfiguration>>();

        optionsMonitorMock
            .Setup(x => x.CurrentValue)
            .Returns(bookingConfig);

        stripeMock ??= new Mock<IStripePaymentService>();

        return new BookingService(
            db: db,
            stripePaymentService: stripeMock.Object,
            bookingConfiguration: optionsMonitorMock.Object,
            logger: NullLogger<BookingService>.Instance);
    }

    [Fact]
    public async Task CheckAvailability_ReturnsTrue_WhenNoBookingsExist()
    {
        await using var db = CreateDatabase();

        var service = CreateService(db);

        var result = await service.CheckAvailability(
            new DateOnly(2026, 9, 5),
            new DateOnly(2026, 9, 8));

        result.Should().BeTrue();
    }

    [Fact]
    public async Task CheckAvailability_ReturnsFalse_WhenConfirmedBookingOverlaps()
    {
        await using var db = CreateDatabase();

        db.Bookings.Add(new Booking
        {
            CheckIn = new DateOnly(2026, 9, 1),
            CheckOut = new DateOnly(2026, 9, 5),
            Status = BookingStatus.Confirmed
        });

        await db.SaveChangesAsync();

        var service = CreateService(db);

        var result = await service.CheckAvailability(
            new DateOnly(2026, 9, 3),
            new DateOnly(2026, 9, 7));

        result.Should().BeFalse();
    }

    [Fact]
    public async Task CheckAvailability_ReturnsTrue_WhenBookingStartsAfterExistingCheckout()
    {
        await using var db = CreateDatabase();

        db.Bookings.Add(new Booking
        {
            CheckIn = new DateOnly(2026, 9, 1),
            CheckOut = new DateOnly(2026, 9, 4),
            Status = BookingStatus.Confirmed
        });

        await db.SaveChangesAsync();

        var service = CreateService(db);

        var result = await service.CheckAvailability(
            new DateOnly(2026, 9, 5),
            new DateOnly(2026, 9, 8));

        result.Should().BeTrue();
    }

    [Fact]
    public async Task CheckAvailability_ReturnsTrue_WhenCheckInEqualsExistingCheckOut()
    {
        await using var db = CreateDatabase();

        db.Bookings.Add(new Booking
        {
            CheckIn = new DateOnly(2026, 9, 1),
            CheckOut = new DateOnly(2026, 9, 4),
            Status = BookingStatus.Confirmed
        });

        await db.SaveChangesAsync();

        var service = CreateService(db);

        var result = await service.CheckAvailability(
            new DateOnly(2026, 9, 4),
            new DateOnly(2026, 9, 8));

        result.Should().BeTrue();
    }

    [Fact]
    public async Task CheckAvailability_ReturnsTrue_WhenPendingBookingHasExpired()
    {
        await using var db = CreateDatabase();

        db.Bookings.Add(new Booking
        {
            CheckIn = new DateOnly(2026, 9, 1),
            CheckOut = new DateOnly(2026, 9, 5),
            Status = BookingStatus.Pending,
            ExpiresAt = DateTime.UtcNow.AddMinutes(-30)
        });

        await db.SaveChangesAsync();

        var service = CreateService(db);

        var result = await service.CheckAvailability(
            new DateOnly(2026, 9, 2),
            new DateOnly(2026, 9, 4));

        result.Should().BeTrue();
    }

    [Fact]
    public async Task CheckAvailability_ReturnsFalse_WhenPendingBookingHasNotExpired()
    {
        await using var db = CreateDatabase();

        db.Bookings.Add(new Booking
        {
            CheckIn = new DateOnly(2026, 9, 1),
            CheckOut = new DateOnly(2026, 9, 5),
            Status = BookingStatus.Pending,
            ExpiresAt = DateTime.UtcNow.AddMinutes(30)
        });

        await db.SaveChangesAsync();

        var service = CreateService(db);

        var result = await service.CheckAvailability(
            new DateOnly(2026, 9, 2),
            new DateOnly(2026, 9, 4));

        result.Should().BeFalse();
    }

    [Fact]
    public async Task CheckAvailability_ReturnsTrue_WhenBookingIsCancelled()
    {
        await using var db = CreateDatabase();

        db.Bookings.Add(new Booking
        {
            CheckIn = new DateOnly(2026, 9, 1),
            CheckOut = new DateOnly(2026, 9, 5),
            Status = BookingStatus.Cancelled
        });

        await db.SaveChangesAsync();

        var service = CreateService(db);

        var result = await service.CheckAvailability(
            new DateOnly(2026, 9, 2),
            new DateOnly(2026, 9, 4));

        result.Should().BeTrue();
    }

    [Fact]
    public async Task CheckAvailability_ReturnsFalse_WhenCheckOutIsBeforeCheckIn()
    {
        await using var db = CreateDatabase();

        var service = CreateService(db);

        var result = await service.CheckAvailability(
            new DateOnly(2026, 9, 15),
            new DateOnly(2026, 9, 10));

        result.Should().BeFalse();
    }

    [Fact]
    public async Task CheckAvailability_ReturnsFalse_WhenCheckInEqualsCheckOut()
    {
        await using var db = CreateDatabase();

        var service = CreateService(db);

        var result = await service.CheckAvailability(
            new DateOnly(2026, 9, 10),
            new DateOnly(2026, 9, 10));

        result.Should().BeFalse();
    }

    [Fact]
    public async Task CheckAvailability_ReturnsFalse_WhenCheckInDateIsBlocked()
    {
        await using var db = CreateDatabase();

        db.BlockedDates.Add(new BlockedDate
        {
            Date = new DateOnly(2026, 9, 10),
            CreatedAt = DateTime.UtcNow
        });

        await db.SaveChangesAsync();

        var service = CreateService(db);

        var result = await service.CheckAvailability(
            new DateOnly(2026, 9, 10),
            new DateOnly(2026, 9, 15));

        result.Should().BeFalse();
    }

    [Fact]
    public async Task CheckAvailability_ReturnsFalse_WhenDateInsideBookingIsBlocked()
    {
        await using var db = CreateDatabase();

        db.BlockedDates.Add(new BlockedDate
        {
            Date = new DateOnly(2026, 9, 12),
            CreatedAt = DateTime.UtcNow
        });

        await db.SaveChangesAsync();

        var service = CreateService(db);

        var result = await service.CheckAvailability(
            new DateOnly(2026, 9, 10),
            new DateOnly(2026, 9, 15));

        result.Should().BeFalse();
    }

    [Fact]
    public async Task CheckAvailability_ReturnsTrue_WhenBlockedDateIsAfterCheckOut()
    {
        await using var db = CreateDatabase();

        db.BlockedDates.Add(new BlockedDate
        {
            Date = new DateOnly(2026, 9, 15),
            CreatedAt = DateTime.UtcNow
        });

        await db.SaveChangesAsync();

        var service = CreateService(db);

        var result = await service.CheckAvailability(
            new DateOnly(2026, 9, 10),
            new DateOnly(2026, 9, 15));

        result.Should().BeTrue();
    }

    [Fact]
    public async Task CheckAvailability_ReturnsTrue_WhenNoRequestedDatesAreBlocked()
    {
        await using var db = CreateDatabase();

        db.BlockedDates.Add(new BlockedDate
        {
            Date = new DateOnly(2026, 9, 20),
            CreatedAt = DateTime.UtcNow
        });

        await db.SaveChangesAsync();

        var service = CreateService(db);

        var result = await service.CheckAvailability(
            new DateOnly(2026, 9, 10),
            new DateOnly(2026, 9, 15));

        result.Should().BeTrue();
    }

    [Fact]
    public async Task CheckAvailability_ReturnsFalse_WhenAnyRequestedDateIsBlocked()
    {
        await using var db = CreateDatabase();

        db.BlockedDates.AddRange(
            new BlockedDate
            {
                Date = new DateOnly(2026, 9, 10),
                CreatedAt = DateTime.UtcNow
            },
            new BlockedDate
            {
                Date = new DateOnly(2026, 9, 20),
                CreatedAt = DateTime.UtcNow
            });

        await db.SaveChangesAsync();

        var service = CreateService(db);

        var result = await service.CheckAvailability(
            new DateOnly(2026, 9, 18),
            new DateOnly(2026, 9, 22));

        result.Should().BeFalse();
    }

    [Fact]
    public async Task CheckAvailability_ReturnsTrue_WhenBookingEndsOnBlockedDate()
    {
        await using var db = CreateDatabase();

        db.BlockedDates.Add(new BlockedDate
        {
            Date = new DateOnly(2026, 9, 10),
            CreatedAt = DateTime.UtcNow
        });

        await db.SaveChangesAsync();

        var service = CreateService(db);

        var result = await service.CheckAvailability(
            new DateOnly(2026, 9, 5),
            new DateOnly(2026, 9, 10));

        result.Should().BeTrue();
    }

    [Fact]
    public async Task ConfirmBooking_ReturnsFalse_WhenBookingDoesNotExist()
    {
        await using var db = CreateDatabase();

        var service = CreateService(db);

        var result = await service.ConfirmBooking(
            bookingId: 999,
            stripeSessionId: "cs_test_123");

        result.Should().BeFalse();
    }

    [Fact]
    public async Task ConfirmBooking_ConfirmsPendingBooking()
    {
        await using var db = CreateDatabase();

        var booking = new Booking
        {
            CheckIn = new DateOnly(2026, 9, 10),
            CheckOut = new DateOnly(2026, 9, 15),
            Status = BookingStatus.Pending,
            StripeSessionId = "cs_test_123",
            NumberOfGuests = 2,
            Price = 5250
        };

        db.Bookings.Add(booking);
        await db.SaveChangesAsync();

        var service = CreateService(db);

        var result = await service.ConfirmBooking(
            booking.Id,
            "cs_test_123");

        result.Should().BeTrue();

        db.ChangeTracker.Clear();

        var updatedBooking = await db.Bookings.FindAsync(booking.Id);

        updatedBooking.Should().NotBeNull();
        updatedBooking!.Status.Should().Be(BookingStatus.Confirmed);
        updatedBooking.StripeSessionId.Should().Be("cs_test_123");
    }

    [Fact]
    public async Task ConfirmBooking_ReturnsTrue_WhenAlreadyConfirmed()
    {
        await using var db = CreateDatabase();

        var booking = new Booking
        {
            CheckIn = new DateOnly(2026, 9, 10),
            CheckOut = new DateOnly(2026, 9, 15),
            Status = BookingStatus.Confirmed,
            StripeSessionId = "cs_test_123"
        };

        db.Bookings.Add(booking);
        await db.SaveChangesAsync();

        var service = CreateService(db);

        var result = await service.ConfirmBooking(
            booking.Id,
            "cs_test_123");

        result.Should().BeTrue();

        booking.Status.Should().Be(BookingStatus.Confirmed);
    }

    [Fact]
    public async Task ConfirmBooking_ReturnsFalse_WhenStripeSessionDoesNotMatch()
    {
        await using var db = CreateDatabase();

        var booking = new Booking
        {
            CheckIn = new DateOnly(2026, 9, 10),
            CheckOut = new DateOnly(2026, 9, 15),
            Status = BookingStatus.Pending,
            StripeSessionId = "cs_test_correct"
        };

        db.Bookings.Add(booking);
        await db.SaveChangesAsync();

        var service = CreateService(db);

        var result = await service.ConfirmBooking(
            booking.Id,
            "cs_test_wrong");

        result.Should().BeFalse();

        var updatedBooking = await db.Bookings.FindAsync(booking.Id);

        updatedBooking!.Status.Should().Be(BookingStatus.Pending);
        updatedBooking.StripeSessionId.Should().Be("cs_test_correct");
    }

    [Fact]
    public async Task ConfirmBooking_ReturnsFalse_WhenBookingIsExpired()
    {
        await using var db = CreateDatabase();

        var booking = new Booking
        {
            CheckIn = new DateOnly(2026, 9, 10),
            CheckOut = new DateOnly(2026, 9, 15),
            Status = BookingStatus.Expired,
            StripeSessionId = "cs_test_123"
        };

        db.Bookings.Add(booking);
        await db.SaveChangesAsync();

        var service = CreateService(db);

        var result = await service.ConfirmBooking(
            booking.Id,
            "cs_test_123");

        result.Should().BeFalse();

        var updatedBooking = await db.Bookings.FindAsync(booking.Id);

        updatedBooking!.Status.Should().Be(BookingStatus.Expired);
    }

    [Fact]
    public async Task ConfirmBooking_AssignsStripeSessionId_WhenNoneExists()
    {
        await using var db = CreateDatabase();

        var booking = new Booking
        {
            CheckIn = new DateOnly(2026, 9, 10),
            CheckOut = new DateOnly(2026, 9, 15),
            Status = BookingStatus.Pending,
            StripeSessionId = null
        };

        db.Bookings.Add(booking);
        await db.SaveChangesAsync();

        var service = CreateService(db);

        var result = await service.ConfirmBooking(
            booking.Id,
            "cs_test_new");

        result.Should().BeTrue();

        var updatedBooking = await db.Bookings.FindAsync(booking.Id);

        updatedBooking!.Status.Should().Be(BookingStatus.Confirmed);
        updatedBooking.StripeSessionId.Should().Be("cs_test_new");
    }

    [Fact]
    public async Task CreateBookingPaymentSession_CreatesBookingAndStripeSession()
    {
        await using var db = CreateDatabase();

        var user = new ApplicationUser
        {
            Id = "user-123",
            UserName = "test@example.com",
            Email = "test@example.com"
        };

        db.Users.Add(user);
        await db.SaveChangesAsync();

        var stripeMock = new Mock<IStripePaymentService>();

        stripeMock
            .Setup(x => x.CreateCheckoutSession(
                It.IsAny<Booking>(),
                It.IsAny<CancellationToken>()))
            .ReturnsAsync(new StripeCheckoutSession(
                "cs_test_123",
                "https://checkout.stripe.com/test"));

        var service = CreateService(db, stripeMock);

        var request = new CreateSessionRequest(
            new DateOnly(2026, 9, 10),
            new DateOnly(2026, 9, 15),
            2);

        var result = await service.CreateBookingPaymentSession(
            request,
            user.Id);

        result.Should().Be("https://checkout.stripe.com/test");

        var booking = await db.Bookings.SingleAsync();

        booking.CheckIn.Should().Be(new DateOnly(2026, 9, 10));
        booking.CheckOut.Should().Be(new DateOnly(2026, 9, 15));
        booking.NumberOfGuests.Should().Be(2);
        booking.UserId.Should().Be(user.Id);
        booking.Status.Should().Be(BookingStatus.Pending);
        booking.Price.Should().Be(5250);
        booking.StripeSessionId.Should().Be("cs_test_123");

        stripeMock.Verify(
            x => x.CreateCheckoutSession(
                It.Is<Booking>(b =>
                    b.Id == booking.Id &&
                    b.Status == BookingStatus.Pending &&
                    b.Price == 5250),
                It.IsAny<CancellationToken>()),
            Times.Once);
    }

    [Fact]
    public async Task CreateBookingPaymentSession_Throws_WhenDatesAreBlocked()
    {
        await using var db = CreateDatabase();

        db.BlockedDates.Add(new BlockedDate
        {
            Date = new DateOnly(2026, 9, 12),
            CreatedAt = DateTime.UtcNow
        });

        await db.SaveChangesAsync();

        var stripeMock = new Mock<IStripePaymentService>();
        var service = CreateService(db, stripeMock);

        var request = new CreateSessionRequest(
            new DateOnly(2026, 9, 10),
            new DateOnly(2026, 9, 14),
            2);

        var act = () => service.CreateBookingPaymentSession(
            request,
            "user-123");

        await act.Should()
            .ThrowAsync<BookingNotAvailableException>();

        stripeMock.Verify(
            x => x.CreateCheckoutSession(
                It.IsAny<Booking>(),
                It.IsAny<CancellationToken>()),
            Times.Never);

        var bookingCount = await db.Bookings.CountAsync();

        bookingCount.Should().Be(0);
    }

    [Fact]
    public async Task ConfirmBooking_CreatesEmailOutbox_WhenUserHasEmail()
    {
        await using var db = CreateDatabase();

        var user = new ApplicationUser
        {
            Id = "user-123",
            UserName = "test@example.com",
            Email = "test@example.com"
        };

        db.Users.Add(user);

        var booking = new Booking
        {
            CheckIn = new DateOnly(2026, 9, 10),
            CheckOut = new DateOnly(2026, 9, 15),
            Status = BookingStatus.Pending,
            StripeSessionId = "cs_test_123",
            NumberOfGuests = 2,
            Price = 5250,
            UserId = user.Id
        };

        db.Bookings.Add(booking);

        await db.SaveChangesAsync();

        var service = CreateService(db);

        var result = await service.ConfirmBooking(
            booking.Id,
            "cs_test_123");

        result.Should().BeTrue();

        var email = await db.EmailOutbox.SingleAsync();

        email.To.Should().Be("test@example.com");
        email.Subject.Should().Be($"Booking confirmation #{booking.Id}");
        email.Body.Should().Contain("Booking confirmed");
    }
}