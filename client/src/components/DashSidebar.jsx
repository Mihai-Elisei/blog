import React, { useEffect, useState } from "react";
import { Sidebar } from "flowbite-react"; // Import Sidebar component from Flowbite-React
import { HiAnnotation, HiArrowSmRight, HiDocumentText, HiOutlineUserGroup, HiUser } from "react-icons/hi"; // Import icons
import { Link, useLocation } from "react-router-dom"; // Import Link for navigation and useLocation to track current route
import { signoutSuccess } from "../redux/user/userSlice"; // Import signout action
import { useDispatch } from "react-redux"; // Import Redux hook
import { useSelector } from "react-redux"; // Import useSelector hook to access Redux state

function DashSidebar() {
  const dispatch = useDispatch(); // Initialize the dispatch function
  const location = useLocation(); // Access the current URL location
  const { currentUser } = useSelector((state) => state.user); // Get the current user from Redux state
  const [tab, setTab] = useState(""); // Track the active tab

  useEffect(() => {
    // Extract the 'tab' parameter from the URL to determine the active tab
    const urlParams = new URLSearchParams(location.search);
    const tabFromUrl = urlParams.get("tab");
    if (tabFromUrl) {
      setTab(tabFromUrl); // Update state based on the URL parameter
    }
  }, [location.search]); // Re-run when location.search changes

  const handleSignout = async () => {
    try {
      const res = await fetch("/api/user/signout", {
        method: "POST" // Set method to POST for signing out
      });
      const data = await res.json(); // Parse response data to JSON
      if (!res.ok) {
        console.log(data.message); // Log the success message
      } else {
        dispatch(signoutSuccess()); // Dispatch success upon successful signout
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <Sidebar className="w-full md:w-56">
      {/* Sidebar container with responsive width */}
      <Sidebar.Items>
        <Sidebar.ItemGroup className="flex flex-col gap-1">
          {/* Link to the Profile tab with URL parameter */}
          <Link to="/dashboard?tab=profile">
            <Sidebar.Item
              active={tab === "profile"} // Set active style if 'profile' is the current tab
              icon={HiUser} // Display user icon
              label={currentUser.isAdmin ? "Admin" : "User"} // Label text next to the icon
              labelColor="dark" // Dark label color
              as="div"
            >
              Profile
            </Sidebar.Item>
          </Link>

          {/* Link to the posts tab with URL parameter */}
          {currentUser.isAdmin && (
            <>
              <Link to="/dashboard?tab=posts">
                <Sidebar.Item
                  active={tab === "posts"}
                  icon={HiDocumentText}
                  as="div"
                >
                  Posts
                </Sidebar.Item>
              </Link>
              <Link to="/dashboard?tab=users">
                <Sidebar.Item
                  active={tab === "users"}
                  icon={HiOutlineUserGroup}
                  as="div"
                >
                  Users
                </Sidebar.Item>
              </Link>
              <Link to="/dashboard?tab=comments">
                <Sidebar.Item
                  active={tab === "comments"}
                  icon={HiAnnotation}
                  as="div"
                >
                  Comments
                </Sidebar.Item>
              </Link>
            </>
          )}

          {/* Sign Out option (currently only a label without functionality) */}
          <Sidebar.Item
            icon={HiArrowSmRight}
            className="cursor-pointer"
            onClick={handleSignout} // Call the signout function on click
          >
            Sign Out
          </Sidebar.Item>
        </Sidebar.ItemGroup>
      </Sidebar.Items>
    </Sidebar>
  );
}

export default DashSidebar;
