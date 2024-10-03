import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { myConstant } from '../../const/const';
import { PhotoIcon } from '@heroicons/react/24/solid';

const dummyLocations = [
  'New York',
  'Los Angeles',
  'Chicago',
  'Houston',
  'Phoenix',
  'Philadelphia',
];

const CreateEvent = () => {
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
    images: Array(4).fill(null),
    food_stalls: false,
  });

  const [categories, setCategories] = useState([]);
  const [imagePreviews, setImagePreviews] = useState(Array(4).fill(null));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const token = JSON.parse(localStorage.getItem('events-app'))["token"];

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
        console.error('Error fetching categories:', error);
        toast.error('Error fetching categories');
      }
    };

    fetchCategories();
  }, [token]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleDescriptionChange = (value) => {
    setFormData({ ...formData, description: value.target.value });
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

  const handleFileChange = (e, index) => {
    const file = e.target.files[0];
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      const newImages = [...formData.images];
      newImages[index] = file;

      setFormData({ ...formData, images: newImages });
      const newPreviews = [...imagePreviews];
      newPreviews[index] = previewUrl;
      setImagePreviews(newPreviews);
    }
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
      const formDataObj = new FormData();
      const date = formatDate(formData.date);
      formDataObj.append('title', formData.title);
      formDataObj.append('description', formData.description);
      formDataObj.append('location', formData.location);
      formDataObj.append('date', date);
      formDataObj.append('startTime', formData.start_time);
      formDataObj.append('endTime', formData.end_time);
      formDataObj.append('isPaid', formData.is_paid);
      formDataObj.append('ticketPrice', formData.is_paid ? formData.ticket_price : 0);
      formDataObj.append('maxAttendees', formData.max_attendees || 0);
      formDataObj.append('category', JSON.stringify(formData.category));
      formDataObj.append('food_stalls', formData.food_stalls);

      for (let i = 0; i < formData.images.length; i++) {
        if (formData.images[i]) {
          formDataObj.append('images', formData.images[i]);
        }
      }

      const response = await fetch(`${myConstant}/api/events/new`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`
        },
        body: formDataObj
      });

      if (!response.ok) {
        const resData = await response.json();
        toast.error(resData.error || 'Error creating event');
        return;
      }

      const data = await response.json();
      toast.success(data.message);

      // Reset form
      setFormData({
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
        images: Array(4).fill(null),
        food_stalls: false,
      });

      setImagePreviews(Array(4).fill(null));
      toast.success('Event created successfully!');
      setSuccess('Event created successfully!');
    } catch (err) {
      setError('Error creating event. Please try again.');
      console.log(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container flex flex-col items-center justify-center">
      <h2 className="text-4xl font-semibold mb-4 text-blue-500 text-center">Create Event</h2>
      <form onSubmit={handleSubmit} className="w-full space-y-4">
        {/* Title */}
        <div className="sm:col-span-3">
          <label htmlFor="title" className="block text-sm font-medium leading-6 text-gray-900">
            Event Title
          </label>
          <div className="mt-2">
            <input
              id="title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              className="bloc w-full rounded-md border-0 py-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              placeholder="Event Title"
              required
            />
          </div>
        </div>
    
        {/* Location Search */}
        <div className="sm:col-span-3">
          <label htmlFor="location" className="block text-sm font-medium leading-6 text-gray-900">
            Location
          </label>
          <div className="mt-2">
            <select
              id="location"
              name="location"
              value={formData.location}
              onChange={handleInputChange}
              className="block w-full rounded-md border-0 py-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
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
        </div>
    
        {/* Date */}
        <div className="sm:col-span-3">
          <label htmlFor="date" className="block text-sm font-medium leading-6 text-gray-900">
            Date
          </label>
          <div className="mt-2">
            <input
              id="date"
              name="date"
              type="date"
              value={formData.date}
              onChange={handleInputChange}
              className="block w-full rounded-md border-0 py-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              required
            />
          </div>
        </div>
    
        {/* Start Time */}
        <div className="sm:col-span-3">
          <label htmlFor="start_time" className="block text-sm font-medium leading-6 text-gray-900">
            Start Time
          </label>
          <div className="mt-2">
            <input
              id="start_time"
              name="start_time"
              type="time"
              value={formData.start_time}
              onChange={handleInputChange}
              className="block w-full rounded-md border-0 py-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              required
            />
          </div>
        </div>
    
        {/* End Time */}
        <div className="sm:col-span-3">
          <label htmlFor="end_time" className="block text-sm font-medium leading-6 text-gray-900">
            End Time
          </label>
          <div className="mt-2">
            <input
              id="end_time"
              name="end_time"
              type="time"
              value={formData.end_time}
              onChange={handleInputChange}
              className="block w-full rounded-md border-0 py-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              required
            />
          </div>
        </div>
    
        {/* Is Paid */}
        <div className="flex items-center">
          <label className="mr-4 text-gray-900">Is Paid?</label>
          <input
            type="checkbox"
            name="is_paid"
            checked={formData.is_paid}
            onChange={() => setFormData({ ...formData, is_paid: !formData.is_paid })}
            className="h-4 w-4 text-indigo-600 focus:ring-indigo-600"
          />
        </div>
    
        {/* Ticket Price */}
        {formData.is_paid && (
          <div className="sm:col-span-3">
            <label htmlFor="ticket_price" className="block text-sm font-medium leading-6 text-gray-900">
              Ticket Price
            </label>
            <div className="mt-2">
              <input
                id="ticket_price"
                name="ticket_price"
                type="number"
                value={formData.ticket_price}
                onChange={handleInputChange}
                className="block w-full rounded-md border-0 py-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                placeholder="Ticket Price"
                required
              />
            </div>
          </div>
        )}
    
        {/* Max Attendees */}
        <div className="sm:col-span-3">
          <label htmlFor="max_attendees" className="block text-sm font-medium leading-6 text-gray-900">
            Max Attendees
          </label>
          <div className="mt-2">
            <input
              id="max_attendees"
              name="max_attendees"
              type="number"
              value={formData.max_attendees}
              onChange={handleInputChange}
              className="block w-full rounded-md border-0 py-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              placeholder="Max Attendees"
            />
          </div>
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
              onChange={handleDescriptionChange}
              rows="4"
              className="block w-full rounded-md border-0 py-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              placeholder="Enter event description..."
            />
          </div>
        </div>
    
        {/* Cover Photo */}
        <div className="sm:col-span-3">
          <label htmlFor="cover-photo" className="block text-sm font-medium leading-6 text-gray-900">
            Cover Photo
          </label>
          <div className="mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-6">
            <div className="text-center w-full">
              <div className="flex justify-center text-sm leading-6 text-gray-600">
                <label
                  htmlFor="file-upload-cover"
                  style={{ backgroundImage: imagePreviews[0] ? `url(${imagePreviews[0]})` : 'none' }}
                  className={`relative flex-1 h-48 pt-4 bg-cover justify-center items-center bg-center rounded-md cursor-pointer hover:text-white font-semibold hover:bg-indigo-600 text-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2 ${imagePreviews[0] ? 'bg-opacity-60' : 'bg-gray-100'}`}
                >
                  <input
                    id="file-upload-cover"
                    type="file"
                    className="sr-only"
                    onChange={(e) => handleFileChange(e, 0)}
                  />
                  <div className="flex flex-col items-center">
                    <PhotoIcon aria-hidden="true" className="mb-2 h-12 w-12 text-gray-300" />
                    <span className="flex items-center justify-center">
                      <span>Upload a file</span>
                      <p className="pl-1 m-0 font-semibold text-black">or drag and drop</p>
                    </span>
                    <p className="text-xs leading-5 font-semibold text-black">PNG, JPG, GIF up to 10MB</p>
                  </div>
                </label>
              </div>
            </div>
          </div>
        </div>
    
        {/* Additional Images */}
        <div className="sm:col-span-3">
          <p className='block text-sm font-medium leading-6 text-gray-900'>More pictures</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {['Image 1', 'Image 2', 'Image 3'].map((label, index) => (
              <div key={index + 1} className="flex flex-col items-center justify-center">
                <label
                  htmlFor={`file-upload-${index + 1}`}
                  style={{ backgroundImage: imagePreviews[index + 1] ? `url(${imagePreviews[index + 1]})` : 'none' }}
                  className={`relative flex w-full flex-col items-center justify-center h-48 bg-cover bg-center rounded-lg cursor-pointer text-indigo-600 font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2 hover:bg-indigo-600 hover:text-white ${imagePreviews[index + 1] ? 'bg-opacity-60' : 'bg-gray-100'}`}
                >
                  <input
                    id={`file-upload-${index + 1}`}
                    type="file"
                    className="sr-only"
                    onChange={(e) => handleFileChange(e, index + 1)}
                  />
                  <div className="flex flex-col items-center">
                    <PhotoIcon aria-hidden="true" className="mb-2 h-12 w-12 text-gray-300" />
                    <span className="mt-2 text-base leading-normal">{label}</span>
                    <p className="text-xs leading-5 font-semibold text-black">PNG, JPG, GIF up to 10MB</p>
                  </div>
                </label>
              </div>
            ))}
          </div>
        </div>
    
        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className={`w-full mt-4 bg-indigo-600 text-white p-2 rounded-lg focus:outline-none focus:ring-2 ${loading ? 'opacity-50' : ''}`}
        >
          {loading ? 'Creating...' : 'Create Event'}
        </button>
    
        {/* Success & Error Messages */}
        {success && <p className="text-green-600">{success}</p>}
        {error && <p className="text-red-600">{error}</p>}
      </form>
    </div>
  
  );
};

export default CreateEvent;
