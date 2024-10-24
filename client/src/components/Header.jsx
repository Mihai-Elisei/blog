import { Button, Navbar, TextInput } from "flowbite-react"; // Importing UI components from Flowbite-React.
import React from "react";
import { Link, useLocation } from "react-router-dom"; // Importing Link for navigation and useLocation to track current route.
import { AiOutlineSearch } from "react-icons/ai"; // Importing search icon from React Icons.
import { FaMoon } from "react-icons/fa"; // Importing moon icon for theme toggle.

function Header() {
  // Get the current URL path using the useLocation hook to highlight the active navbar link.
  const path = useLocation().pathname;
  
  return (
    // Navbar container with a border at the bottom.
    <Navbar className="border-b-2">
      
      {/* Logo or blog name - clickable, linking to the homepage */}
      <Link
        to="/"
        className="self-center whitespace-nowrap text-sm sm:text-xl font-semibold dark:text-white"
      >
        {/* Stylized "Mihai's" text with a gradient background */}
        <span className="px-2 py-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-lg text-white">
          Mihai's
        </span>
        Blog
      </Link>

      {/* Search form for large screens */}
      <form>
        <TextInput
          type="text"
          placeholder="Search..."
          rightIcon={AiOutlineSearch} // Search icon displayed inside the text input.
          className="hidden lg:inline" // Hidden on small screens, only visible on large screens (lg).
        />
      </form>

      {/* Search button for small screens (mobile-friendly) */}
      <Button className="w-12 h-10 lg:hidden" color="gray" pill>
        <AiOutlineSearch /> {/* Search icon as a button for mobile users */}
      </Button>

      {/* Right-side buttons and toggle */}
      <div className="flex gap-2 md:order-2">
        {/* Theme toggle button (visible on larger screens) */}
        <Button className="w-12 h-10 hidden sm:inline" color="gray" pill>
          <FaMoon /> {/* Moon icon for theme switching */}
        </Button>

        {/* Sign-in button */}
        <Link to="/sign-in">
          <Button gradientDuoTone="purpleToBlue" outline>Sign In</Button> {/* Gradient-styled sign-in button */}
        </Link>

        {/* Navbar toggle button (visible on smaller screens) */}
        <Navbar.Toggle />
      </div>

      {/* Navbar links for navigation - collapses on smaller screens */}
      <Navbar.Collapse>
        {/* Home link - active if the current path is '/' */}
        <Navbar.Link active={path === "/"} as={'div'}>
          <Link to="/">Home</Link>
        </Navbar.Link>

        {/* About link - active if the current path is '/about' */}
        <Navbar.Link active={path === "/about"} as={'div'}>
          <Link to="/about">About</Link>
        </Navbar.Link>

        {/* Projects link - active if the current path is '/projects' */}
        <Navbar.Link active={path === "/projects"} as={'div'}>
          <Link to="/projects">Projects</Link>
        </Navbar.Link>
      </Navbar.Collapse>
    </Navbar>
  );
}

export default Header;
