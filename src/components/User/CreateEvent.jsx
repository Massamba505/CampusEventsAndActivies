import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { myConstant } from '../../const/const';
import { PhotoIcon } from '@heroicons/react/24/solid';

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
  const [status,setStatus] = useState('Checking Availability...');
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
    //setFormData({ ...formData, location: loc });
    setShowDropdown(false);
  };
  const handleBlur = (e) => {
    setShowDropdown(false);
    
  };
  function isTodayOrFuture(date) {
    const today = new Date();
    const inputDate = new Date(date);
    
    // Set the time of today to midnight for comparison
    today.setHours(0, 0, 0, 0);
    inputDate.setHours(0, 0, 0, 0);
    
    return inputDate >= today; // Check if inputDate is today or in the future
}
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
        const [hours, minutes, seconds = '00'] = timeStr.split(':');
        const date = new Date();
        date.setHours(parseInt(hours, 10), parseInt(minutes, 10), parseInt(seconds, 10), 0);
        return date;
      };

      let formStart = convertToTime2(formData.start_time);
      let formEnd = convertToTime2(formData.end_time);
      if (formStart.getTime() > formEnd.getTime()) {
        console.log("Start time cannot be after end time");
        return 2;
      }
      console.log(formData);
      if(formData.is_paid){
        if (formData.ticket_price<=10){
          return 7;
        }
        if (formData.ticket_price>=99999){
          return 9;
        }
      }
      if (formData.max_attendees<1||formData.max_attendees%1!=0){
        return 8;
      }

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
      toast.error(' Invalid Date, start time or end time!');
      setLoading(false);
    }
    else if (out==7){
      toast.error('Ticket Price must be greater than 10!');
      setLoading(false);
    }
    else if (out==9){
      toast.error('Ticket Price must be less than 99999!');
      setLoading(false);
    }
    else if (out==8){
      toast.error('Max attendees must be whole and greater than 1!');
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
    <div className="container flex flex-col items-center justify-center">
      <h2 className="text-4xl font-semibold mb-4 text-blue-500 text-center">Create Event</h2>
      <form onSubmit={creator} className="w-full space-y-4">
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
