import { useState } from "react";
import Navbar from "../../components/Admin/Navbar";
import Navbar2 from "../../components/Navbar";
// import Dashboard from "../../components/User/Dashboard";
import MyProfile from "../../components/User/MyProfile";
import Events from "../../components/Admin/Events";
import MyTickets from "../../components/User/MyTickets";
import Logout from "../../components/User/Logout";
import CreateEvent from "../../components/User/CreateEvent";

function Profile() {
  const [activeIndex, setActiveIndex] = useState(0);

  // Array of components corresponding to the nav links
  const components = [
    // <Dashboard key={0} />,
    <MyProfile key={1} />,
    <Events key={2} />,
    //CreatedEvents
    //TrustedAccounts
    <CreateEvent key={3} />,
    <MyTickets key={4} />,
    <Logout setActiveIndex={setActiveIndex} key={5} />,
  ];

  return (
    <div className="flex flex-col h-screen">
      <Navbar2 />
      <div className="flex justify-center m-2 flex-1">
        {/* Side Navigation Bar */}
        <Navbar activeIndex={activeIndex} setActiveIndex={setActiveIndex} />
        {/* Main component based on selected navigation from nav bar */}
        <main className="w-10/12 border rounded-lg p-4">
          {components[activeIndex]} {/* Render the selected component */}
        </main>
      </div>
    </div>
  );
}

export default Profile;
