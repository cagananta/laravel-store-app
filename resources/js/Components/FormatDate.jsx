import { useState } from "react";

function formatDate(date, type) {
    const options = {
        weekday: "long",
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
    };

    if (type == "date") {
        return new Intl.DateTimeFormat("en-GB", options).format(date);
    } else if (type == "datetime") {
        return new Intl.DateTimeFormat("en-GB", {
            weekday: "long",
            second: "numeric",
            minute: "numeric",
            hour: "numeric",
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
        }).format(date);
    }
}

function DateFormatter({ date, type = "date" }) {
    const currentDate = new Date(date);
    const formattedDate = formatDate(currentDate, type);

    return <span> {formattedDate}</span>;
}

export default DateFormatter;
