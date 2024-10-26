// Import required functions and modules for Redux store configuration and persistence.
import { configureStore, combineReducers } from "@reduxjs/toolkit";
import userReducer from "./user/userSlice"; // Import user slice reducer for handling user-related state.
import { persistReducer, persistStore } from "redux-persist"; // Import functions for managing persistence.
import storage from "redux-persist/lib/storage"; // Default storage for persistence, which uses localStorage.

// Combine multiple reducers into a rootReducer.
const rootReducer = combineReducers({
  user: userReducer // Register `user` slice in rootReducer.
});

// Configuration for redux-persist to define storage method and root key.
const persistConfig = {
  key: "root", // Key at the root level in localStorage to store Redux state.
  storage, // Specify `localStorage` as storage method.
  version: 1 // Version of the persisted storage format.
};

// Wrap rootReducer with persistReducer to enable state persistence.
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Create and configure the Redux store.
export const store = configureStore({
  reducer: persistedReducer, // Use the persisted reducer in the store.
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }) // Disable serializable checks for non-serializable data.
});

// Create the persistor for handling persistence and rehydrating the store.
export const persistor = persistStore(store);
