import React from 'react';

const EventCard = ({ event }) => {
  return (
    <div data-testid="event-card" className="border p-4 rounded shadow">
      <h3 className="text-lg font-bold">{event.name}</h3>
      <p>{event.description}</p>
      <p>{event.date}</p>
    </div>
  );
};

export default EventCard;