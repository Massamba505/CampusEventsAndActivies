import { useState } from "react";
import { ChevronDown, ChevronUp, User, Calendar, Ticket, Plus, LogOut } from "lucide-react";

export default function Sidebar({ isMobile }) {
  const [expanded, setExpanded] = useState(!isMobile);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const sidebarItems = [
    { icon: <Plus size={20} />, text: "Create Event" },
    { icon: <User size={20} />, text: "My Profile" },
    { icon: <Calendar size={20} />, text: "My Events" },
    { icon: <Ticket size={20} />, text: "My Tickets" },
    { icon: <LogOut size={20} />, text: "Logout" },
  ];

  const handleToggle = () => {
    setExpanded(!expanded);
  };

  const handleDropdownToggle = () => {
    setDropdownOpen(!dropdownOpen);
  };

  return (
    <div className="w-full sm:w-64">
      {isMobile ? (
        <div>
          <button
            className="p-4 w-full bg-indigo-500 text-white"
            onClick={handleDropdownToggle}
          >
            {dropdownOpen ? (
              <ChevronUp className="inline mr-2" />
            ) : (
              <ChevronDown className="inline mr-2" />
            )}
            Menu
          </button>
          {dropdownOpen && (
            <ul className="mt-2">
              {sidebarItems.map((item, index) => (
                <SidebarItem key={index} icon={item.icon} text={item.text} />
              ))}
            </ul>
          )}
        </div>
      ) : (
        <nav className="bg-white shadow-lg h-screen">
          <button className="p-2" onClick={handleToggle}>
            {expanded ? <ChevronDown /> : <ChevronUp />}
          </button>
          {expanded && (
            <ul className="mt-4">
              {sidebarItems.map((item, index) => (
                <SidebarItem key={index} icon={item.icon} text={item.text} />
              ))}
            </ul>
          )}
        </nav>
      )}
    </div>
  );
}

function SidebarItem({ icon, text }) {
  return (
    <li className="flex items-center p-4 hover:bg-indigo-50 cursor-pointer">
      {icon}
      <span className="ml-4">{text}</span>
    </li>
  );
}
