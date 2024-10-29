import { Button } from "flowbite-react"; // Import Button component from Flowbite
import React from "react"; // Import React

function CallToAction() {
  return (
    <div className="flex flex-col sm:flex-row p-3 border border-teal-500 justify-center items-center rounded-tl-3xl rounded-br-3xl text-center">
      {/* Main container for the call-to-action section */}

      <div className="flex-1 justify-center flex flex-col">
        {/* Flex container for text and button content */}

        <h2 className="text-2xl">Want to learn more about JavaScript?</h2>
        {/* Header prompting users to learn more about JavaScript */}

        <p className="text-gray-500 my-2">Check out these resources</p>
        {/* Sub-header providing a brief description */}

        <Button
          gradientDuoTone="purpleToPink"
          className="rounded-tl-xl rounded-bl-none"
        >
          {/* Button to trigger the resource link */}
          <a
            href="https://www.google.com" 
            target="_blank" // Open link in a new tab
            rel="noopener noreferrer" // Security measures for external links
          >
            Learn More
          </a>
        </Button>
      </div>

      <div className="p-7 flex-1">
        {/* Flex container for the image */}
        <img
          src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ1DmLCy9PSJfFqO55mNTYOQLx3x8THsbokkw&s" // Placeholder image for the call-to-action section
          alt="Image" // Alt text for accessibility
        />
      </div>
    </div>
  );
}

export default CallToAction; // Export the CallToAction component
