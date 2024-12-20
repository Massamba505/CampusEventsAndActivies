import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Dialog } from "@headlessui/react";
import { myConstant } from "../../const/const";

const dummyLocations = [
  "Wits Theatre",
  "Sturrock Park",
  "Digs Field",
  "Great Hall",
  "MSL005",
];

const EditEvent = ({ eventId, modalVisible, setModalVisible, onUpdate }) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    location: "",
    date: "",
    start_time: "",
    end_time: "",
    is_paid: false,
    ticket_price: 0,
    max_attendees: "",
    category: [],
    discount: 0,
    food_stalls: false,
  });

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [status, setStatus] = useState("Checking Availability...");

  const token = JSON.parse(localStorage.getItem("events-app"))["token"];

  useEffect(() => {
    const fetchEventData = async () => {
      try {
        const response = await fetch(`${myConstant}/api/events/${eventId}`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch event details");
        }

        let data = await response.json();
        data = data.data;
        const dateString = data.date;
        const dateParts = dateString.split("/"); // Split by '/'
        const formattedDate = `${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`; // Reformat to yyyy-MM-dd

        // Ensure date is always formatted correctly
        data.date = formattedDate;
        const catego = [];
        for (let i = 0; i < data.category.length; i++) {
          catego.push(data.category[i]._id);
        }
        data.category = catego;

        setFormData({
          title: data.title || "",
          description: data.description || "",
          location: data.location || "",
          date: formattedDate,
          start_time: data.startTime || "",
          end_time: data.endTime || "",
          is_paid: data.isPaid || false,
          ticket_price: data.ticketPrice || 0,
          max_attendees: data.maxAttendees || "",
          category: data.category || [],
          food_stalls: data.food_stalls || false,
          discount: data.discount,
        });
      } catch (error) {
        toast.error("Error fetching event details");
      }
    };

    if (modalVisible) {
      fetchEventData();
    }
  }, [modalVisible, eventId, token]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(myConstant + "/api/category", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch categories");
        }

        const data = await response.json();
        setCategories(data);
      } catch (error) {
        toast.error("Error fetching categories");
      }
    };
    const fetchVenues = async () => {
      try {
        const response = await fetch(myConstant + "/api/venues/", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        if (!response.ok) {
          throw new Error("Failed to fetch Venues");
        }
        while (dummyLocations.length > 0) {
          dummyLocations.pop();
        }
        const data = await response.json();
        //console.log(data);
        for (let i = 0; i < data.length; i++) {
          if (data[i].status) {
            dummyLocations.push(data[i].name);
          }
        }
      } catch (error) {
        console.error("Error fetching Venues:", error);
        toast.error("Error fetching Venues");
      }
    };
    fetchVenues();
    fetchCategories();
  }, [token]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleCheckboxChange = (categoryId) => {
    setFormData((prevState) => {
      const isChecked = prevState.category.includes(categoryId);
      const newCategories = isChecked
        ? prevState.category.filter((catId) => catId !== categoryId)
        : [...prevState.category, categoryId];
      return { ...prevState, category: newCategories };
    });
  };

  const formatDate = (dateString) => {
    const dateParts = dateString.split("-");
    return `${dateParts[2]}/${dateParts[1]}/${dateParts[0]}`;
  };

  const checkAvailability = async () => {
    try {
      const formDataObj = new FormData();
      const dataChecking = (da) => {
        // Create a new Date object from the 'yyyy-mm-dd' format string
        const Daaa = new Date(da);
        const now = new Date(); // Get the current date

        // Check if the input date is in the past
        if (Daaa < now) {
          return 2; // Return 2 if the date is in the past
        }

        return 0; // Return 0 otherwise
      };

      if (dataChecking(formData.date) === 2) {
        return 2;
      }
      const convertToTime2 = (timeStr) => {
        const [hours, minutes, seconds = "00"] = timeStr.split(":");
        const date = new Date();
        date.setHours(
          parseInt(hours, 10),
          parseInt(minutes, 10),
          parseInt(seconds, 10),
          0
        );
        return date;
      };

      let formStart = convertToTime2(formData.start_time);
      let formEnd = convertToTime2(formData.end_time);
      if (formStart.getTime() > formEnd.getTime()) {
        console.log("Start time cannot be after end time");
        return 2;
      }
      //console.log(formData);
      if (formData.is_paid) {
        if (formData.ticket_price <= 10) {
          return 7;
        }
        if (formData.ticket_price >= 99999) {
          return 9;
        }
      }
      if (formData.max_attendees < 1 || formData.max_attendees % 1 != 0) {
        return 8;
      }
      const date = formatDate(formData.date);
      formDataObj.append("title", formData.title);
      formDataObj.append("description", formData.description);
      formDataObj.append("location", formData.location);
      formDataObj.append("date", date);
      formDataObj.append("startTime", formData.start_time);
      formDataObj.append("endTime", formData.end_time);
      formDataObj.append("isPaid", formData.is_paid);
      formDataObj.append(
        "ticketPrice",
        formData.is_paid ? formData.ticket_price : 0
      );
      formDataObj.append("maxAttendees", formData.max_attendees || 0);
      formDataObj.append("category", JSON.stringify(formData.category));
      formDataObj.append("food_stalls", formData.food_stalls);

      //get the venues  from group2a
      let venueMap = {};
      const response1 = await fetch(
        `https://group2afunctionapp.azurewebsites.net/api/getVENUE?code=lVPnP4OFOCMQEJe3ZcIOQfywgWO9Ag5WtiixpUIwv340AzFuYZT3dQ%3D%3D`
      );
      if (!response1.ok) {
        const resData = await response1.json();
        toast.error(resData.error || "Error fetching Group 2 api venues");
        return -1;
      }
      const data1 = await response1.json();
      for (let i = 0; i < data1.length; i++) {
        if (formData.location == data1[i]["VENUE_NAME"]) {
          if (data1[i]["VENUE_STATUS"] == "Unavailable") {
            return 1;
          }
        }
        venueMap[data1[i]["VENUE_ID"]] = data1[i]["VENUE_NAME"];
      }

      //get the Bookings from group2a
      const response2 = await fetch(
        `https://group2afunctionapp.azurewebsites.net/api/getBOOKING?code=JDsgJhmxzmtNJeOdiPSKbEAPlrI61hA5RDMlGKh4OzxyAzFuGvO2yQ%3D%3D`
      );
      if (!response2.ok) {
        console.log("Bookings 1 error");
        const resData = await response2.json();
        toast.error(resData.error || "Error fetching Group 2 api schedule");
        return -2;
      }
      const data2 = await response2.json();
      for (let i = 0; i < data2.length; i++) {
        if (formData.location == venueMap[data2[i]["VENUE_ID"]]) {
          if (formData.date == data2[i]["DATE"].split("T")[0]) {
            const convertToTime = (timeStr) => {
              const [hours, minutes, seconds = "00"] = timeStr.split(":");
              const date = new Date();
              date.setHours(
                parseInt(hours, 10),
                parseInt(minutes, 10),
                parseInt(seconds, 10),
                0
              );
              return date;
            };

            let formStart = convertToTime(formData.start_time);
            let formEnd = convertToTime(formData.end_time);
            let eventStart = convertToTime(data2[i]["START_TIME"]);
            let eventEnd = convertToTime(data2[i]["END_TIME"]);

            if (formStart > formEnd) {
              console.log("Start time cannot be later than end time");
              return 2;
            }

            if (formStart < eventEnd && formEnd > eventStart) {
              console.log("Clash of events");
              return 3;
            }
          }
        }
      }

      //get the events from our backend
      const response3 = await fetch(`${myConstant}/api/events`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response3.ok) {
        console.log("events 2 error");
        const resData = await response3.json();
        toast.error(resData.error || "Error getting our events");
        return -3;
      }
      const datax = await response3.json();
      const data3 = datax.data;
      //console.log("What");
      //console.log(data3);
      for (let i = 0; i < data3.length; i++) {
        if (data3[i].isCancelled) {
          continue;
        }
        //console.log(`${formData.location}:${data3[i]["location"]}`);
        if (formData.location == data3[i]["location"]) {
          //console.log("happened1");
          let temp_date = data3[i]["date"].replace(/\//g, "-").split("-");
          temp_date = temp_date.reverse().join("-");
          //console.log(temp_date);
          //console.log(`${formData.date}:${temp_date}`);
          if (formData.date == temp_date) {
            //console.log("happened2");
            const convertToTime = (timeStr) => {
              const [hours, minutes, seconds = "00"] = timeStr.split(":");
              const date = new Date();
              date.setHours(
                parseInt(hours, 10),
                parseInt(minutes, 10),
                parseInt(seconds, 10),
                0
              );
              return date;
            };

            let formStart = convertToTime(formData.start_time);
            let formEnd = convertToTime(formData.end_time);
            let eventStart = convertToTime(data3[i]["startTime"]);
            let eventEnd = convertToTime(data3[i]["endTime"]);

            if (formStart > formEnd) {
              console.log("Start time cannot be after end time");
              return 2;
            }

            if (formStart < eventEnd && formEnd > eventStart) {
              console.log(data3[i]);
              console.log(formData);
              console.log("Clash of events");
              return 0;
            }
          }
        }
      }
      return 0;
    } catch (err) {
      setError("Error Checking Availability event. Please try again.");
      console.log(err.message);
      return 4;
    }
  };
  const creator = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");
    setStatus("Checking Availability...");
    let out = await checkAvailability();
    if (out == 3) {
      toast.error("Venue Booked, Choose a different time");
      setLoading(false);
    } else if (out == 2) {
      toast.error(" Invalid Date, start time or end time!");
      setLoading(false);
    } else if (out == 1) {
      toast.error("Venue Unavailable!");
      setLoading(false);
    } else if (out == 0) {
      console.log("Start editing");
      toast.success("Venue Available, Editing event");
      setStatus("Editing...");
      handleSubmit();
    } else if (out == 7) {
      toast.error("Ticket Price must be greater than 1!");
      setLoading(false);
    } else if (out == 8) {
      toast.error("Max attendees must be whole and greater than 1!");
      setLoading(false);
    } else if (out == 9) {
      toast.error("Ticket Price must be less than 99999!");
      setLoading(false);
    } else if (out == 4) {
      toast.error("Some error occured!");
      setLoading(false);
    } else {
      toast.error("Error checking Availability");
      if (out == -1) {
        console.log("Fetch venues");
      } else if (out == -2) {
        console.log("Fetch bookings");
      } else if (out == -3) {
        console.log("Fetch our events");
      }
      setLoading(false);
    }
    //setLoading(false);
  };

  const handleSubmit = async () => {
    // e.preventDefault();
    // setLoading(true);
    // setError("");
    // setSuccess("");

    try {
      const formDataObj = {
        title: formData.title,
        description: formData.description,
        location: formData.location,
        date: formatDate(formData.date),
        startTime: formData.start_time,
        endTime: formData.end_time,
        isPaid: formData.is_paid,
        ticketPrice: formData.is_paid ? formData.ticket_price : 0,
        maxAttendees: formData.max_attendees || 0,
        category: formData.category,
        food_stalls: formData.food_stalls,
        discount: formData.discount,
      };

      const response = await fetch(
        `${myConstant}/api/events/update/${eventId}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formDataObj),
        }
      );

      if (!response.ok) {
        const resData = await response.json();
        toast.error(resData.error || "Error updating event");
        return;
      }

      toast.success("Event updated successfully!");
      setSuccess("Event updated successfully!");
      setModalVisible(false);
      onUpdate();
    } catch (err) {
      setError("Error updating event. Please try again.");
      console.log(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog
      open={modalVisible}
      onClose={() => setModalVisible(false)}
      className="relative z-10"
    >
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center">
        <Dialog.Panel className="relative bg-white rounded-lg shadow-lg w-full sm:w-9/12 max-w-lg h-5/6 overflow-y-auto sm:mt-4">
          <div className="p-6">
            <h2 className="text-4xl font-semibold mb-4 text-blue-500 text-center">
              Edit Event
            </h2>
            <div className="space-y-4">
              {/* Title */}
              <div>
                <label
                  htmlFor="title"
                  className="block text-sm font-medium text-gray-900"
                >
                  Event Title
                </label>
                <input
                  id="title"
                  name="title"
                  value={formData.title || ""} // Ensure value is always defined
                  onChange={handleInputChange}
                  className="w-full rounded-md border-0 py-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-indigo-600"
                  required
                />
              </div>

              {/* Location */}
              <div>
                <label
                  htmlFor="location"
                  className="block text-sm font-medium text-gray-900"
                >
                  Location
                </label>
                <select
                  id="location"
                  name="location"
                  value={formData.location || ""} // Ensure value is always defined
                  onChange={handleInputChange}
                  className="w-full rounded-md border-0 py-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600"
                  required
                >
                  <option value="">Select Location</option>
                  {dummyLocations.map((loc) => (
                    <option key={loc} value={loc}>
                      {loc}
                    </option>
                  ))}
                </select>
              </div>

              {/* Date */}
              <div>
                <label
                  htmlFor="date"
                  className="block text-sm font-medium text-gray-900"
                >
                  Date
                </label>
                <input
                  id="date"
                  name="date"
                  type="date"
                  value={formData.date || ""} // Ensure value is always defined
                  onChange={handleInputChange}
                  className="w-full rounded-md border-0 py-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600"
                  required
                />
              </div>

              {/* Start Time */}
              <div>
                <label
                  htmlFor="start_time"
                  className="block text-sm font-medium text-gray-900"
                >
                  Start Time
                </label>
                <input
                  id="start_time"
                  name="start_time"
                  type="time"
                  value={formData.start_time || ""} // Ensure value is always defined
                  onChange={handleInputChange}
                  className="w-full rounded-md border-0 py-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600"
                  required
                />
              </div>

              {/* End Time */}
              <div>
                <label
                  htmlFor="end_time"
                  className="block text-sm font-medium text-gray-900"
                >
                  End Time
                </label>
                <input
                  id="end_time"
                  name="end_time"
                  type="time"
                  value={formData.end_time || ""} // Ensure value is always defined
                  onChange={handleInputChange}
                  className="w-full rounded-md border-0 py-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600"
                  required
                />
              </div>

              {/* Is Paid */}
              <div className="flex items-center">
                <label className="mr-4 text-gray-900">Is Paid?</label>
                <input
                  type="checkbox"
                  name="is_paid"
                  checked={formData.is_paid || false} // Ensure value is always defined
                  onChange={() =>
                    setFormData({ ...formData, is_paid: !formData.is_paid })
                  }
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-600"
                />
              </div>

              {/* Ticket Price (shown only if "is_paid" is true) */}
              {formData.is_paid && (
                <div className="flex flex-wrap gap-2">
                  <div>
                    <label
                      htmlFor="ticket_price"
                      className="block text-sm font-medium text-gray-900"
                    >
                      Ticket Price
                    </label>
                    <input
                      id="ticket_price"
                      name="ticket_price"
                      type="number"
                      value={formData.ticket_price || 0} // Ensure value is always defined
                      onChange={handleInputChange}
                      className="w-full rounded-md border-0 py-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600"
                      required
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="discount"
                      className="block text-sm font-medium text-gray-900"
                    >
                      Discount %
                    </label>
                    <input
                      id="discount"
                      name="discount"
                      type="number"
                      max={100}
                      value={formData.discount || 0} // Ensure value is always defined
                      onChange={handleInputChange}
                      className="w-full rounded-md border-0 py-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600"
                      required
                    />
                  </div>
                </div>
              )}

              {/* Max Attendees */}
              <div>
                <label
                  htmlFor="max_attendees"
                  className="block text-sm font-medium text-gray-900"
                >
                  Max Attendees
                </label>
                <input
                  id="max_attendees"
                  name="max_attendees"
                  type="number"
                  min={0}
                  value={formData.max_attendees || 0} // Ensure value is always defined
                  onChange={handleInputChange}
                  className="w-full rounded-md border-0 py-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600"
                />
              </div>

              {/* Category Selection */}
              <div className="bg-gray-100 p-4 rounded-lg sm:col-span-3">
                <p className="font-semibold text-gray-900">Categories:</p>
                <div className="flex flex-wrap space-x-2">
                  {categories.map((category) => (
                    <label
                      key={category._id}
                      className="flex items-center cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={formData.category.includes(category._id)}
                        onChange={() => handleCheckboxChange(category._id)}
                        className="mr-1 text-indigo-600"
                      />
                      <span className="text-gray-900">{category.name}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Food Stalls Checkbox */}
              <div className="flex items-center sm:col-span-3">
                <label className="mr-4 text-gray-900">
                  Do you want food stalls?
                </label>
                <input
                  type="checkbox"
                  checked={formData.food_stalls}
                  onChange={() =>
                    setFormData({
                      ...formData,
                      food_stalls: !formData.food_stalls,
                    })
                  }
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-600"
                />
              </div>

              {/* Description */}
              <div className="sm:col-span-3">
                <label
                  htmlFor="description"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Description
                </label>
                <div className="mt-2">
                  <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows="4"
                    className="block w-full rounded-md border-0 py-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    placeholder="Enter event description..."
                  />
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="button"
                onClick={creator}
                disabled={loading}
                className={`w-full mt-4 bg-indigo-600 text-white p-2 rounded-lg focus:outline-none focus:ring-2 ${
                  loading ? "opacity-50" : ""
                }`}
              >
                {loading ? "Updating..." : "Update Event"}
              </button>

              {/* Success & Error Messages */}
              {success && <p className="text-green-600">{success}</p>}
              {error && <p className="text-red-600">{error}</p>}
            </div>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};

export default EditEvent;
