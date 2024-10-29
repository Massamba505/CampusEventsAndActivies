import { useState } from "react";
import Navbar from "../../components/Admin/Navbar";
import Navbar2 from "../../components/Navbar";
// import Dashboard from "../../components/User/Dashboard";
import MyProfile from "../../components/User/MyProfile";
import Events from "../../components/Admin/Events";
import MyTickets from "../../components/User/MyTickets";
import Logout from "../../components/User/Logout";
import CreateEvent from "../../components/User/CreateEvent";
import UserAccount from "../../components/Admin/TrustedAccounts.jsx";
import MyEvents from "../../components/User/MyEvents.jsx";
import CategoriesManagement from "../CategoryManagement.jsx";
import TicketAcceptance from "../../components/Admin/TicketAcceptance.jsx";

function Profile() {
  const [activeIndex, setActiveIndex] = useState(0);

  // Array of components corresponding to the nav links
  const components = [
    // <Dashboard key={0} />,
    <MyProfile key={1} />,
    <MyEvents key={2} />,
    <CreateEvent key={4} />,
    <MyTickets key={5} />,
    <UserAccount key={3} />,
    <Events key={7} />,
    <CategoriesManagement key={8} />,
    <TicketAcceptance key={9} />,
    <Logout setActiveIndex={setActiveIndex} key={6} />,
  ];

  return (
    <div className="flex flex-col h-screen">
      <Navbar2 />
      <div className="flex justify-center m-2 flex-1">
        {/* Side Navigation Bar */}
        <Navbar activeIndex={activeIndex} setActiveIndex={setActiveIndex} />
        {/* Main component based on selected navigation from nav bar */}
        <main className="w-10/12 border rounded-lg p-2 sm:p-4">
          {components[activeIndex]} {/* Render the selected component */}
        </main>
      </div>
    </div>
  );
}

export default Profile;
