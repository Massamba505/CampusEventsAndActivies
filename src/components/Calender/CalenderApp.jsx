import "react-big-calendar/lib/css/react-big-calendar.css";
import Customize from "./Customize.jsx";
import Navbar from "../Navbar.jsx";

function CalenderApp() {
  return (
    <>
      <Navbar/>
      <div className="p-4" style={{ height: "75vh" }}>
        <Customize />
      </div>
    </>
  );
}

export default CalenderApp