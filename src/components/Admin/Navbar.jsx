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
  {
    link: "My Profile",
    icon: User,
  },
  {
    link: "Events",
    icon: CalendarDaysIcon,
  },
  {
    link: "Trusted Accounts",
    icon: CalendarPlusIcon,
  },
  {
    link: "Admins",
    icon: TicketsIcon,
  },
  {
    link: "Logout",
    icon: LogOutIcon,
  },
];

function Navbar({ activeIndex, setActiveIndex }) {
  const [isExpanded, setIsExpanded] = useState(window.innerWidth >= 768);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      setWindowWidth(width);
      if (width < 768) {
        setIsExpanded(false);
      } else {
        setIsExpanded(true);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleExpand = () => {
    // Only allow toggling if the screen width is larger than 768px
    if (windowWidth >= 768) {
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
        className="cursor-pointer rounded-full w-6 h-6 z-10 bg-blue-500 justify-center items-center absolute hidden sm:flex -top-2 -right-2 "
      >
        <img src={RightArrowIcon} className="w-2" />
      </div>

      {/* Navigation links */}
      <div className="flex flex-col space-y-4 mt-2">
        {navLinks.map((item, index) => (
          <div className="nav-links w-full" key={index}>
            <div
              onClick={() => setActiveIndex(index)}
              className={`flex justify-center items-center sm:justify-start  space-x-3 w-full py-2 px-1 rounded hover:cursor-pointer ${
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
