import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'
import {BellIcon} from '@heroicons/react/24/outline'
import logo from "../assets/logo.jpeg";
import { Link } from 'react-router-dom';

export default function Navbar() {
  return (
    <nav className="bg-white p-4 pb-4">
      <div className="mx-auto px-2 sm:px-6 lg:px-8">
        <div className="relative flex items-center justify-between">
          <div className="flex">
            <Link to={"/"} className="flex items-center">
              <img className="w-24 h-16" src={logo}/>
            </Link>
          </div>

          <div className="flex max-w-5xl flex-1 items-center justify-center">
            <input
              type="text"
              placeholder="Search..."
              className="w-4/5 h-12 px-4 rounded-md text-lg bg-white text-black placeholder-black border border-gray-700 shadow-md focus:outline-black focus:ring-2 focus:ring-black focus:border"
            />
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
                  <Link href="#" className="block px-4 py-2 text-sm text-gray-700 data-[focus]:bg-gray-100">
                    Your Profile
                  </Link>
                </MenuItem>
                <MenuItem>
                  <Link href="#" className="block px-4 py-2 text-sm text-gray-700 data-[focus]:bg-gray-100">
                    Settings
                  </Link>
                </MenuItem>
                <MenuItem>
                  <Link href="#" className="block px-4 py-2 text-sm text-gray-700 data-[focus]:bg-gray-100">
                    Sign out
                  </Link>
                </MenuItem>
              </MenuItems>
            </Menu>
          </div>
        </div>
      </div>
    </nav>
  )
}
