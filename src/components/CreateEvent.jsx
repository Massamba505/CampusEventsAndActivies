import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import ReactQuill from 'react-quill'; // Import React Quill
import { Editor } from '@tinymce/tinymce-react';
import 'react-quill/dist/quill.snow.css'; // Import styles for the editor
import { myConstant } from '../const/const';

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

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(myConstant + '/api/category');
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
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleDescriptionChange = (value) => {
    setFormData({ ...formData, description: value }); // Update the description
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

      const response = await fetch(myConstant + '/api/events/new', {
        method: 'POST',
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
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="flex flex-col items-center justify-center w-full md:max-w-4xl max-w-lg bg bg-white p-8 rounded-lg shadow-lg space-y-4">
        <h2 className="text-2xl font-semibold mb-4 text-blue-600">Create Event</h2>
        <form onSubmit={handleSubmit} className="w-full space-y-4">
          {/* Title */}
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            className="input input-bordered input-info w-full focus:outline-none"
            placeholder="Event Title"
            required
          />


          {/* Location Search */}
          <select
            name="location"
            value={formData.location}
            onChange={handleInputChange}
            className="select select-info w-full "
            required
          >
            <option value="">Select Location</option>
            {dummyLocations.map((loc) => (
              <option key={loc} value={loc}>
                {loc}
              </option>
            ))}
          </select>

          {/* Date */}
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleInputChange}
            className="input input-bordered input-info w-full focus:outline-none"
            required
          />

          {/* Start Time */}
          <input
            type="time"
            name="start_time"
            value={formData.start_time}
            onChange={handleInputChange}
            className="input input-bordered input-info w-full focus:outline-none"
            required
          />

          {/* End Time */}
          <input
            type="time"
            name="end_time"
            value={formData.end_time}
            onChange={handleInputChange}
            className="input input-bordered input-info w-full focus:outline-none"
            required
          />

          {/* Is Paid */}
          <div className="bg-white flex items-center">
            <label className="mr-4 text-black">Is Paid?</label>
            <input
              type="checkbox"
              name="is_paid"
              checked={formData.is_paid}
              onChange={() => setFormData({ ...formData, is_paid: !formData.is_paid })}
            />
          </div>

          {/* Ticket Price */}
          {formData.is_paid && (
            <input
              type="number"
              name="ticket_price"
              value={formData.ticket_price}
              onChange={handleInputChange}
              className="input input-bordered input-info w-full focus:outline-none"
              placeholder="Ticket Price"
              required
            />
          )}

          {/* Max Attendees */}
          <input
            type="number"
            name="max_attendees"
            value={formData.max_attendees}
            onChange={handleInputChange}
            className="input input-bordered input-info w-full focus:outline-none"
            placeholder="Max Attendees"
          />

          {/* Category Selection */}
          <div className="bg-white p-2 rounded-lg border">
            <p className="font-semibold text-black">Categories:</p>
            <div className="flex flex-wrap space-x-2">
              {categories.map((category) => (
                <label key={category._id} className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.category.includes(category._id)}
                    onChange={() => handleCheckboxChange(category._id)} // Pass category _id
                    className="mr-1  accent-blue-600"
                  />
                  <span className="text-black">{category.name}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Food Stalls Checkbox */}
          <div className="bg-white flex items-center">
            <label className="mr-4 text-black">Do you want food stalls?</label>
            <input
              type="checkbox"
              checked={formData.food_stalls}
              onChange={() => setFormData({ ...formData, food_stalls: !formData.food_stalls })}
            />
          </div>

          <hr></hr>

          {/* Description */}
          <div className="mb-4">
              <Editor
                onEditorChange={handleDescriptionChange}
                apiKey='ks0pq7bt13hxp9kzhr0zkke50i57vcw94eiej65hok5zc0p2'
                initialValue="<i>Write the event description here...</i>"
                init={{
                  height: 500,
                  menubar: false,
                  plugins: [
                    'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
                    'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
                    'insertdatetime', 'media', 'table', 'code', 'help', 'wordcount'
                  ],
                  toolbar: 'undo redo | blocks | ' +
                    'bold italic forecolor | alignleft aligncenter ' +
                    'alignright alignjustify | bullist numlist outdent indent | ' +
                    'removeformat | help',
                  content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }'
                }}
              />
          </div>

          <hr></hr>

          {/* Image Uploads */}
          <div className="flex flex-col space-y-4">
            {/* Header Image */}
            <div className="flex flex-col">
              <label className="text-black">Header Image</label>
              <input
                type="file"
                onChange={(e) => handleFileChange(e, 0)}
                className="file-input file-input-bordered file-input-info w-full max-w-xs"
              />
              {imagePreviews[0] && (
                <img
                  src={imagePreviews[0]}
                  alt="Header Preview"
                  className="w-full h-32 object-cover rounded-lg mt-2"
                />
              )}
            </div>

            {/* Additional Images */}
            <div className="grid grid-cols-3 gap-4">
              {['Image 1', 'Image 2', 'Image 3'].map((label, index) => (
                <div key={index + 1} className="flex flex-col">
                  <label className="text-black">{label}</label>
                  <input
                    type="file"
                    onChange={(e) => handleFileChange(e, index + 1)}
                    className="bg-blue-500 md:bg-white file-input file-input-bordered file-input-info w-full max-w-xs"
                  />
                  {imagePreviews[index + 1] && (
                    <img
                      src={imagePreviews[index + 1]}
                      alt={`Preview ${index + 1}`}
                      className="w-full h-32 object-cover rounded-lg mt-2"
                    />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full mt-3 bg-blue-500 text-white p-2 rounded-lg focus:outline-none focus:ring-2 ${loading ? 'opacity-50' : ''}`}
          >
            {loading ? 'Creating...' : 'Create Event'}
          </button>

          {/* Success & Error Messages */}
          {success && <p className="text-green-500">{success}</p>}
          {error && <p className="text-red-500">{error}</p>}
        </form>
      </div>
    </div>
  );
};

export default CreateEvent;
