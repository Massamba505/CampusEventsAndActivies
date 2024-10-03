import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { Dialog } from '@headlessui/react';
import { myConstant } from '../../const/const';

const dummyLocations = [
  'New York',
  'Los Angeles',
  'Chicago',
  'Houston',
  'Phoenix',
  'Philadelphia',
];

const EditEvent = ({ eventId, modalVisible, setModalVisible, onUpdate }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: '',
    date: '',
    start_time: '',
    end_time: '',
    is_paid: false,
    ticket_price: 0,
    max_attendees: '',
    category: [],
    food_stalls: false,
  });

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const token = JSON.parse(localStorage.getItem('events-app'))["token"];

  useEffect(() => {
    const fetchEventData = async () => {
      try {
        const response = await fetch(`${myConstant}/api/events/${eventId}`, {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch event details');
        }

        let data = await response.json();
        data = data.data
        const dateString = data.date;
        const dateParts = dateString.split('/'); // Split by '/'
        const formattedDate = `${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`; // Reformat to yyyy-MM-dd

        // Ensure date is always formatted correctly
        data.date = formattedDate;
        const catego = [];
        for(let i = 0; i < data.category.length; i++){
          catego.push(data.category[i]._id);
        }
        data.category = catego;

        setFormData({
          title: data.title || '',
          description: data.description || '',
          location: data.location || '',
          date: formattedDate,
          start_time: data.startTime || '',
          end_time: data.endTime || '',
          is_paid: data.isPaid || false,
          ticket_price: data.ticketPrice || 0,
          max_attendees: data.maxAttendees || '',
          category: data.category || [],
          food_stalls: data.food_stalls || false,
        });
      } catch (error) {
        toast.error('Error fetching event details');
      }
    };

    if (modalVisible) {
      fetchEventData();
    }
  }, [modalVisible, eventId, token]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(myConstant + '/api/category', {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch categories');
        }

        const data = await response.json();
        setCategories(data);
      } catch (error) {
        toast.error('Error fetching categories');
      }
    };

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
    const dateParts = dateString.split('-');
    return `${dateParts[2]}/${dateParts[1]}/${dateParts[0]}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

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
        food_stalls: formData.food_stalls
      };

      const response = await fetch(`${myConstant}/api/events/update/${eventId}`, {
        method: "PUT",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(formDataObj)
      });

      if (!response.ok) {
        const resData = await response.json();
        toast.error(resData.error || 'Error updating event');
        return;
      }

      toast.success('Event updated successfully!');
      setSuccess('Event updated successfully!');
      setModalVisible(false);
      onUpdate();
    } catch (err) {
      setError('Error updating event. Please try again.');
      console.log(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={modalVisible} onClose={() => setModalVisible(false)} className="relative z-10">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center">
        <Dialog.Panel className="relative bg-white rounded-lg shadow-lg w-9/12 max-w-lg max-h-screen overflow-y-auto mt-4">
          <div className="p-6">
            <h2 className="text-4xl font-semibold mb-4 text-blue-500 text-center">Edit Event</h2>
            <div className="space-y-4">
              {/* Title */}
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-900">Event Title</label>
                <input
                  id="title"
                  name="title"
                  value={formData.title || ''}  // Ensure value is always defined
                  onChange={handleInputChange}
                  className="w-full rounded-md border-0 py-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-indigo-600"
                  required
                />
              </div>

              {/* Location */}
              <div>
                <label htmlFor="location" className="block text-sm font-medium text-gray-900">Location</label>
                <select
                  id="location"
                  name="location"
                  value={formData.location || ''}  // Ensure value is always defined
                  onChange={handleInputChange}
                  className="w-full rounded-md border-0 py-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600"
                  required
                >
                  <option value="">Select Location</option>
                  {dummyLocations.map((loc) => (
                    <option key={loc} value={loc}>{loc}</option>
                  ))}
                </select>
              </div>

              {/* Date */}
              <div>
                <label htmlFor="date" className="block text-sm font-medium text-gray-900">Date</label>
                <input
                  id="date"
                  name="date"
                  type="date"
                  value={formData.date || ''}  // Ensure value is always defined
                  onChange={handleInputChange}
                  className="w-full rounded-md border-0 py-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600"
                  required
                />
              </div>

              {/* Start Time */}
              <div>
                <label htmlFor="start_time" className="block text-sm font-medium text-gray-900">Start Time</label>
                <input
                  id="start_time"
                  name="start_time"
                  type="time"
                  value={formData.start_time || ''}  // Ensure value is always defined
                  onChange={handleInputChange}
                  className="w-full rounded-md border-0 py-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600"
                  required
                />
              </div>

              {/* End Time */}
              <div>
                <label htmlFor="end_time" className="block text-sm font-medium text-gray-900">End Time</label>
                <input
                  id="end_time"
                  name="end_time"
                  type="time"
                  value={formData.end_time || ''}  // Ensure value is always defined
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
                  checked={formData.is_paid || false}  // Ensure value is always defined
                  onChange={() => setFormData({ ...formData, is_paid: !formData.is_paid })}
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-600"
                />
              </div>

              {/* Ticket Price (shown only if "is_paid" is true) */}
              {formData.is_paid && (
                <div>
                  <label htmlFor="ticket_price" className="block text-sm font-medium text-gray-900">Ticket Price</label>
                  <input
                    id="ticket_price"
                    name="ticket_price"
                    type="number"
                    value={formData.ticket_price || 0}  // Ensure value is always defined
                    onChange={handleInputChange}
                    className="w-full rounded-md border-0 py-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600"
                    required
                  />
                </div>
              )}

              {/* Max Attendees */}
              <div>
                <label htmlFor="max_attendees" className="block text-sm font-medium text-gray-900">Max Attendees</label>
                <input
                  id="max_attendees"
                  name="max_attendees"
                  type="number"
                  value={formData.max_attendees || ''}  // Ensure value is always defined
                  onChange={handleInputChange}
                  className="w-full rounded-md border-0 py-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600"
                />
              </div>

              {/* Category Selection */}
              <div className="bg-gray-100 p-4 rounded-lg sm:col-span-3">
                <p className="font-semibold text-gray-900">Categories:</p>
                <div className="flex flex-wrap space-x-2">
                  {categories.map((category) => (
                    <label key={category._id} className="flex items-center cursor-pointer">
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
                <label className="mr-4 text-gray-900">Do you want food stalls?</label>
                <input
                  type="checkbox"
                  checked={formData.food_stalls}
                  onChange={() => setFormData({ ...formData, food_stalls: !formData.food_stalls })}
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-600"
                />
              </div>

              {/* Description */}
              <div className="sm:col-span-3">
                <label htmlFor="description" className="block text-sm font-medium leading-6 text-gray-900">
                  Description
                </label>
                <div className="mt-2">
                  <textarea
                    id="description"
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
                onClick={handleSubmit}
                disabled={loading}
                className={`w-full mt-4 bg-indigo-600 text-white p-2 rounded-lg focus:outline-none focus:ring-2 ${loading ? 'opacity-50' : ''}`}
              >
                {loading ? 'Updating...' : 'Update Event'}
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
