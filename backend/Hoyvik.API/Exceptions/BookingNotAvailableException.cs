namespace Hoyvik.API.Exceptions;

internal sealed class BookingNotAvailableException() : Exception("The selected dates are no longer available.");