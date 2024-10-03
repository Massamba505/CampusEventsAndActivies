import { useState, useEffect } from "react";
import {
  CalendarDaysIcon,
  CalendarPlusIcon,
  LayoutDashboard,
  LogOutIcon,
  TicketsIcon,
  User,
} from "lucide-react";
import { motion } from "framer-motion";

import RightArrowIcon from "../../assets/icons/rightArrow.svg";

const variants = {
  expanded: { width: "220px" },
  nonexpanded: { width: "60px" },
};

const navLinks = [
  // {
  //   link: "Dashboard",
  //   icon: LayoutDashboard,
  // },
  {
    link: "My Profile",
    icon: User,
  },
  {
    link: "My Events",
    icon: CalendarDaysIcon,
  },
  {
    link: "Create Event",
    icon: CalendarPlusIcon,
  },
  {
    link: "My Tickets",
    icon: TicketsIcon,
  },
  {
    link: "Logout",
    icon: LogOutIcon,
  },
];

function Navbar({ activeIndex, setActiveIndex }) {
  const [isExpanded, setIsExpanded] = useState(true);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
      if (window.innerWidth < 768) {
        setIsExpanded(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleExpand = () => {
    if (windowWidth >= 640) {
      setIsExpanded((prev) => !prev);
    }
  };

  return (
    <motion.div
      animate={isExpanded ? "expanded" : "nonexpanded"}
      variants={variants}
      className={`py-2 flex flex-col border rounded-lg border-r-1 bg-[#FDFDFD] relative ${
        isExpanded ? "px-10" : "px-2 duration-500"
      }`}
    >
      {/* Toggle button placed inside the container at the top-right */}
      <div
        onClick={toggleExpand}
        className="cursor-pointer rounded-full w-6 h-6 bg-blue-500 flex justify-center items-center absolute -top-2 -right-3"
      >
        <img src={RightArrowIcon} className="w-2" />
      </div>
  
      {/* Navigation links */}
      <div className="sticky top-0 z-10 flex flex-col space-y-4 mt-2">
        {navLinks.map((item, index) => (
          <div className="nav-links w-full" key={index}>
            <div
              onClick={() => setActiveIndex(index)}
              className={`flex justify-start space-x-3 w-full py-2 px-1 rounded hover:cursor-pointer ${
                activeIndex === index
                  ? "bg-blue-500 text-white"
                  : "text-black hover:bg-gray-200"
              } ${!isExpanded ? "pl-3" : ""}`}
            >
              <item.icon className="sm:w-6 w-4" />
              <span className={!isExpanded ? "hidden" : "block"}>
                {item.link}
              </span>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
  
}

export default Navbar;
