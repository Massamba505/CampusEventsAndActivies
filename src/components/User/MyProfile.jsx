import { useEffect, useState } from 'react';
import { PhotoIcon } from '@heroicons/react/24/solid';
import { Button } from 'react-bootstrap';
import { myConstant } from '../../const/const';
import toast from 'react-hot-toast';
import ChangePassword from './ChangePassword';

export default function MyProfile() {
  const [initialData, setInitialData] = useState({});
  const [formData, setFormData] = useState({});
  const [photoPreview, setPhotoPreview] = useState(null);
  const [modalVisible, setModalVisible] = useState(false); // Toggle modal visibility

  const [categories, setCategories] = useState([]); // Ensure this is initialized as an empty array
  const [preferences, setPreferences] = useState([]); // Store category preferences

  const token = JSON.parse(localStorage.getItem('events-app'))["token"];

  // Fetch user data on component mount
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch(myConstant + '/api/user', {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        });
        if (!response.ok) {
          const userData = await response.json();
          throw new Error(userData.error);
        }

        const userData = await response.json();
        setInitialData(userData);
        setFormData(userData);
        setPhotoPreview(userData.photoUrl); // Set the existing photo URL
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };
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
          throw new Error('Error fetching categories');
        }
        const data = await response.json();
        setCategories(data || []); // Ensure categories is an array
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    const fetchPreferences = async () => {
      try {
        const response = await fetch(myConstant + '/api/user/preferences', {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        });
        if (!response.ok) {
          throw new Error('Error fetching preferences');
        }
        const data = await response.json();
        setPreferences(data.preferred_category || []); // Ensure preferences is an array
      } catch (error) {
        console.error('Error fetching preferences:', error);
      }
    };

    fetchUserData();
    fetchCategories();
    fetchPreferences();
  }, [token]);

  // Handle input changes for category preferences
  const handlePreferenceChange = (categoryId) => {
    console.log(categoryId)
    if (preferences.includes(categoryId)) {
      setPreferences(preferences.filter((id) => id !== categoryId));
    } else {
      setPreferences([...preferences, categoryId]);
    }
  };

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    const inputValue = type === 'checkbox' ? checked : value;
    setFormData({ ...formData, [name]: inputValue });
  };

  // Handle file input change for profile photo
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, photoUrl: file }); // Set the file in formData
      setPhotoPreview(URL.createObjectURL(file)); // Preview the new photo
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    const updatedData = new FormData(); // FormData to handle both text fields and the image
    
    if (formData.firstname.trim() !== initialData.firstname || formData.lastname.trim() !== initialData.lastname) {
      updatedData.append('firstname', formData.firstname);
      updatedData.append('lastname', formData.lastname);
      updatedData.append('fullname', formData.firstname + " " + formData.lastname);
    }

    for (const key in formData) {
      if (formData[key] !== initialData[key] && key !== 'photoUrl') {
        updatedData.append(key, formData[key]);
      }
    }

    if (formData.photoUrl) {
      updatedData.append('image', formData.photoUrl);
    }

    if (Array.from(updatedData.keys()).length === 0) {
      toast('No changes to save.');
      return;
    }

    try {
      // Send the updated data to the backend
      const response = await fetch(`${myConstant}/api/user/update`, {
        method: "PUT",
        headers: {
          "Authorization": `Bearer ${token}`
        },
        body: updatedData
      });

      if (!response.ok) {
        const userData = await response.json();
        throw new Error(userData.error);
      }

      toast.success('Profile updated successfully!');
      
      const fetchUserData = async () => {
        try {
          const response = await fetch(myConstant + '/api/user', {
            method: "GET",
            headers: {
              "Authorization": `Bearer ${token}`,
              "Content-Type": "application/json"
            }
          });
          if (!response.ok) {
            const userData = await response.json();
            throw new Error(userData.error);
          }

          const userData = await response.json();
          setInitialData(userData);
          setFormData(userData);
          setPhotoPreview(userData.photoUrl); // Set the existing photo URL
          console.log(userData);
        } catch (error) {
          console.error('Error fetching user data:', error);
        }
      };
      fetchUserData()
    } catch (error) {
      toast.error(error.message);
    }
  };

  // Handle preference submission
  const handlePreferencesSubmit = async () => {
    try {
      const response = await fetch(`${myConstant}/api/user/preferences`, {
        method: "PUT",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ preferred_category: preferences}),
      });
      if (!response.ok) {
        throw new Error('Error updating preferences');
      }
      toast.success('preference updated successfully!');
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <>
      <form className="sm:container p-2 sm:p-4 relative" onSubmit={handleSubmit}>
        <ChangePassword modalVisible = {modalVisible} setModalVisible={setModalVisible}/>
        <div className="space-y-6 sm:space-y-12">
          <h1 className="text-3xl text-center text-blue-500 font-bold mb-4">My Profile</h1>
          

          {/* Personal Information */}
          <div className="border-b border-gray-900/10 pb-12">
            <h2 className="text-base font-semibold leading-7 text-gray-900">
              Personal Information
            </h2>
            <p className="mt-1 text-sm leading-6 text-gray-600">
              Use a permanent address where you can receive mail.
            </p>

            <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
              {/* First Name */}
              <div className="sm:col-span-3">
                <label
                  htmlFor="first_name"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  First name
                </label>
                <div className="mt-2">
                  <input
                    id="first_name"
                    name="firstname"
                    type="text"
                    autoComplete="given-name"
                    value={formData.firstname || ''}
                    onChange={handleInputChange}
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1
                      ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset
                      focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>

              {/* Last Name */}
              <div className="sm:col-span-3">
                <label
                  htmlFor="last_name"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Last name
                </label>
                <div className="mt-2">
                  <input
                    id="last_name"
                    name="lastname"
                    type="text"
                    autoComplete="family-name"
                    value={formData.lastname || ''}
                    onChange={handleInputChange}
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1
                      ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset
                      focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>

              {/* Email */}
              <div className="sm:col-span-4">
                <label
                  htmlFor="email"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Email address
                </label>
                <div className="mt-2">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    value={formData.email || ''}
                    onChange={handleInputChange}
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1
                      ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset
                      focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>

              {/* Change Password Button */}
              <div className="sm:col-span-2 sm:col-start-1">
                <div className="mt-2">
                  <Button
                    type="button"
                    className="block w-40 rounded-md border-0 py-1.5 bg-gray-200 text-gray-900 shadow-sm
                      ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset
                      focus:ring-indigo-600"
                    onClick={() => setModalVisible(true)} // Open modal
                  >
                    Change password
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Profile Photo */}
          <div className="border-b border-gray-900/10 pb-12">
            <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
              {/* About Section */}
              <div className="col-span-full">
                <label
                  htmlFor="about"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  About
                </label>
                <div className="mt-2">
                  <textarea
                    id="about"
                    name="about"
                    rows={3}
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1
                      ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset
                      focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    value={formData.about || ''}
                    onChange={handleInputChange}
                  />
                </div>
                <p className="mt-3 text-sm leading-6 text-gray-600">
                  Write a few sentences about yourself.
                </p>
              </div>

              {/* Profile Photo */}
              <div className="sm:col-span-3">
                <label
                  htmlFor="photo"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Photo
                </label>
                <div className="mt-2 flex justify-center border border-dashed border-gray-900/25 rounded-full w-32 h-32 sm:w-48 sm:h-48 overflow-hidden">
                  <label
                    htmlFor="file-upload-photo"
                    className="relative flex flex-col justify-center items-center w-full h-full bg-cover bg-center rounded-md cursor-pointer hover:text-white font-semibold hover:bg-indigo-600 text-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2"
                  >
                    <input
                      id="file-upload-photo"
                      type="file"
                      className="sr-only"
                      accept="image/*"
                      onChange={handleFileChange}
                    />
                    {photoPreview ? (
                      <img
                        src={photoPreview}
                        alt="Profile"
                        className="h-full w-full object-cover rounded-full"
                      />
                    ) : (
                      <div className="flex flex-col items-center">
                        <PhotoIcon
                          aria-hidden="true"
                          className="mb-2 h-12 w-12 text-gray-300"
                        />
                        <span>Change</span>
                      </div>
                    )}
                  </label>
                </div>
              </div>
            </div>
          </div>
          
          {/* Category Selection */}
          <div className="border-b pb-12">
            <p className="font-semibold text-gray-900">Preferences:</p>
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <label onClick={() => handlePreferenceChange(category._id)} key={category._id} className={`flex items-center text-black text-decoration-none font-bold py-1 px-2 space-x-1 sm:space-x-4 border ${preferences.includes(category._id)?" bg-blue-500 ":"hover:bg-gray-200"} rounded-lg hover:scale-105  transition-all duration-200 cursor-pointer`}>
                  <img 
                    src={category.image} 
                    alt={category.name} 
                    className="w-4 h-4 md:w-
