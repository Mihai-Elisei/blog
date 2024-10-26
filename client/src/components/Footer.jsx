import React from "react";
import { Footer } from "flowbite-react"; // Importing the Footer component from Flowbite
import { Link } from "react-router-dom"; // Importing Link for navigation
import {
  BsFacebook,
  BsInstagram,
  BsTwitter,
  BsGithub,
  BsDribbble
} from "react-icons/bs"; // Importing icons from react-icons for social media links

function FooterCom() {
  return (
    <Footer container className="border-t-8 border-teal-500">
      {" "}
      {/* Footer container with borders */}
      <div className="w-full max-w-7xl mx-auto">
        {" "}
        {/* Container for max width */}
        <div className="grid w-full justify-between sm:flex md:grid-cols-1">
          {" "}
          {/* Grid layout for structure */}
          <div className="mt-5">
            {/* Logo or blog name - clickable, linking to the homepage */}
            <Link
              to="/" // Linking to the homepage
              className="self-center whitespace-nowrap text-sm sm:text-lg font-semibold dark:text-white"
            >
              {/* Stylized "Mihai's" text with a gradient background */}
              <span className="px-2 py-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-lg text-white">
                Mihai's
              </span>
              Blog
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-8 sm:mt-4 sm:grid-cols-3 sm:gap-6">
            {" "}
            {/* Grid for footer links */}
            <div>
              <Footer.Title title="About" /> {/* About section title */}
              <Footer.LinkGroup col>
                <Footer.Link href="/projects">Projects</Footer.Link>{" "}
                {/* Link to Projects */}
                <Footer.Link href="/about">Mihai's Blog</Footer.Link>{" "}
                {/* Link to About */}
              </Footer.LinkGroup>
            </div>
            <div>
              <Footer.Title title="Follow us" /> {/* Follow us section title */}
              <Footer.LinkGroup col>
                <Footer.Link
                  href="https://www.github.com" // Link to Github
                  target="_blank" // Opens link in a new tab
                  rel="noopener noreferrer" // Security attributes for new tab
                >
                  Github
                </Footer.Link>
                <Footer.Link
                  href="https://www.discord.com" // Link to Discord
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Discord
                </Footer.Link>
                <Footer.Link
                  href="https://www.linkedin.com" // Link to LinkedIn
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Linkedin
                </Footer.Link>
              </Footer.LinkGroup>
            </div>
            <div>
              <Footer.Title title="Legal" /> {/* Legal section title */}
              <Footer.LinkGroup col>
                <Footer.Link href="#">Privacy Policy</Footer.Link>{" "}
                {/* Link to Privacy Policy */}
                <Footer.Link href="#">Terms &amp; Conditions</Footer.Link>{" "}
                {/* Link to Terms */}
              </Footer.LinkGroup>
            </div>
          </div>
        </div>
        <Footer.Divider /> {/* Divider for visual separation */}
        <div className="w-full sm:flex sm:items-center sm:justify-between">
          {" "}
          {/* Flex container for copyright and social icons */}
          <Footer.Copyright
            href="#" // Link for copyright (could be detailed)
            by="Mihai's blog" // Copyright owner text
            year={new Date().getFullYear()} // Dynamically gets the current year
          />
          <div className="flex gap-6 sm:mt-0 mt-4 sm:justify-center">
            {" "}
            {/* Social media icon container */}
            <Footer.Icon href="#" icon={BsFacebook} /> {/* Facebook icon */}
            <Footer.Icon href="#" icon={BsInstagram} /> {/* Instagram icon */}
            <Footer.Icon href="#" icon={BsTwitter} /> {/* Twitter icon */}
            <Footer.Icon href="#" icon={BsGithub} /> {/* Github icon */}
            <Footer.Icon href="#" icon={BsDribbble} /> {/* Dribbble icon */}
          </div>
        </div>
      </div>
    </Footer>
  );
}

export default FooterCom; // Exporting FooterCom for use in other components
