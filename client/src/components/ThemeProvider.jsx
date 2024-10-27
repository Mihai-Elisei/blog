import React from "react";
import { useSelector } from "react-redux"; // Import useSelector to access Redux state.

function ThemeProvider({ children }) {
  // Access the current theme from the Redux state.
  const { theme } = useSelector((state) => state.theme);

  return (
    // Apply the theme as a CSS class to the root div to toggle light/dark styling.
    <div className={theme}>
      {/* Wrapper div for light and dark mode styles */}
      <div className="bg-white text-gray-700 dark:text-gray-200 dark:bg-[rgb(16,23,42)] min-h-screen">
        {children} {/* Render children elements inside the themed container */}
      </div>
    </div>
  );
}

export default ThemeProvider;
