import { Menu, MenuButton, MenuItems, MenuItem } from '@headlessui/react';
import { BellIcon } from '@heroicons/react/24/outline';
import logo from "../assets/logo.jpeg";
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuthContext } from '../context/AuthContext';
import { myConstant } from '../const/const';

export default function Navbar() {
  const{setAuthUser} = useAuthContext();
  const navigate = useNavigate();

  const handleLogout = async() => {
    const response = await fetch(myConstant + "/api/auth/logout", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      }
    });
    if(response.ok){
      toast("Logged out successfully!"); // Show a message or toast
      localStorage.removeItem("events-app");
      setAuthUser(null);
      return;
    }
    const data = await response.json();
    toast(data.error); // Show a message or toast

  };
  const handleCreate = async() => {
    navigate("/create-event");
  };

  return (
    <nav className="bg-white px-4 pt-4 pb-1 sticky top-0 z-10">
      <div className="mx-auto px-2 py-2 sm:px-6 lg:px-8 border rounded w-11/12 shadow-md">
        <div className="relative flex items-center justify-between">
          <div className="flex">
            <Link to={"/"} className="flex items-center">
              <img className="w-24 h-16" src={logo} alt="Logo" />
            </Link>
          </div>
          <div className="flex items-center">
            <button
              type="button"
              className="relative rounded-full bg-white p-1 text-gray-400 hover:text-black border-black shadow-md focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 focus:ring-offset-gray-800"
            >
              <span className="absolute -inset-1.5" />
              <span className="sr-only">View notifications</span>
              <BellIcon aria-hidden="true" className="h-8 w-8" />
            </button>

            {/* Profile dropdown */}
            <Menu as="div" className="relative ml-3 mr-3">
              <div>
                <MenuButton className="relative shadow-md flex rounded-full bg-white text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-white">
                  <span className="absolute -inset-1.5" />
                  <span className="sr-only">Open user menu</span>
                  <img
                    alt=""
                    src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                    className="h-12 w-12 rounded-full"
                  />
                </MenuButton>
              </div>
              <MenuItems
                transition
                className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 transition focus:outline-none data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-100 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in"
              >
                <MenuItem>
                  <Link to="/profile" className="block text-decoration-none px-4 py-2 text-sm text-gray-700 data-[focus]:bg-gray-100">
                    Profile
                  </Link>
                </MenuItem>
                <MenuItem>
                  <div onClick={handleLogout} className="block cursor-pointer text-decoration-none px-4 py-2 text-sm text-gray-700 data-[focus]:bg-gray-100">
                    Logout
                  </div>
                </MenuItem>
                <MenuItem>
                  <div onClick={handleCreate} className="block cursor-pointer text-decoration-none px-4 py-2 text-sm text-gray-700 data-[focus]:bg-gray-100">
                    Create Event
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
