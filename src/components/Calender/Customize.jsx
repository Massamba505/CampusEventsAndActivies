import { useEffect, useState } from "react";
import moment from "moment";
import Calendar from "./Calender";
import "./cale.css";
import { myConstant } from "../../const/const";
import DayView from "./DayView";

export default function Customize() {
  const [events, setEvents] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch(myConstant + "/api/events/calender");
        const data = await response.json();

        // Format the events as needed
        const formattedEvents = data.data.map(event => {
          const startDateTime = `${event.date} ${event.startTime}`;
          const endDateTime = `${event.date} ${event.endTime}`;

          return {
            start: moment(startDateTime, "DD/MM/YYYY HH:mm:ss").toDate(),
            end: moment(endDateTime, "DD/MM/YYYY HH:mm:ss").toDate(),
            title: event.title,
            date: event.date,
          };
        });

        setEvents(formattedEvents);
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    };

    fetchEvents();
  }, []);

  const eventColors = [
    '#3b939b',
    '#53a8b6',
    '#5585b5',
    '#8dc6ff',
    '#22313f',
    '#34495e'
  ];

  const eventPropGetter = (event, start, end, isSelected) => {
    const index = events.indexOf(event) % eventColors.length;
    const backgroundColor = eventColors[index];

    return {
      style: {
        backgroundColor,
        color: 'white',
        borderRadius: '5px',
        opacity: 0.8,
        paddingLeft: "5px",
        display: 'block'
      },
    };
  };

  // Handle event selection
  const handleEventClick = (event) => {
    setSelectedDate(event.date); // Set the selected date
  };
  const handleSelect = (event) => {
    console.log(event)
  };

  return (
    <div className="" style={{ height: "75vh" }}>
      <Calendar
        className="sm:text-sm"
        events={events}
        eventPropGetter={eventPropGetter}
        onSelectSlot={handleSelect}
        onSelectEvent={handleEventClick} // Add the event click handler
      />
      {selectedDate && <DayView date={selectedDate} />} {/* Render DayView with selected date */}
    </div>
  );
}
