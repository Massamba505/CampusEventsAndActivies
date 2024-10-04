import { useEffect, useState } from "react";
import moment from "moment";
import { myConstant } from "../../const/const";

export default function DayView({ date }) {
  const [dayEvents, setDayEvents] = useState([]);

  useEffect(() => {
    const fetchDayEvents = async () => {
      try {
        const response = await fetch(myConstant + "/api/events/");
        const data = await response.json();

        // Filter the events for the selected date
        const filteredEvents = data.data.filter(event => event.date === date);

        setDayEvents(filteredEvents);
        scrollToBottom()
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    };

    if (date) {
      fetchDayEvents();
    }
  }, [date]);

  const scrollToBottom = () => {
    window.scrollTo({
      top: document.body.scrollHeight,
      behavior: "smooth",
    });
  };

  return (
    <div className="pb-4 pt-2">
      <h3>Events on {moment(date, "DD/MM/YYYY").format("MMMM Do, YYYY")}</h3>
      <ul>
        {dayEvents.length > 0 ? (
          dayEvents.map((event, index) => (
            <li key={index}>
              <strong>{event.title}</strong> - {event.startTime} to {event.endTime}
            </li>
          ))
        ): (
          <p>No events for this day.</p>
        )}
      </ul>
    </div>
  );
}
