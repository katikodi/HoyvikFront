import { BookingCalendar } from "@/components/BookingCalendar";

export function BookingPage() {
    return <BookingCalendar onDateChange={e => console.log(e)} />;
}
