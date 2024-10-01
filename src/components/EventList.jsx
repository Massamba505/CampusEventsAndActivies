import EventCard from './EventCard';

const EventList = ({ events }) => {

  if (!events || events.length === 0) {
    return <div className="text-center">No events found</div>; // Better user experience
  }

  return (
    // <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
      <>
        {events.map((event) => (
          <EventCard key={event.event_id} event={event} />
        ))}
      </>
    // </div>
  );
};

export default EventList;
