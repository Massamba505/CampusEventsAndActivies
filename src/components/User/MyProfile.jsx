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
  const [categories, setCategories] = useState([]); // Ensure this is initialized as an empty array
  const [preferences, setPreferences] = useState([]); // Store category preferences
  const [modalVisible, setModalVisible] = useState(false); // Toggle modal visibility

  const token = JSON.parse(localStorage.getItem('events-app'))["token"];

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

  // Handle input changes for profile info
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

  // Handle profile submission
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
      const userData = await response.json();
      setInitialData(userData); // Update initial data
      toast.success('Profile updated successfully!');
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
      console.log(preferences,":fff");
      if (!response.ok) {
        throw new Error('Error updating preferences');
      }
      toast.success('Preferences updated successfully!');
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <>
      <form className="container relative" onSubmit={handleSubmit}>
        <ChangePassword modalVisible={modalVisible} setModalVisible={setModalVisible} />
        <div className="space-y-12">
          <h2 className="text-4xl font-semibold leading-7 text-blue-500 text-center">
            My Profile
          </h2>

          {/* Personal Information */}
          <div className="border-b border-gray-900/10 pb-4">
            <h2 className="text-base font-semibold leading-7 text-gray-900">
              Personal Information
            </h2>
            <p className="mt-1 text-sm leading-6 text-gray-600">
              Use a permanent address where you can receive mail.
            </p>

            <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-3">
              {/* First Name */}
              <div className="sm:col-span-3">
                <label htmlFor="first_name" className="block text-sm font-medium leading-6 text-gray-900">
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
                <label htmlFor="last_name" className="block text-sm font-medium leading-6 text-gray-900">
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
                <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">
                  Email address
                </label>
                <div className="mt-2">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email || ''}
                    readOnly
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1
                      ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset
                      focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>

              {/* Profile Photo */}
              <div>
                <div className="">
                  <label htmlFor="photo" className="block text-sm font-medium leading-6 text-gray-900">
                    Profile Photo
                  </label>
                  <div className="mt-2">
                    <input
                      type="file"
                      name="photo"
                      onChange={handleFileChange}
                      className="block w-full text-sm text-gray-900
                        file:mr-4 file:py-2 file:px-4
                        file:rounded-md file:border-0
                        file:text-sm file:font-semibold
                        file:bg-gray-50 file:text-gray-700
                        hover:file:bg-gray-200"
                    />
                  </div>
                </div>
                  {photoPreview && <img src={photoPreview} alt="Profile Preview" className="mt-2 w-32 h-32 object-cover rounded-full" />}
                </div>

            </div>
          </div>
          <Button type="button" variant="primary" onClick={() => setModalVisible(true)} >Change Password</Button>

          {/* Category Preferences */}
          
    
        {/* Category Selection */}
        <div className="bg-gray-100 p-4 rounded-lg">
          <p className="font-semibold text-gray-900">Categories:</p>
          <div className="flex flex-wrap space-x-2">
            {categories.map((category) => (
              <label key={category._id} className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={preferences.includes(category._id)}
                  onChange={() => handlePreferenceChange(category._id)}
                  className="mr-1 text-indigo-600"
                />
                <span className="text-gray-900">{category.name}</span>
              </label>
            ))}
          </div>
          <Button className='mt-5' type="button" onClick={handlePreferencesSubmit} variant="primary">Update Preferences</Button>
        </div>
          <div className="flex justify-end mt-4">
            <Button type="submit" variant="primary">Save Changes</Button>
          </div>
        </div>
      </form>
    </>
  );
}
