import { useState, useEffect } from "react";
import Sidebar from "./Sidebar";

export default function ProfilePage() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 640);
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="flex">
      <Sidebar isMobile={isMobile} />
      <main className="flex-1 p-6 bg-gray-50">
        <h1 className="text-2xl font-semibold">User Profile Dashboard</h1>
        {/* You can place other profile components here */}
      </main>
    </div>
  );
}
