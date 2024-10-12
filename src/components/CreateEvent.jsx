import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
// import { Editor } from '@tinymce/tinymce-react';
// import 'react-quill/dist/quill.snow.css'; // Import styles for the editor
import { myConstant } from '../const/const';
import Navbar from './Navbar';

const dummyLocations = [
  'MSL005',
  "FNB36",
  "MSL001",
  "Great Hall",
  "Wits Theatre",
  "Downstairs Theatre",
  "Amphitheatre",
  "Nunnery",
  "Sturrock Park",
  "Library Lawns",
  "Law Lawns",
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
  const [status,setStatus] = useState('Creating...');
  const token = JSON.parse(localStorage.getItem('events-app'))["token"];

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(myConstant + '/api/category',
          {
            method:"GET",
            headers:{
              "Authorization":`Bearer ${token}`,
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
    const fetchVenues = async () => {
      try {
        const response = await fetch(myConstant + '/api/venues/',
          {
            method:"GET",
            headers:{
              "Authorization":`Bearer ${token}`,
              "Content-Type": "application/json"
            }
          });
        if (!response.ok) {
          throw new Error('Failed to fetch Venues');
        }
        while (dummyLocations.length > 0) {
          dummyLocations.pop();
        }
        const data = await response.json();
        //console.log(data);
        for (let i=0;i<data.length;i++){
          if (data[i].status){
            dummyLocations.push(data[i].name);
          }
        }
      } catch (error) {
        console.error('Error fetching Venues:', error);
        toast.error('Error fetching Venues');
      }
    };
    fetchVenues();
    fetchCategories();
  }, [token]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleDescriptionChange = (value) => {
    setFormData({ ...formData, description: value.target.value }); // Update the description
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

  const [searchTerm,setSearchTerm]=useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };
  const handleOther = (e) => {
    setSearchTerm(e.target.value);
    setShowDropdown(true);
  };
  const handleSelect = (loc) => {
    setSearchTerm(loc);
    // setFormData({ ...formData, location: loc });
    setShowDropdown(false);
  };
  const handleBlur = (e) => {
    setShowDropdown(false);
    
  };
  const filteredLocations = dummyLocations.filter((loc) =>
    loc.toLowerCase().includes(searchTerm.toLowerCase())
  );
  // returns:
  //       -> Invalid Date
  //      4 -> Some error
  //      3 -> Overlap, time slot booked
  //      2 -> Start time > End time
  //      1 -> Venue unavailable
  //      0 -> Available
  //     -1 -> Fetch venues error
  //     -2 -> Fetch Bookings error
  //     -3 -> Fetch our Events error
  const checkAvailability = async () => {
    try{
      const formDataObj = new FormData();
      const date = formatDate(formData.date);
      formDataObj.append('title', formData.title);
      formDataObj.append('description', formData.description);
      formDataObj.append('location', searchTerm);
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

      //get the venues  from group2a
      let venueMap={};
      const response1 = await fetch(
        `https://group2afunctionapp.azurewebsites.net/api/getVENUE?code=lVPnP4OFOCMQEJe3ZcIOQfywgWO9Ag5WtiixpUIwv340AzFuYZT3dQ%3D%3D`
      );
      if (!response1.ok) {
        const resData = await response1.json();
        toast.error(resData.error || 'Error fetching Group 2 api venues' );
        return -1;
      }
      const data1 = await response1.json();
      for (let i=0;i<data1.length;i++){
        if (searchTerm==data1[i]["VENUE_NAME"]){
          if (data1[i]["VENUE_STATUS"]=="Unavailable"){
            return 1;
          }
        }
        venueMap[data1[i]["VENUE_ID"]]=data1[i]["VENUE_NAME"];
      }

      //get the Bookings from group2a
      const response2 = await fetch(
        `https://group2afunctionapp.azurewebsites.net/api/getBOOKING?code=JDsgJhmxzmtNJeOdiPSKbEAPlrI61hA5RDMlGKh4OzxyAzFuGvO2yQ%3D%3D`
      );
      if (!response2.ok) {
        console.log("Bookings 1 error");
        const resData = await response2.json();
        toast.error(resData.error || 'Error fetching Group 2 api schedule' );
        return -2;
      }
      const data2 = await response2.json();
      for (let i = 0; i < data2.length; i++){
        if (searchTerm == venueMap[data2[i]["VENUE_ID"]]) {
          if (formData.date == data2[i]["DATE"].split('T')[0]) {
            const convertToTime = (timeStr) => {
              const [hours, minutes, seconds = '00'] = timeStr.split(':');
              const date = new Date();
              date.setHours(parseInt(hours, 10), parseInt(minutes, 10), parseInt(seconds, 10), 0);
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
              console.log('Clash of events');
              return 3;
            } 
            
          }
        }
      }
      
      //get the events from our backend
      const response3 = await fetch(`${myConstant}/api/events`, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });

      if (!response3.ok) {
        console.log("events 2 error");
        const resData = await response3.json();
        toast.error(resData.error || 'Error getting our events' );
        return -3;
      }
      const datax = await response3.json();
      const data3=datax.data;
      //console.log("What");
      //console.log(data3);
      for (let i = 0; i < data3.length; i++){
        if (data3[i].isCancelled){
          continue;
        }
        //console.log(`${searchTerm}:${data3[i]["location"]}`);
        if (searchTerm == data3[i]["location"]){
          //console.log("happened1");
          let temp_date = data3[i]["date"].replace(/\//g, '-').split('-');
          temp_date = temp_date.reverse().join('-');
          //console.log(temp_date);
          //console.log(`${formData.date}:${temp_date}`);
          if (formData.date == temp_date){
            //console.log("happened2");
            const convertToTime = (timeStr) => {
              const [hours, minutes, seconds = '00'] = timeStr.split(':');
              const date = new Date();
              date.setHours(parseInt(hours, 10), parseInt(minutes, 10), parseInt(seconds, 10), 0);
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
              console.log('Clash of events');
              return 3;
            } 
            
          }
        }
      }
      return 0;

    } catch (err) {
      setError('Error creating event. Please try again.');
      console.log(err.message);
      return 4;
    } 
  };

  const creator= async(e)=>{
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    setStatus("Checking Availability...");
    let out=await checkAvailability();
    if (out==3){
      toast.error('Venue Booked, Choose a different time');
      setLoading(false);
    }
    else if (out==2){
      toast.error('Start time can\'t be later than end time!');
      setLoading(false);
    }
    else if (out==1){
      toast.error('Venue Unavailable!');
      setLoading(false);
    }
    else if (out==0){
      console.log("Start creating");
      toast.success('Venue Available, Creating event');
      setStatus("Creating...");
      handleSubmit();
    }
    else if (out==4){
      toast.error('Some error occured!');
      setLoading(false);
    }
    else{
      toast.error('Error checking Availability');
      if (out==-1){
        console.log("Fetch venues");
      }
      else if (out==-2){
        console.log("Fetch bookings");
      }
      else if (out==-3){
        console.log("Fetch our events");
      }
      setLoading(false);
    }
    //setLoading(false);
  }
  const handleSubmit = async () => {
    // e.preventDefault();
    // setLoading(true);
    // setError('');
    // setSuccess('');

    try {
      const formDataObj = new FormData();
      const date = formatDate(formData.date);
      formDataObj.append('title', formData.title);
      formDataObj.append('description', formData.description);
      formDataObj.append('location', searchTerm);
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

      for (const [key, value] of formDataObj.entries()) {
        console.log(`${key}: ${value}`);
      }

      const response = await fetch(`${myConstant}/api/events/new`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`
        },
        body: formDataObj // FormData automatically sets the correct headers for file uploads
      });

      if (!response.ok) {
        const resData = await response.json();
        toast.error(resData.error || 'Error creating event',"54587748" );//
        return;
      }

      const data = await response.json();
      console.log(data,"loko")
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
    <div>
      <Navbar/>

      <div className="flex mt-4 items-center justify-center min-h-screen ">
        <div className="flex flex-col items-center justify-center w-full md:max-w-4xl max-w-lg bg bg-white p-8 rounded-lg shadow-lg space-y-4">
          <h2 className="text-2xl font-semibold mb-4 text-blue-600">Create Event</h2>
          <form onSubmit={creator} className="w-full space-y-4">
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
            <div className="relative w-full">
              {/* Text field for input */}
              <input
                type="text"
                placeholder="Search Location"
                value={searchTerm}
                onChange={handleOther}
                className="input input-info w-full mb-2"
                onFocus={() => setShowDropdown(true)} // Show dropdown when input is focused
                onBlur={handleBlur}
              />

              {/* Dropdown options */}
              {showDropdown && (
                <ul className="absolute z-10 w-full bg-white border border-gray-300 max-h-40 overflow-y-auto">
                  {filteredLocations.length > 0 ? (
                    filteredLocations.map((loc) => (
                      <li
                        key={loc}
                        className="p-2 hover:bg-blue-100 cursor-pointer"
                        onMouseDown={() => handleSelect(loc)} // Handle selection
                      >
                        {loc}
                      </li>
                    ))
                  ) : (
                    <li className="p-2 text-gray-500">No results found</li>
                  )}
                </ul>
              )}
            </div>

            

            {/* Date */}
            <div className="relative w-full mb-4">
              <input
                type="date"
                name="date"
                id="date"
                value={formData.date}
                onChange={handleInputChange}
                className="input input-bordered input-info w-full focus:outline-none"
                required
              />
              {formData.date === '' && (
                <span className="absolute left-3 block sm:hidden top-3 text-gray-400 pointer-events-none">
                  Select Date
                </span>
              )}
            </div>


            {/* Start Time */}
            <div className="relative w-full mb-4">
              <input
                type="time"
                name="start_time"
                value={formData.start_time}
                onChange={handleInputChange}
                className="input input-bordered input-info w-full focus:outline-none"
                required
              />
              {formData.start_time === '' && (
                <span className="absolute left-3 block sm:hidden top-3 text-gray-400 pointer-events-none">
                  Select Start Time
                </span>
              )}
            </div>

            {/* End Time */}
            <div className="relative w-full mb-4">
              <input
                type="time"
                name="end_time"
                value={formData.end_time}
                onChange={handleInputChange}
                className="input input-bordered input-info w-full focus:outline-none"
                required
              />
              {formData.end_time === '' && (
                <span className="absolute left-3 block sm:hidden top-3 text-gray-400 pointer-events-none">
                  Select End Time
                </span>
              )}
            </div>


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
            <div className="w-full">
              <textarea
                value={formData.description}
                onChange={handleDescriptionChange}
                rows="8"
                className="w-full p-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-300"
                placeholder="Enter event description..."
              />
            </div>

            <hr></hr>

              {/* Header Image */}
              <div className="flex w-full items-center justify-center">
                <label className="w-64 flex flex-col items-center px-4 py-6 bg-white text-blue rounded-lg tracking-wide uppercase border border-blue cursor-pointer text-blue-400 hover:bg-blue-600 hover:text-blue-600">
                  <svg className="w-8 h-8" fill="currentColor" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                    <path d="M16.88 9.1A4 4 0 0 1 16 17H5a5 5 0 0 1-1-9.9V7a3 3 0 0 1 4.52-2.59A4.98 4.98 0 0 1 17 8c0 .38-.04.74-.12 1.1zM11 11h3l-4-4-4 4h3v3h2v-3z" />
                  </svg>
                  <span className="mt-2 text-base leading-normal">Select a Header Image</span>
                  <input type="file" onChange={(e) => handleFileChange(e, 0)} className="hidden" />
                </label>
                {imagePreviews[0] && (
                  <img
                    src={imagePreviews[0]}
                    alt="Header Preview"
                    className="w-full h-32 object-cover rounded-lg ml-2"
                  />
                )}
              </div>

              {/* Additional Images */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {['Image 1', 'Image 2', 'Image 3'].map((label, index) => (
                  <div key={index + 1} className="flex flex-col items-center justify-center bg-grey-lighter">
                    <label className="w-64 flex flex-col items-center px-4 py-6 bg-white text-blue rounded-lg tracking-wide uppercase border border-blue cursor-pointer  text-blue-400 hover:bg-blue-600 hover:text-blue-600">
                      <svg className="w-8 h-8" fill="currentColor" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                        <path d="M16.88 9.1A4 4 0 0 1 16 17H5a5 5 0 0 1-1-9.9V7a3 3 0 0 1 4.52-2.59A4.98 4.98 0 0 1 17 8c0 .38-.04.74-.12 1.1zM11 11h3l-4-4-4 4h3v3h2v-3z" />
                      </svg>
                      <span className="mt-2 text-base leading-normal">{label}</span>
                      <input type="file" onChange={(e) => handleFileChange(e, index + 1)} className="hidden" />
                    </label>
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

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full mt-3 bg-blue-500 text-white p-2 rounded-lg focus:outline-none focus:ring-2 ${loading ? 'opacity-50' : ''}`}
            >
              {loading ? status : 'Create Event'}
            </button>

            {/* Success & Error Messages */}
            {success && <p className="text-green-500">{success}</p>}
            {error && <p className="text-red-500">{error}</p>}
          </form>
        </div>
      </div>

    </div>
  );
};

export default CreateEvent;
