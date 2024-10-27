import React, { useState } from "react";
import { Alert, Button, Label, Spinner, TextInput } from "flowbite-react"; // Importing Flowbite UI components.
import { Link, useNavigate } from "react-router-dom"; // Importing Link and useNavigate from React Router for navigation.
import { useDispatch, useSelector } from "react-redux"; // Importing hooks for interacting with Redux.
import {
  signInStart,
  signInSuccess,
  signInFailure
} from "../redux/user/userSlice"; // Importing Redux actions for handling sign-in states.
import OAuth from "../components/OAuth";

function SignIn() {
  // Local state to manage form data.
  const [formData, setFormData] = useState({});

  // Destructure loading and error from the Redux state.
  const { loading, error: errorMessage } = useSelector((state) => state.user);

  // Initialize Redux dispatch and navigation hooks.
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Handle changes in input fields by updating formData state.
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value.trim() });
  };

  // Handle form submission.
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent page reload on form submission.

    // Validate form fields.
    if (!formData.email || !formData.password) {
      return dispatch(signInFailure("Please fill all the fields"));
    }

    try {
      dispatch(signInStart());
      // Send sign-in request to the backend.
      const res = await fetch("/api/auth/signin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData) // Send the form data as JSON.
      });

      const data = await res.json(); // Parse the JSON response.

      // Handle backend error response.
      if (data.success === false) {
        return dispatch(signInFailure(data.message));
      }

      // If sign-in is successful, update Redux state and navigate to homepage.
      if (res.ok) {
        dispatch(signInSuccess(data));
        navigate("/");
      }
    } catch (error) {
      dispatch(signInFailure(error.message)); // Dispatch error action if request fails.
    }
  };

  return (
    // Main container with a minimum height of full screen and margin at the top.
    <div className="min-h-screen mt-20">
      {/* Wrapper for sign-in section with responsive layout */}
      <div className="flex gap-5 p-3 max-w-7xl mx-auto flex-col md:flex-row md:items-center">
        {/* Left Section: Logo and introductory text */}
        <div className="flex-1">
          {/* Logo linking back to the homepage */}
          <Link to="/" className="font-bold dark:text-white text-4xl">
            {/* Stylized "Mihai's" text with gradient background */}
            <span className="px-2 py-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-lg text-white">
              Mihai's
            </span>
            Blog
          </Link>

          {/* Introductory text with additional sign-in options */}
          <p className="text-sm mt-5">
            You can sign in with your email and password or with Google!
          </p>
        </div>

        {/* Right Section: Sign-in form */}
        <div className="flex-1">
          {/* Form containing email and password fields */}
          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            {/* Email input field */}
            <div>
              <Label value="Your email" />
              <TextInput
                type="email"
                placeholder="name@company.com"
                id="email"
                onChange={handleChange} // Update formData state on change.
              />
            </div>

            {/* Password input field */}
            <div>
              <Label value="Your password" />
              <TextInput
                type="password"
                placeholder="Password"
                id="password"
                onChange={handleChange} // Update formData state on change.
              />
            </div>

            {/* Sign-In button with loading spinner when loading */}
            <Button
              gradientDuoTone="purpleToPink"
              type="submit"
              disabled={loading} // Disable button while loading.
            >
              {loading ? (
                <>
                  <Spinner size="sm" />{" "}
                  {/* Loading spinner during submission */}
                  <span className="pl-3">Loading...</span>
                </>
              ) : (
                "Sign In"
              )}
            </Button>
            <OAuth />
          </form>

          {/* Link to sign-up page if user does not have an account */}
          <div className="flex gap-2 text-sm mt-5">
            <span>Don't have an account?</span>
            <Link to="/sign-up" className="text-blue-500">
              Sign Up
            </Link>
          </div>

          {/* Display error message if one exists */}
          {errorMessage && (
            <Alert className="mt-5" color="failure">
              {errorMessage}
            </Alert>
          )}
        </div>
      </div>
    </div>
  );
}

export default SignIn;
