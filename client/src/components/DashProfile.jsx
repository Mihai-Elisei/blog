import { Alert, Button, Modal, TextInput } from "flowbite-react"; // Importing necessary components from the Flowbite library
import React, { useEffect, useRef, useState } from "react"; // Importing React and necessary React hooks
import { useSelector } from "react-redux"; // Importing useSelector to access Redux state
import {
  getDownloadURL,
  getStorage,
  uploadBytesResumable,
  ref
} from "firebase/storage"; // Importing Firebase storage functions for uploading files
import { app } from "../firebase"; // Importing the initialized Firebase app instance
import { CircularProgressbar } from "react-circular-progressbar"; // Importing circular progress bar component
import "react-circular-progressbar/dist/styles.css"; // Importing styles for the circular progress bar
import {
  updateStart,
  updateSuccess,
  updateFailure,
  deleteUserStart,
  deleteUserSuccess,
  deleteUserFailure
} from "../redux/user/userSlice"; // Importing Redux actions for user updates and deletion
import { useDispatch } from "react-redux"; // Importing useDispatch to dispatch actions to the Redux store
import { HiOutlineExclamationCircle } from "react-icons/hi"; // Importing an icon component for the modal
import { set } from "mongoose"; // This should be removed as it is unused in the code

function DashProfile() {
  // Accessing the current user and error state from the Redux store
  const { currentUser, error } = useSelector((state) => state.user);

  // State variables to manage profile updates and image uploads
  const [imageFile, setImageFile] = useState(null); // State to hold the selected image file
  const [imageFileUrl, setImageFileUrl] = useState(null); // State to hold the URL of the uploaded image
  const [imageFileUploadingProgress, setImageFileUploadingProgress] =
    useState(null); // State for tracking upload progress
  const [imageFileUploadError, setImageFileUploadError] = useState(null); // State to store upload errors
  const [imageFileUploading, setImageFileUploading] = useState(false); // State for current upload status
  const [updateUserSuccess, setUpdateUserSuccess] = useState(null); // State for successful updates
  const [updateUserError, setUpdateUserError] = useState(null); // State for update errors
  const [showModal, setShowModal] = useState(false); // State to control modal visibility for account deletion
  const [formData, setFormData] = useState({}); // State to hold the form data for user updates
  const filePickerRef = useRef(); // Ref for the file input element for profile picture selection
  const dispatch = useDispatch(); // Function to dispatch actions to the Redux store

  // Function to handle image file selection
  const handleImageChange = (e) => {
    const file = e.target.files[0]; // Get the selected file
    if (file) {
      setImageFile(file); // Set the state with the selected image file
      setImageFileUrl(URL.createObjectURL(file)); // Create a temporary URL for the selected image
    }
  };

  // Effect to upload the image when a new image file is selected
  useEffect(() => {
    if (imageFile) {
      uploadImage(); // Call the upload function
    }
  }, [imageFile]); // Only run effect when imageFile changes

  // Function to upload image to Firebase Storage
  const uploadImage = async () => {
    setImageFileUploading(true); // Set uploading state to true
    setImageFileUploadError(null); // Reset any previous upload errors
    const storage = getStorage(app); // Get reference to Firebase storage
    const fileName = new Date().getTime() + imageFile.name; // Create a unique file name based on the current timestamp
    const storageRef = ref(storage, fileName); // Create a reference for the file in storage
    const uploadTask = uploadBytesResumable(storageRef, imageFile); // Start the upload task

    // Monitor upload progress and handle errors
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        // Monitor upload progress
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100; // Calculate upload percentage
        setImageFileUploadingProgress(progress.toFixed(0)); // Update progress state
      },
      (error) => {
        // Handle any upload errors
        setImageFileUploadError(
          "Could not upload image (File must be less than 2MB)" // Set appropriate error message
        );
        setImageFileUploadingProgress(null); // Reset progress
        setImageFile(null); // Clear image file state
        setImageFileUrl(null); // Clear the temporary image URL
        setImageFileUploading(false); // Set uploading state to false
      },
      () => {
        // Handle successful upload
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setImageFileUrl(downloadURL); // Set the image URL in state
          setFormData({ ...formData, profilePicture: downloadURL }); // Update form data with the new image URL
          setImageFileUploading(false); // End uploading state
        });
      }
    );
  };

  // Function to handle input changes in the form
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value }); // Update form data state based on input changes
  };

  // Function to handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission behavior
    setUpdateUserError(null); // Reset update error state
    setUpdateUserSuccess(null); // Reset update success state
    if (Object.keys(formData).length === 0) {
      setUpdateUserError("No changes made"); // Alert if no data changes have been made
      return; // Exit function early
    }
    if (imageFileUploading) {
      setUpdateUserError("Please wait for image to upload"); // Alert if an upload is still in progress
      return; // Exit function early
    }
    try {
      dispatch(updateStart()); // Dispatch action to indicate the update process has started
      const res = await fetch(`/api/user/update/${currentUser._id}`, {
        method: "PUT", // Set method to PUT for updating user data
        headers: {
          "Content-Type": "application/json" // Set headers for the API call
        },
        body: JSON.stringify(formData) // Send form data to server
      });
      const data = await res.json(); // Parse response data to JSON
      if (!res.ok) {
        dispatch(updateFailure(data.message)); // Dispatch failure if response not okay
        setUpdateUserError(data.message); // Show error message
      } else {
        dispatch(updateSuccess(data)); // Dispatch success with user data
        setUpdateUserSuccess("User profile updated successfully"); // Show success message
      }
    } catch (error) {
      dispatch(updateFailure(error.message)); // Dispatch failure and set error in case of exception
    }
  };

  // Function to handle user deletion
  const handleDeleteUser = async () => {
    setShowModal(false); // Close the modal
    try {
      dispatch(deleteUserStart()); // Dispatch action to indicate deletion process has started
      const res = await fetch(`/api/user/delete/${currentUser._id}`, {
        method: "DELETE" // Set method to DELETE for user deletion
      });
      const data = await res.json(); // Parse response data to JSON
      if (!res.ok) {
        dispatch(deleteUserFailure(data.message)); // Dispatch failure if response not okay
      } else {
        dispatch(deleteUserSuccess(data)); // Dispatch success upon successful deletion
      }
    } catch (error) {
      dispatch(deleteUserFailure(error.message)); // Dispatch failure in case of exception
    }
  };

  return (
    <div className="max-w-lg mx-auto p-3 w-full">
      {/* Main container for the profile */}
      <h1 className="my-7 text-center font-semibold text-3xl">Profile</h1>
      {/* Header for profile section */}
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        {/* Form for updating profile information */}
        <input
          type="file"
          accept="image/*" // Accepts image file types
          onChange={handleImageChange} // Event handler for file selection
          ref={filePickerRef} // Reference to the input
          hidden // Hides the input to allow custom button behavior
        />
        {/* Profile picture display and upload handler */}
        <div
          className="relative w-32 h-32 self-center cursor-pointer shadow-md overflow-hidden rounded-full"
          onClick={() => filePickerRef.current.click()} // Trigger file picker on click
        >
          {imageFileUploadingProgress && ( // Show the progress bar if uploading
            <CircularProgressbar
              value={imageFileUploadingProgress || 0} // Set progress value
              text={`${imageFileUploadingProgress}%`} // Text to display percentage
              strokeWidth={5} // Stroke width of the circular progress
              styles={{
                root: {
                  width: "100%",
                  height: "100%",
                  position: "absolute",
                  top: 0,
                  left: 0
                },
                path: {
                  stroke: `rgba(62,152,199), ${
                    imageFileUploadingProgress / 100
                  }` // Dynamic progress bar color
                }
              }}
            />
          )}
          <img
            src={imageFileUrl || currentUser.profilePicture} // Profile picture sourced from state or fallback to current user
            alt="Profile Image" // Alt text for the image
            className={`rounded-full w-full h-full object-cover border-8 border-[lightgray] ${
              imageFileUploadingProgress && // Adjust opacity based on upload status
              imageFileUploadingProgress < 100 &&
              "opacity-20"
            }`}
          />
        </div>
        {/* Show an error message if any upload error occurs */}
        {imageFileUploadError && (
          <Alert color="failure">{imageFileUploadError}</Alert> // Display error alert
        )}
        {/* Input field for username */}
        <TextInput
          type="text"
          id="username"
          placeholder="username" // Placeholder text
          defaultValue={currentUser.username} // Default value set to current user's username
          onChange={handleChange} // Event handler to update form data on change
        />
        {/* Input field for email */}
        <TextInput
          type="email"
          id="email"
          placeholder="email" // Placeholder text
          defaultValue={currentUser.email} // Default value set to current user's email
          onChange={handleChange} // Event handler to update form data on change
        />
        {/* Input field for password (no default value for security reasons) */}
        <TextInput
          type="password"
          id="password"
          placeholder="password" // Placeholder text for password input
          onChange={handleChange} // Event handler to update form data on change
        />
        {/* Button to submit the form */}
        <Button type="submit" gradientDuoTone="purpleToBlue" outline>
          Update {/*  Label for the button */}
        </Button>
      </form>
      {/* Links for account actions */}
      <div className="text-red-500 flex justify-between mt-5">
        <span onClick={() => setShowModal(true)} className="cursor-pointer">
          Delete Account {/* Link to trigger deletion modal */}
        </span>
        <span className="cursor-pointer">Sign Out</span>{" "}
        {/* Link to sign out */}
      </div>
      {/* Display success or error messages upon update */}
      {updateUserSuccess && (
        <Alert color="success" className="mt-5">
          {updateUserSuccess} {/* Success alert message */}
        </Alert>
      )}
      {updateUserError && (
        <Alert color="failure" className="mt-5">
          {updateUserError} {/* Error alert message */}
        </Alert>
      )}
      {error && (
        <Alert color="failure" className="mt-5">
          {error} {/* Error alert message for Redux error state */}
        </Alert>
      )}
      {/* Modal for confirming account deletion */}
      <Modal
        show={showModal} // Control modal visibility
        onClose={() => setShowModal(false)} // Close modal handler
        popup
        size="md"
      >
        <Modal.Header />
        <Modal.Body>
          <div className="text-center">
            <HiOutlineExclamationCircle className="h-14 w-14 text-gray-400 dark:text-gray-200 mb-4 mx-auto" />
            <h3 className="mb-5 text-lg text-gray-500 dark:text-gray-400">
              Are you sure you want to delete your account?
            </h3>
            <div className="flex justify-center gap-4">
              <Button color="failure" onClick={handleDeleteUser}>
                Yes, I'm sure
              </Button>
              <Button onClick={() => setShowModal(false)} color="gray">
                No, Cancel
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
}

export default DashProfile; // Exporting the DashProfile component for use in other parts of the application
