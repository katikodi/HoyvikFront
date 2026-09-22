using Hoyvik.API.Common;

public class Result
{
    public bool IsSuccess { get; }
    public bool IsFailure => !IsSuccess;
    public Error Error { get; }
    public Error[] Errors { get; }

    protected Result(bool isSuccess, Error error)
        : this(isSuccess, error, error == Error.None ? [] : [error])
    {
    }

    protected Result(bool isSuccess, Error error, Error[] errors)
    {
        IsSuccess = isSuccess;
        Error = error;
        Errors = errors;
    }

    public static Result Success() => new(true, Error.None);
    public static Result Failure(Error error) => new(false, error);

    public static Result Failure(Error[] errors) =>
        new(false, errors.FirstOrDefault() ?? Error.None, errors);

    public static Result<TValue> Success<TValue>(TValue value) => new(value, true, Error.None, []);
    public static Result<TValue> Failure<TValue>(Error error) => new(default, false, error, [error]);
    public static Result<TValue> Failure<TValue>(Error[] errors) =>
        new(default, false, errors.FirstOrDefault() ?? Error.None, errors);
}

public class Result<TValue> : Result
{
    private readonly TValue? _value;

    protected internal Result(TValue? value, bool isSuccess, Error error, Error[] errors)
        : base(isSuccess, error, errors)
    {
        _value = value;
    }

    public TValue Value => IsSuccess
        ? _value!
        : throw new InvalidOperationException("Cannot access value of a failed result");

    public static implicit operator Result<TValue>(TValue value) => Success(value);
}