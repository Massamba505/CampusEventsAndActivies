import { Menu, MenuButton, MenuItems, MenuItem } from '@headlessui/react';
import { BellIcon } from '@heroicons/react/24/outline';
import logo from "../assets/logo.jpeg";
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuthContext } from '../context/AuthContext';
import { myConstant } from '../const/const';
import { useEffect, useState } from 'react';
import { AlarmClockIcon, BellDotIcon, CalendarDays, CircleCheckBigIcon, DotIcon } from 'lucide-react';
import { auth } from '../firebase.config';

export default function Navbar() {
  const{authUser,setAuthUser} = useAuthContext();
  const navigate = useNavigate();
  const [pp,setPp] = useState("");
  const [read,setRead] = useState("");
  

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
        setPp(userData.photoUrl);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };
    const fetchNotifications = async () => {
      try {
        const response = await fetch(myConstant + '/api/user/notifications/latest', {
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
        setRead(userData.notifications);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    if(!authUser.photoUrl){
      fetchUserData();
    }
    else{
      setPp(authUser.photoUrl);
    }
    
    fetchNotifications();
  }, [authUser.photoUrl, token]);

  const handleLogout = async() => {
    const response = await fetch(myConstant + "/api/auth/logout", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      }
    });
    if(response.ok){
      toast.success("Logged out successfully!"); // Show a message or toast
      localStorage.removeItem("events-app");
      setAuthUser(null);
      return;
    }

    const data = await response.json();
    toast(data.error);
  };

  const handleCreate = async() => {
    navigate("/create-event");
  };

  return (
    <nav className="bg-white sticky top-0 pt-2 mb-3 px-2 z-10">
      <div className="mx-auto px-2 border border-white rounded w-full shadow-md">
        <div className="relative flex items-center justify-between">
          <div className="flex">
            <Link to={"/home"} className="flex items-center">
              <img className="w-24 h-16" src={logo} alt="Logo" />
            </Link>
          </div>
          <div className="flex gap-2 items-center">

            {/* Profile dropdown */}
            <Menu as="div" className="relative" >
              <div className='flex flex-row-reverse items-center gap-2'>
                <MenuButton className="relative shadow-md flex rounded-full bg-white text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-white" data-testid="menuThing">
                  <span className="absolute -inset-1.5" />
                  <span className="sr-only">Open user menu</span>
                  <img
                    alt=""
                    src={pp}
                    className="h-10 w-10 md:h-12 md:w-12 rounded-full object-cover"
                    style={{ objectFit: 'cover', objectPosition: 'center' }}
                    
                  />
                  
                </MenuButton>
                <CalendarDays onClick={()=>navigate("/calender")} className='hover:cursor-pointer'></CalendarDays>
                
                <div onClick={()=>navigate("/notifications")} className='relative rounded-full hover:text-white hover:bg-blue-500 hover:cursor-pointer'>
                  {read.length > 0 && (
                    <CircleCheckBigIcon strokeWidth={10} className='absolute rounded-lg right-2 top-1 text-green-500 font-bold h-2 w-2'/>
                  )}
                  <BellIcon onClick={()=>navigate("/notifications")} className='h-8 w-8 p-1'></BellIcon>
                </div>
                
              </div>
              <MenuItems
                transition
                className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 transition focus:outline-none data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-100 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in"
                
              >
                <MenuItem>
                  <Link to="/profile" className="flex items-center gap-1  text-decoration-none px-4 py-2 text-sm text-gray-700 data-[focus]:bg-gray-100">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                  </svg>

                    Profile
                  </Link>
                </MenuItem>
                <MenuItem>
                  <Link to="/notifications" className="flex items-center gap-1 text-decoration-none px-4 py-2 text-sm text-gray-700 data-[focus]:bg-gray-100">
                    
                    <BellIcon aria-hidden="true" className="h-6 w-6" />
                    View Notifications

                  </Link>
                </MenuItem>
                <MenuItem>
                  <div onClick={handleCreate} className="flex items-center gap-1 cursor-pointer text-decoration-none px-4 py-2 text-sm text-gray-700 data-[focus]:bg-gray-100" data-testid="createButton">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                    </svg>
                    Create Event
                  </div>
                </MenuItem>
                <MenuItem>
                  <div onClick={handleLogout} className="flex items-center gap-1 cursor-pointer text-decoration-none px-4 py-2 text-sm text-gray-700 data-[focus]:bg-gray-100" data-testid="logoutButton2">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 9V5.25A2.25 2.25 0 0 1 10.5 3h6a2.25 2.25 0 0 1 2.25 2.25v13.5A2.25 2.25 0 0 1 16.5 21h-6a2.25 2.25 0 0 1-2.25-2.25V15m-3 0-3-3m0 0 3-3m-3 3H15" />
                    </svg>
                    Logout
                  </div>
                </MenuItem>
              </MenuItems>
            </Menu>

          </div>
        </div>
      </div>
    </nav>
  );
}
