import { Menu, MenuButton, MenuItems, MenuItem } from '@headlessui/react';
import { BellIcon } from '@heroicons/react/24/outline';
import logo from "../assets/logo.jpeg";
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuthContext } from '../context/AuthContext';
import { useEffect, useState } from 'react';
import { CalendarDays, CircleCheckBigIcon } from 'lucide-react';
import { myConstant } from '../const/const';

export default function Navbar() {
    const { authUser, setAuthUser } = useAuthContext();
    const navigate = useNavigate();
    const [pp, setPp] = useState(authUser?.photoUrl || "");
    const [notifications, setNotifications] = useState([]);

    useEffect(() => {
        if (authUser?.photoUrl) return;

        const fetchUserData = async () => {
            try {
                const response = await fetch(`${myConstant}/api/user`, {
                    method: "GET",
                    headers: {
                        "Authorization": `Bearer ${authUser.token}`,
                        "Content-Type": "application/json",
                    },
                });

                if (response.ok) {
                    const { photoUrl } = await response.json();
                    setPp(photoUrl);
                } else {
                    console.error("Failed to fetch profile picture");
                }
            } catch (error) {
                console.error("Error fetching user data:", error);
            }
        };

        fetchUserData();
    }, [authUser]);

    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                const response = await fetch(`${myConstant}/api/user/notifications/latest`, {
                    method: "GET",
                    headers: {
                        "Authorization": `Bearer ${authUser.token}`,
                        "Content-Type": "application/json",
                    },
                });

                if (response.ok) {
                    const { notifications } = await response.json();
                    setNotifications(notifications);
                } else {
                    console.error("Failed to fetch notifications");
                }
            } catch (error) {
                console.error("Error fetching notifications:", error);
            }
        };

        fetchNotifications();
    }, [authUser]);

    const handleLogout = async () => {
        try {
            const response = await fetch(`${myConstant}/api/auth/logout`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
            });

            if (response.ok) {
                toast.success("Logged out successfully!");
                localStorage.removeItem("events-app");
                setAuthUser(null);
                navigate("/login");
            } else {
                const data = await response.json();
                toast.error(data.error);
            }
        } catch (error) {
            console.error("Error logging out:", error);
        }
    };

    return (
        <nav className="bg-white sticky top-0 pt-2 mb-3 px-2 z-10">
            <div className="mx-auto px-2 border border-white rounded w-full shadow-md">
                <div className="relative flex items-center justify-between">
                    <div className="flex">
                        <Link to="/home" className="flex items-center">
                            <img className="w-24 h-16" src={logo} alt="Logo" />
                        </Link>
                    </div>
                    <div className="flex gap-2 items-center">
                        <Menu as="div" className="relative">
                            <div className="flex flex-row-reverse items-center gap-2">
                                <MenuButton className="relative shadow-md flex rounded-full bg-white text-sm">
                                    <img
                                        alt="Profile"
                                        src={pp}
                                        className="h-10 w-10 md:h-12 md:w-12 rounded-full object-cover"
                                    />
                                </MenuButton>
                                <CalendarDays onClick={() => navigate("/calender")} className="h-8 w-8 p-1 rounded-full hover:bg-blue-500 hover:text-white cursor-pointer" />
                                <div onClick={() => navigate("/notifications")} className="relative rounded-full hover:bg-blue-500 hover:text-white cursor-pointer">
                                    {notifications.length > 0 && (
                                        <CircleCheckBigIcon className="absolute right-2 top-1 text-green-500 h-2 w-2" />
                                    )}
                                    <BellIcon className="h-8 w-8 p-1" />
                                </div>
                            </div>
                            <MenuItems className="absolute right-0 mt-2 w-48 origin-top-right bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5">
                                <MenuItem>
                                    <Link to="/profile" className="flex items-center gap-1 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                                        Profile
                                    </Link>
                                </MenuItem>
                                <MenuItem>
                                    <button onClick={handleLogout} className="flex w-full items-center gap-1 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                                        Logout
                                    </button>
                                </MenuItem>
                            </MenuItems>
                        </Menu>
                    </div>
                </div>
            </div>
        </nav>
    );
}
