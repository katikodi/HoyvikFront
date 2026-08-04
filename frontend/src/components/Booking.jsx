export default function Booking() {
    return (
        <div className="booking">
            <label htmlFor="check-in">Check in</label>
            <input
                type="datetime-local"
                name="check-in"
                id="check-in"
            />
            <label htmlFor="check-out">Check out</label>
            <input
                type="datetime-local"
                name="check-out"
                id="check-out"
            />
            <label htmlFor="guest">Guest</label>
            {/* Drop down */}
            <label htmlFor="cabin">Cabin</label> {/* Remove if ont needed */}
            <select
                name="cabin"
                id="cabin"
            >
                <option value="1">Cabin 1</option>
                <option value="2">Cabin 2</option>
            </select>
            <input
                type="submit"
                value="Comfirm"
            />{" "}
            {/* this is temp */}
        </div>
    );
}
