import { useState } from "react";
import Navbar from "../../components/User/Navbar";
import Navbar2 from "../../components/Navbar";
// import Dashboard from "../../components/User/Dashboard";
import MyProfile from "../../components/User/MyProfile";
import MyEvents from "../../components/User/MyEvents";
import MyTickets from "../../components/User/MyTickets";
import Logout from "../../components/User/Logout";
import CreateEvent from "../../components/User/CreateEvent";

function Profile() {
  const [activeIndex, setActiveIndex] = useState(0);

  // Array of components corresponding to the nav links
  const components = [
    // <Dashboard key={0} />,
    <MyProfile key={1} />,
    <MyEvents key={2} />,
    <CreateEvent key={3} />,
    <MyTickets key={4} />,
    <Logout setActiveIndex={setActiveIndex} key={5} />,
  ];

  return (
    <div className="flex flex-col h-screen">
      <Navbar2/>
      <div className="flex justify-center m-2 flex-1">
        {/* Side Navigation Bar */}
        <Navbar activeIndex={activeIndex} setActiveIndex={setActiveIndex} />
        {/* Main component based on selected navigation from nav bar */}
        <main className="w-10/12 border rounded-lg">
          {components[activeIndex]} {/* Render the selected component */}
        </main>
      </div>
    </div>
  );
}

export default Profile;
