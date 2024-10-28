import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom"; // Import useLocation to access URL parameters
import DashSidebar from "../components/DashSidebar"; // Import sidebar component
import DashProfile from "../components/DashProfile"; // Import profile component
import DashPosts from "../components/DashPosts"; // Import posts component

function Dashboard() {
  const location = useLocation(); // Access the current URL location
  const [tab, setTab] = useState(""); // State to track the active tab

  useEffect(() => {
    // Extract 'tab' parameter from the URL query string
    const urlParams = new URLSearchParams(location.search);
    const tabFromUrl = urlParams.get("tab");

    if (tabFromUrl) {
      setTab(tabFromUrl); // Set the active tab based on the URL parameter
    }
  }, [location.search]); // Re-run when location.search changes

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Responsive container */}
      <div className="md:w-56">
        {/* Sidebar component, fixed width on medium screens and larger */}
        <DashSidebar />
      </div>
      {/* Render profile component only if the 'profile' tab is active */}
      {tab === "profile" && <DashProfile />}
      {/* Render posts component only if the 'posts' tab is active */}
      {tab === "posts" && <DashPosts />}
    </div>
  );
}

export default Dashboard;
