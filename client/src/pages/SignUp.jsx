import React, { useState } from "react";
import { Alert, Button, Label, Spinner, TextInput } from "flowbite-react"; // Importing UI components from Flowbite-React.
import { Link, useNavigate } from "react-router-dom"; // Importing Link for navigation and useNavigate for programmatic redirection.

function SignUp() {
  // State to hold form data, error message, and loading status.
  const [formData, setFormData] = useState({});
  const [errorMessage, setErrorMessage] = useState(null);
  const [loading, setLoading] = useState(false);

  // useNavigate hook for redirecting after successful sign-up.
  const navigate = useNavigate();

  // Handle input change to update formData state.
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value.trim() });
  };

  // Handle form submission.
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission behavior.

    // Check if all fields are filled out.
    if (!formData.username || !formData.email || !formData.password) {
      setErrorMessage("Please fill out all fields.");
      setLoading(false); // Stop loading if there is a validation error
      return;
    }

    try {
      setLoading(true); // Set loading state to true while the request is in progress.
      setErrorMessage(null); // Reset any previous error messages.

      // Send POST request to the backend sign-up route.
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData) // Send form data in JSON format.
      });

      const data = await res.json(); // Parse JSON response.

      // Handle any backend error message.
      if (data.success === false) {
        setErrorMessage(data.message);
        setLoading(false); // Stop loading if there is a backend error
        return;
      }

      setLoading(false); // Stop loading indicator.

      // Redirect to sign-in page if the response is successful.
      if (res.ok) {
        navigate("/sign-in");
      }
    } catch (error) {
      // Catch and display any error that occurs during the fetch request.
      setErrorMessage("An error occurred. Please try again later.");
      setLoading(false); // Stop loading if there is a network or unexpected error
    }
  };

  return (
    // Main container with full-screen height and top margin.
    <div className="min-h-screen mt-20">
      {/* Wrapper for sign-up section, responsive layout for mobile and desktop */}
      <div className="flex gap-5 p-3 max-w-7xl mx-auto flex-col md:flex-row md:items-center">
        {/* Left Section: Contains logo and introductory text */}
        <div className="flex-1">
          {/* Logo or blog name - clickable, linking to the homepage */}
          <Link to="/" className="font-bold dark:text-white text-4xl">
            {/* Stylized "Mihai's" text with a gradient background */}
            <span className="px-2 py-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-lg text-white">
              Mihai's
            </span>
            Blog
          </Link>

          {/* Introductory text with options for signing up */}
          <p className="text-sm mt-5">
            You can sign up with your email and password or with Google!
          </p>
        </div>

        {/* Right Section: Sign-up form */}
        <div className="flex-1">
          {/* Form for username, email, and password fields */}
          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            {/* Username field with label */}
            <div>
              <Label value="Your username" />
              <TextInput
                type="text"
                placeholder="Username"
                id="username"
                onChange={handleChange} // Update form data state on change.
              />
            </div>

            {/* Email field with label */}
            <div>
              <Label value="Your email" />
              <TextInput
                type="email"
                placeholder="name@company.com"
                id="email"
                onChange={handleChange} // Update form data state on change.
              />
            </div>

            {/* Password field with label */}
            <div>
              <Label value="Your password" />
              <TextInput
                type="password"
                placeholder="Password"
                id="password"
                onChange={handleChange} // Update form data state on change.
              />
            </div>

            {/* Sign-Up button with gradient styling, disabled while loading */}
            <Button
              gradientDuoTone="purpleToPink"
              type="submit"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Spinner size="sm" />{" "}
                  {/* Loading spinner during submission */}
                  <span className="pl-3">Loading...</span>
                </>
              ) : (
                "Sign Up"
              )}
            </Button>
          </form>

          {/* Link to sign-in page if the user already has an account */}
          <div className="flex gap-2 text-sm mt-5">
            <span>Have an account?</span>
            <Link to="/sign-in" className="text-blue-500">
              Sign In
            </Link>
          </div>

          {/* Display error message if present */}
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

export default SignUp;
