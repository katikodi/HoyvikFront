import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import "@/styles/Form.css";
import "@/styles/Booking.css";
import "@/styles/Home.css";

const Booking = () => {
    const [stage, setStage] = useState(0);
    const {
        register,
        handleSubmit,
        watch,
        formState: { errors }
    } = useForm();
    const onSubmit = () => {
        console.log("submittted");
    };

    const bookingStages = {
        0: <BookingStageOne />,
        1: <BookingStageTwo register={register} />,
        2: <BookingStageThree register={register} />,
        3: <Redirect />
    };
    return (
        <div className="signup-background">
            <div
                className="form-container"
                style={{ width: "70%" }}
            >
                <h1
                    className="cinzel"
                    style={{ color: "var(--textbrown)" }}
                >
                    Book your stay
                </h1>

                <form onSubmit={handleSubmit(onSubmit)}>
                    {bookingStages[stage]}
                    {/* <BookingStageOne /> */}
                    {Object.keys(bookingStages).length - 1 > stage && (
                        <div className="flex-row gap-1">
                            <input
                                type="submit"
                                value="Prev"
                                onClick={() => {
                                    setStage(prev => prev - 1);
                                }}
                            />

                            <input
                                type="submit"
                                value="Next"
                                onClick={() => {
                                    setStage(prev => prev + 1);
                                }}
                            />
                        </div>
                    )}
                </form>
            </div>
        </div>
    );
};
export default Booking;

const BookingStageOne = () => {
    return (
        <div className="flex-row space-between">
            <CalendarInput
                inputId={crypto.randomUUID()}
                labelText="From"
            />
            <CalendarInput
                inputId={crypto.randomUUID()}
                labelText="To"
            />
        </div>
    );
};
const BookingStageTwo = ({ register }) => {
    return (
        <div className="flex-col center gap-1">
            <div className="flex-row space-between">
                <input
                    type="text"
                    placeholder="John"
                    {...register("first-name", { required: true })}
                />
                <input
                    type="text"
                    placeholder="Doe"
                    {...register("last-name", { required: true })}
                />
            </div>
            <input
                type="email"
                placeholder="john@doe.com"
                {...register("email", { required: true })}
            />
            <input
                type="tel"
                placeholder="123 45 678"
                {...register("phone", { required: true })}
            />
        </div>
    );
};

const BookingStageThree = ({ register }) => {
    return (
        <div className="flex-col center gap-1">
            <div className="flex-row space-between">
                <input
                    type="number"
                    placeholder="2671"
                    {...register("first-name", { required: true })}
                />
                <input
                    type="text"
                    placeholder="Lupinvegen 5"
                    {...register("last-name", { required: true })}
                />
            </div>
            <input
                type="text"
                placeholder="optional. unit number etc"
                {...register("email", { required: true })}
            />
        </div>
    );
};

const CalendarInput = ({ inputId, labelText }) => {
    return (
        <div className="booking-input-container flex-col gap-sm">
            <label
                htmlFor={inputId}
                className="monsterrat hero-booking-label"
            >
                {labelText}
            </label>
            <input
                className=""
                id={inputId}
                type="date"
            ></input>
        </div>
    );
};

const Redirect = () => {
    useEffect(() => {
        const controller = new AbortController();
        let timeoutId;

        async function startCheckout() {
            const response = await fetch("/api/payment/create-checkout-session", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                credentials: "include",
                signal: controller.signal
            });

            const result = await response.json();
            if (!response.ok || !result.url) return;

            timeoutId = setTimeout(() => {
                window.location.href = result.url;
            }, 1000);
        }

        startCheckout().catch(error => {
            if (error.name !== "AbortError") {
                console.error(error);
            }
        });

        return () => {
            clearTimeout(timeoutId);
            controller.abort();
        };
    });
    return <div>You are being redirected....</div>;
};
