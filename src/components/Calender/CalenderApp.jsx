import "react-big-calendar/lib/css/react-big-calendar.css";
import Customize from "./Customize.jsx";
import Navbar from "../Navbar.jsx";

function CalenderApp() {
  return (
    <>
      <Navbar/>
      <div className="sm:p-4 p-1" style={{ height: "75vh" }}>
        <Customize />
      </div>
    </>
  );
}

export default CalenderApp