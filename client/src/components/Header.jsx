import { Avatar, Button, Dropdown, Navbar, TextInput } from "flowbite-react"; // Import UI components from Flowbite-React.
import React from "react";
import { Link, useLocation } from "react-router-dom"; // Import Link for navigation and useLocation to track current route.
import { AiOutlineSearch } from "react-icons/ai"; // Import search icon.
import { FaMoon } from "react-icons/fa"; // Import moon icon for theme toggle.
import { useSelector } from "react-redux"; // Import useSelector to access Redux state.

function Header() {
  const path = useLocation().pathname; // Track the current path to highlight active navbar links.
  const { currentUser } = useSelector((state) => state.user); // Access the current user from Redux state.

  return (
    <Navbar className="border-b-2">
      {/* Logo linking to the homepage */}
      <Link
        to="/"
        className="self-center whitespace-nowrap text-sm sm:text-xl font-semibold dark:text-white"
      >
        {/* Logo text with gradient background */}
        <span className="px-2 py-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-lg text-white">
          Mihai's
        </span>
        Blog
      </Link>

      {/* Search input for large screens */}
      <form>
        <TextInput
          type="text"
          placeholder="Search..."
          rightIcon={AiOutlineSearch} // Displays the search icon inside the input.
          className="hidden lg:inline" // Only visible on large screens (lg).
        />
      </form>

      {/* Mobile search button */}
      <Button className="w-12 h-10 lg:hidden" color="gray" pill>
        <AiOutlineSearch />
      </Button>

      <div className="flex gap-2 md:order-2">
        {/* Theme toggle button for larger screens */}
        <Button className="w-12 h-10 hidden sm:inline" color="gray" pill>
          <FaMoon />
        </Button>

        {/* Conditional rendering based on user authentication status */}
        {currentUser ? (
          <Dropdown
            arrowIcon={false}
            inline
            label={
              <Avatar alt="user" img={currentUser.profilePicture} rounded />
            }
          >
            <Dropdown.Header>
              <span className="block text-sm">@{currentUser.username}</span>
              <span className="block text-sm font-medium truncate">
                {currentUser.email}
              </span>
            </Dropdown.Header>
            <Link to="/dashboard?tab=profile">
              <Dropdown.Item>Profile</Dropdown.Item>
            </Link>
            <Dropdown.Divider />
            <Dropdown.Item>Sign Out</Dropdown.Item>
          </Dropdown>
        ) : (
          <Link to="/sign-in">
            <Button gradientDuoTone="purpleToBlue" outline>
              Sign In
            </Button>
          </Link>
        )}

        {/* Navbar toggle button for smaller screens */}
        <Navbar.Toggle />
      </div>

      {/* Collapsible navigation links */}
      <Navbar.Collapse>
        {/* Home link, active if the current path is '/' */}
        <Navbar.Link active={path === "/"} as="div">
          <Link to="/">Home</Link>
        </Navbar.Link>

        {/* About link, active if the current path is '/about' */}
        <Navbar.Link active={path === "/about"} as="div">
          <Link to="/about">About</Link>
        </Navbar.Link>

        {/* Projects link, active if the current path is '/projects' */}
        <Navbar.Link active={path === "/projects"} as="div">
          <Link to="/projects">Projects</Link>
        </Navbar.Link>
      </Navbar.Collapse>
    </Navbar>
  );
}

export default Header;
