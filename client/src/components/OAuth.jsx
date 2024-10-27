import { Button } from "flowbite-react"; // Import Button component from Flowbite React for styling.
import React from "react"; // Import React to use JSX syntax.
import { AiFillGoogleCircle } from "react-icons/ai"; // Import Google icon from react-icons.
import { GoogleAuthProvider, signInWithPopup, getAuth } from "firebase/auth"; // Import Firebase authentication functions.
import { app } from "../firebase"; // Import your Firebase application configuration.
import { useDispatch } from "react-redux"; // Import useDispatch hook from React Redux for state management.
import { signInSuccess } from "../redux/user/userSlice"; // Import signInSuccess action from the user slice.
import { useNavigate } from "react-router-dom"; // Import useNavigate hook from React Router for navigation.

function OAuth() {
  const auth = getAuth(app); // Initialize Firebase authentication with the app instance.
  const dispatch = useDispatch(); // Get the dispatch function from Redux.
  const navigate = useNavigate(); // Get the navigate function for redirecting users after sign-in.

  // Function to handle Google sign-in when the button is clicked.
  const handleGoogleClick = async () => {
    const provider = new GoogleAuthProvider(); // Create an instance of GoogleAuthProvider for Google sign-in.
    provider.setCustomParameters({ prompt: "select_account" }); // Optional: Prompt user to select an account.

    try {
      // Trigger Google sign-in popup and wait for the response.
      const resultsFromGoogle = await signInWithPopup(auth, provider);

      // Send a POST request to your backend with user information after successful sign-in.
      const res = await fetch("/api/auth/google", {
        method: "POST", // Set the HTTP method to POST.
        headers: { "Content-Type": "application/json" }, // Specify that we are sending JSON.
        body: JSON.stringify({
          name: resultsFromGoogle.user.displayName, // Get the user's display name.
          email: resultsFromGoogle.user.email, // Get the user's email.
          googlePhotoUrl: resultsFromGoogle.user.photoURL // Get the user's Google profile photo URL.
        })
      });

      const data = await res.json(); // Parse the JSON response from the backend.

      // Check if the response was successful.
      if (res.ok) {
        dispatch(signInSuccess(data)); // Dispatch the signInSuccess action with the user data.
        navigate("/"); // Redirect the user to the home page after successful sign-in.
      }
    } catch (error) {
      console.log(error); // Log any errors that occur during the sign-in process.
    }
  };

  return (
    <Button
      type="button" // Set button type as button.
      gradientDuoTone="pinkToOrange" // Apply a gradient style to the button.
      outline // Render the button as an outlined button.
      onClick={handleGoogleClick} // Set the click handler for the button.
    >
      <AiFillGoogleCircle className="w-6 h-6 mr-2" />{" "}
      {/* Render the Google icon with styling. */}
      Continue with Google {/* Button text */}
    </Button>
  );
}

export default OAuth; // Export the component for use in other parts of the app.
