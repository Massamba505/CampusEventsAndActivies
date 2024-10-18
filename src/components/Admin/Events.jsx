import { useEffect, useState } from "react";
import { Spinner, Alert } from "react-bootstrap";
import toast from "react-hot-toast";
import { myConstant } from "../../const/const";
import TallEventCard from "./AdminEventCard";
import EditEventStatus from "./EditEventStatus";

const Events = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch(myConstant + "/api/events/admin/pending", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${JSON.parse(localStorage.getItem("events-app"))["token"]}`,
          },
        });
        const data = await response.json();

        if (response.ok) {
          setEvents(data.data);
        } else {
          toast.error(`Error: ${data.error}`);
        }
      } catch (error) {
        console.error("Error fetching events:", error);
        toast.error("Error fetching events");
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const handleRejectClick = async (id) => {
    try {
      await EditEventStatus(id, "rejected");
      // setEvents((prevEvents) => prevEvents.filter(event => event.event_id !== id));
      toast.success("Event rejected successfully!");
    } catch (error) {
      console.error("Error rejecting event:", error);
      toast.error("Error rejecting event");
    }
  };

  const handleApproveClick = async (id) => {
    try {

      const data = await EditEventStatus(id, "approved"); // Change to "accepted"
      console.log(data);
      setEvents((prevEvents) => prevEvents.filter(event => event.event_id !== id)); // Remove approved event
      toast.success("Event approved successfully!");
    } catch (error) {
      console.error("Error approving event:", error);
      toast.error("Error approving event");
    }
  };

  if (loading) {
    return (
      <Spinner animation="border" role="status">
        <span className="visually-hidden">Loading...</span>
      </Spinner>
    );
  }

  if (error) {
    return <Alert variant="danger">{error}</Alert>;
  }

  return (
    <div className="flex w-full flex-col mb-3 px-2">
      <h1 className="text-3xl text-center text-blue-500 font-bold mb-4">Event Management</h1>
      <div className="relative w-full flex flex-wrap items-center justify-center">
        <div
          id="events-slider"
          className="flex flex-col sm:flex-row sm:flex-wrap items-center justify-center gap-2"
        >
          {events.length > 0 ? (
            events.map((event, index) => (
              <TallEventCard 
                key={event.event_id || index} 
                event={event} 
                onApprove={handleApproveClick} 
                onReject={handleRejectClick} 
              />
            ))
          ) : (
            <p>No popular events available</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Events;
