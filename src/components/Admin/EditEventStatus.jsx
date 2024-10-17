// EditEventStatus.js
import { myConstant } from "../../const/const";

export const fetchEventById = async (eventId) => {
  try {
    const response = await fetch(`${myConstant}/api/events/${eventId}`);
    if (!response.ok) {
      throw new Error("Failed to fetch event data");
    }
    const data = await response.json();
    return data.data; // Assuming the event data is in `data.data`
  } catch (error) {
    console.error("Error fetching event:", error);
    throw error;
  }
};

export const EditEventStatus = async (eventId, newStatus) => {
  try {
    // First, fetch the event by ID
    const eventData = await fetchEventById(eventId);

    // Create a copy of the event data and update the status
    const updatedEvent = {
      ...eventData,
      status: newStatus, // Only update the status
    };

    // Send the updated event data back to the server using PUT
    const response = await fetch(`${myConstant}/api/events/update/${eventId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${
          JSON.parse(localStorage.getItem("events-app"))["token"]
        }`,
      },
      body: JSON.stringify(updatedEvent),
    });

    if (!response.ok) {
      const errorResponse = await response.json();
      console.error("Error updating event:", errorResponse);
      throw new Error(errorResponse.error || "Failed to update event");
    }

    const updatedEventData = await response.json();
    return updatedEventData; // Return the updated event data
  } catch (error) {
    console.error("Error updating event status:", error);
    throw error;
  }
};

export default EditEventStatus;
