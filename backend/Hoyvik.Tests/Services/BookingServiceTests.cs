using FluentAssertions;
using Hoyvik.API.Configuration;
using Hoyvik.API.Data;
using Hoyvik.API.Models;
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

    private static BookingService CreateService(Database db, Mock<IStripePaymentService>? stripeMock = null)
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
            db,
            optionsMonitorMock.Object,
            stripeMock.Object,
            NullLogger<BookingService>.Instance);
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
    public async Task ConfirmBooking_ReturnsFalse_WhenBookingDoesNotExist()
    {
        // Arrange
        await using var db = CreateDatabase();

        var service = CreateService(db);

        // Act
        var result = await service.ConfirmBooking(
            bookingId: 999,
            stripeSessionId: "cs_test_123");

        // Assert
        result.Should().BeFalse();
    }


    [Fact]
    public async Task ConfirmBooking_ConfirmsPendingBooking()
    {
        // Arrange
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

        // Act
        var result = await service.ConfirmBooking(
            booking.Id,
            "cs_test_123");

        // Assert
        result.Should().BeTrue();

        // Clear EF Core's tracked entities
        db.ChangeTracker.Clear();

        // Load a fresh copy from the database
        var updatedBooking = await db.Bookings.FindAsync(booking.Id);

        updatedBooking.Should().NotBeNull();
        updatedBooking!.Status.Should().Be(BookingStatus.Confirmed);
        updatedBooking.StripeSessionId.Should().Be("cs_test_123");
    }

    [Fact]
    public async Task ConfirmBooking_ReturnsTrue_WhenAlreadyConfirmed()
    {
        // Arrange
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

        // Act
        var result = await service.ConfirmBooking(
            booking.Id,
            "cs_test_123");

        // Assert
        result.Should().BeTrue();

        booking.Status.Should().Be(BookingStatus.Confirmed);
    }

    [Fact]
    public async Task ConfirmBooking_ReturnsFalse_WhenStripeSessionDoesNotMatch()
    {
        // Arrange
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

        // Act
        var result = await service.ConfirmBooking(
            booking.Id,
            "cs_test_wrong");

        // Assert
        result.Should().BeFalse();

        var updatedBooking = await db.Bookings.FindAsync(booking.Id);

        updatedBooking!.Status.Should().Be(BookingStatus.Pending);
        updatedBooking.StripeSessionId.Should().Be("cs_test_correct");
    }

    [Fact]
    public async Task ConfirmBooking_ReturnsFalse_WhenBookingIsExpired()
    {
        // Arrange
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

        // Act
        var result = await service.ConfirmBooking(
            booking.Id,
            "cs_test_123");

        // Assert
        result.Should().BeFalse();

        var updatedBooking = await db.Bookings.FindAsync(booking.Id);

        updatedBooking!.Status.Should().Be(BookingStatus.Expired);
    }

    [Fact]
    public async Task ConfirmBooking_AssignsStripeSessionId_WhenNoneExists()
    {
        // Arrange
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

        // Act
        var result = await service.ConfirmBooking(
            booking.Id,
            "cs_test_new");

        // Assert
        result.Should().BeTrue();

        var updatedBooking = await db.Bookings.FindAsync(booking.Id);

        updatedBooking!.Status.Should().Be(BookingStatus.Confirmed);
        updatedBooking.StripeSessionId.Should().Be("cs_test_new");
    }
}