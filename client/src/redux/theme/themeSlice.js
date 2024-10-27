import { createSlice } from "@reduxjs/toolkit"; // Import createSlice to simplify Redux slice creation.

const initialState = {
  theme: "light" // Set the initial theme to "light".
};

const themeSlice = createSlice({
  name: "theme", // Name of the slice
  initialState, // Initial state for theme
  reducers: {
    // Reducer to toggle theme between "light" and "dark"
    toggleTheme: (state) => {
      state.theme = state.theme === "light" ? "dark" : "light";
    }
  }
});

// Export the toggleTheme action for use in components.
export const { toggleTheme } = themeSlice.actions;

// Export the reducer to be added to the Redux store.
export default themeSlice.reducer;
