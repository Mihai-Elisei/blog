import React, { useEffect, useState } from "react";
import { Sidebar } from "flowbite-react"; // Import Sidebar component from Flowbite-React
import { HiArrowSmRight, HiUser } from "react-icons/hi"; // Import icons
import { Link, useLocation } from "react-router-dom"; // Import Link for navigation and useLocation to track current route

function DashSidebar() {
  const location = useLocation(); // Access the current URL location
  const [tab, setTab] = useState(""); // Track the active tab

  useEffect(() => {
    // Extract the 'tab' parameter from the URL to determine the active tab
    const urlParams = new URLSearchParams(location.search);
    const tabFromUrl = urlParams.get("tab");
    if (tabFromUrl) {
      setTab(tabFromUrl); // Update state based on the URL parameter
    }
  }, [location.search]); // Re-run when location.search changes

  return (
    <Sidebar className="w-full md:w-56">
      {/* Sidebar container with responsive width */}
      <Sidebar.Items>
        <Sidebar.ItemGroup>
          {/* Link to the Profile tab with URL parameter */}
          <Link to="/dashboard?tab=profile">
            <Sidebar.Item
              active={tab === "profile"} // Set active style if 'profile' is the current tab
              icon={HiUser} // Display user icon
              label={"User"} // Label text next to the icon
              labelColor="dark" // Dark label color
            >
              Profile
            </Sidebar.Item>
          </Link>

          {/* Sign Out option (currently only a label without functionality) */}
          <Sidebar.Item icon={HiArrowSmRight} className="cursor-pointer">
            Sign Out
          </Sidebar.Item>
        </Sidebar.ItemGroup>
      </Sidebar.Items>
    </Sidebar>
  );
}

export default DashSidebar;