8 md:h-8 rounded"                  />
                  <span className="text-gray-900">{category.name}</span>
                </label>
              ))}
            </div>
            <Button className='mt-4' type="button" onClick={handlePreferencesSubmit} variant="primary">Update Preferences</Button>
          </div>

          {/* Notifications */}
          <div className="border-b border-gray-900/10 pb-12">
            <h2 className="text-base font-semibold leading-7 text-gray-900">
              Notifications
            </h2>
            <p className="mt-1 text-sm leading-6 text-gray-600">
              {"We'll"} always let you know about important changes, but you pick what else you want to hear about.
            </p>

            <div className="mt-10 space-y-10">
              <fieldset>
                <legend className="text-sm font-semibold leading-6 text-gray-900">
                  By Email
                </legend>
                <div className="mt-6 space-y-6">
                  {/* Comments Notification */}
                  <div className="relative flex gap-x-3">
                    <div className="flex h-6 items-center">
                      <input
                        id="comments"
                        name="comments"
                        type="checkbox"
                        checked={formData.comments || false}
                        onChange={handleInputChange}
                        className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                      />
                    </div>
                    <div className="text-sm leading-6">
                      <label
                        htmlFor="comments"
                        className="font-medium text-gray-900"
                      >
                        Comments
                      </label>
                      <p className="text-gray-500">
                        Get notified when someone posts a comment on your event.
                      </p>
                    </div>
                  </div>
                </div>
              </fieldset>

              <fieldset>
                <legend className="text-sm font-semibold leading-6 text-gray-900">
                  Push Notifications
                </legend>
                <p className="mt-1 text-sm leading-6 text-gray-600">
                  These are delivered via SMS to your mobile phone.
                </p>
                <div className="mt-6 space-y-6">
                  {/* Push Notification Options */}
                  <div className="flex items-center gap-x-3">
                    <input
                      id="push-everything"
                      name="push_notifications"
                      type="radio"
                      value="everything"
                      checked={formData.push_notifications === 'everything'}
                      onChange={handleInputChange}
                      className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-600"
                    />
                    <label
                      htmlFor="push-everything"
                      className="block text-sm font-medium leading-6 text-gray-900"
                    >
                      Everything
                    </label>
                  </div>
                  <div className="flex items-center gap-x-3">
                    <input
                      id="push-email"
                      name="push_notifications"
                      type="radio"
                      value="email"
                      checked={formData.push_notifications === 'email'}
                      onChange={handleInputChange}
                      className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-600"
                    />
                    <label
                      htmlFor="push-email"
                      className="block text-sm font-medium leading-6 text-gray-900"
                    >
                      Same as email
                    </label>
                  </div>
                  <div className="flex items-center gap-x-3">
                    <input
                      id="push-nothing"
                      name="push_notifications"
                      type="radio"
                      value="nothing"
                      checked={formData.push_notifications === 'nothing'}
                      onChange={handleInputChange}
                      className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-600"
                    />
                    <label
                      htmlFor="push-nothing"
                      className="block text-sm font-medium leading-6 text-gray-900"
                    >
                      No push notifications
                    </label>
                  </div>
                </div>
              </fieldset>
            </div>

          </div>
        </div>

        {/* Form Actions */}
        <div className="mt-6 flex items-center justify-end gap-x-6">
          <button
            type="button"
            className="text-sm font-semibold leading-6 text-gray-900"
            onClick={() => setFormData(initialData)} // Reset form
          >
            Cancel
          </button>
          <button
            type="submit"
            className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm
              hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2
              focus-visible:outline-indigo-600"
          >
            Save
          </button>
        </div>
      </form>
      
      </>
  );
}
