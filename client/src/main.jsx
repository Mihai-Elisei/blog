import { createRoot } from "react-dom/client"; // Import `createRoot` for rendering React in DOM.
import "./index.css"; // Import global CSS styles.
import App from "./App.jsx"; // Import the main App component.
import { store, persistor } from "./redux/store"; // Import the Redux store and persistor.
import { Provider } from "react-redux"; // Import Provider to give access to Redux store.
import { PersistGate } from "redux-persist/integration/react"; // Import PersistGate to delay rendering until Redux state is rehydrated.

createRoot(document.getElementById("root")).render(
  // Wrap the entire app with the Provider and PersistGate to ensure Redux store access and persistence.
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <App />
    </PersistGate>
  </Provider>
);
