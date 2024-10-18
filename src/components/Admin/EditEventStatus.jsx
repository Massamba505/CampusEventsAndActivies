// EditEventStatus.js
import { myConstant } from "../../const/const";

export const EditEventStatus = async (eventId, newStatus) => {
  try {
    // Validate the new status
    const validStatuses = ['pending', 'rejected', 'approved'];
    if (!validStatuses.includes(newStatus)) {
      throw new Error("Invalid status provided.");
    }

    // Create the body with the new status
    const body = { status: newStatus };

    // Send the updated event data back to the server using PUT
    const response = await fetch(`${myConstant}/api/events/${eventId}/status`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${JSON.parse(localStorage.getItem("events-app"))["token"]}`,
      },
      body: JSON.stringify(body),
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
