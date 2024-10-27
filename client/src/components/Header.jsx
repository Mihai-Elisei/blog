import { Avatar, Button, Dropdown, Navbar, TextInput } from "flowbite-react"; // Import Flowbite-React UI components
import React from "react";
import { Link, useLocation } from "react-router-dom"; // Import Link for navigation and useLocation to track current route
import { AiOutlineSearch } from "react-icons/ai"; // Import search icon
import { FaMoon, FaSun } from "react-icons/fa"; // Import icons for theme toggle
import { useSelector, useDispatch } from "react-redux"; // Import Redux hooks
import { toggleTheme } from "../redux/theme/themeSlice"; // Import theme toggle action

function Header() {
  const path = useLocation().pathname; // Get the current path to set active navbar links
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state) => state.user); // Access the current user from Redux state
  const { theme } = useSelector((state) => state.theme); // Access current theme from Redux state

  return (
    <Navbar className="border-b-2">
      {/* Logo links to homepage */}
      <Link
        to="/"
        className="self-center whitespace-nowrap text-sm sm:text-xl font-semibold dark:text-white"
      >
        {/* Logo with gradient background */}
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
          rightIcon={AiOutlineSearch} // Display search icon inside input
          className="hidden lg:inline" // Show only on large screens
        />
      </form>

      {/* Search button for mobile screens */}
      <Button className="w-12 h-10 lg:hidden" color="gray" pill>
        <AiOutlineSearch />
      </Button>

      <div className="flex gap-2 md:order-2">
        {/* Theme toggle button for larger screens */}
        <Button
          className="w-12 h-10 hidden sm:inline"
          color="gray"
          pill
          onClick={() => dispatch(toggleTheme())}
        >
          {theme === "light" ? <FaSun /> : <FaMoon />}{" "}
          {/* Sun icon for light mode, Moon icon for dark mode */}
        </Button>

        {/* Display user profile or sign-in button based on authentication status */}
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

        {/* Navbar toggle button for mobile screens */}
        <Navbar.Toggle />
      </div>

      {/* Collapsible navbar links */}
      <Navbar.Collapse>
        {/* Link to home, active if current path is '/' */}
        <Navbar.Link active={path === "/"} as="div">
          <Link to="/">Home</Link>
        </Navbar.Link>

        {/* Link to about page, active if current path is '/about' */}
        <Navbar.Link active={path === "/about"} as="div">
          <Link to="/about">About</Link>
        </Navbar.Link>

        {/* Link to projects page, active if current path is '/projects' */}
        <Navbar.Link active={path === "/projects"} as="div">
          <Link to="/projects">Projects</Link>
        </Navbar.Link>
      </Navbar.Collapse>
    </Navbar>
  );
}

export default Header;
