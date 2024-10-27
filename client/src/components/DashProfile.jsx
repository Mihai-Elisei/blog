import { Alert, Button, TextInput } from "flowbite-react"; // Importing necessary components from the Flowbite library
import React, { useEffect, useRef, useState } from "react"; // Importing React and necessary hooks
import { useSelector } from "react-redux"; // Importing useSelector to access Redux state
import {
  getDownloadURL,
  getStorage,
  uploadBytesResumable,
  ref
} from "firebase/storage"; // Importing Firebase storage functions
import { app } from "../firebase"; // Importing initialized Firebase app
import { CircularProgressbar } from "react-circular-progressbar"; // Importing circular progress bar component
import "react-circular-progressbar/dist/styles.css"; // Importing styles for the circular progress bar

function DashProfile() {
  // Accessing the current user from the Redux store
  const { currentUser } = useSelector((state) => state.user);
  const [imageFile, setImageFile] = useState(null); // State to hold the selected image file
  const [imageFileUrl, setImageFileUrl] = useState(null); // State to hold the URL of the uploaded image
  const [imageFileUploadingProgress, setImageFileUploadingProgress] =
    useState(null); // State for tracking upload progress
  const [imageFileUploadError, setImageFileUploadError] = useState(null); // State to catch upload errors
  const filePickerRef = useRef(); // Ref for the file input element

  // Function to handle image file selection
  const handleImageChange = (e) => {
    const file = e.target.files[0]; // Get the selected file
    if (file) {
      setImageFile(file); // Set image file state
      setImageFileUrl(URL.createObjectURL(file)); // Create a temporary URL for the selected file
    }
  };

  // Effect to upload the image when a new image file is selected
  useEffect(() => {
    if (imageFile) {
      uploadImage(); // Call the upload function
    }
  }, [imageFile]); // Only run the effect when imageFile changes

  // Function to upload image to Firebase Storage
  const uploadImage = async () => {
    setImageFileUploadError(null); // Reset upload error state
    const storage = getStorage(app); // Get reference to Firebase storage
    const fileName = new Date().getTime() + imageFile.name; // Create unique file name based on current timestamp
    const storageRef = ref(storage, fileName); // Create a reference for the file in storage
    const uploadTask = uploadBytesResumable(storageRef, imageFile); // Start the upload task

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        // Monitor upload progress
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100; // Calculate percentage
        setImageFileUploadingProgress(progress.toFixed(0)); // Update progress state
      },
      (error) => {
        // Handle any upload errors
        setImageFileUploadError(
          "Could not upload image (File must be less than 2MB)"
        );
        setImageFileUploadingProgress(null); // Reset progress
        setImageFile(null); // Clear image file state
        setImageFileUrl(null); // Clear temporary image URL
      },
      () => {
        // Handle successful upload
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setImageFileUrl(downloadURL); // Set the image URL in state
        });
      }
    );
  };

  return (
    <div className="max-w-lg mx-auto p-3 w-full">
      {/* Master container for the profile with max width and centered */}
      <h1 className="my-7 text-center font-semibold text-3xl">Profile</h1>
      {/* Header for the profile section */}
      <form className="flex flex-col gap-4">
        {/* Form to update profile information */}
        <input
          type="file"
          accept="image/*" // Accepts image file types
          onChange={handleImageChange} // Change event to handle file selection
          ref={filePickerRef} // Reference to the input
          hidden // Hides the input since we use a custom clickable div
        />
        {/* Profile picture display and upload handler */}
        <div
          className="relative w-32 h-32 self-center cursor-pointer shadow-md overflow-hidden rounded-full"
          onClick={() => filePickerRef.current.click()} // Trigger file picker on click
        >
          {imageFileUploadingProgress && ( // Show the progress bar if uploading
            <CircularProgressbar
              value={imageFileUploadingProgress || 0} // Set progress value
              text={`${imageFileUploadingProgress}%`} // Text to display
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
                  }` // Progress bar colour based on progress
                }
              }}
            />
          )}
          <img
            src={imageFileUrl || currentUser.profilePicture} // Profile picture sourced from state or fallback to the current user
            alt="Profile Image" // Alt text for the image
            className={`rounded-full w-full h-full object-cover border-8 border-[lightgray] ${
              imageFileUploadingProgress && // Change opacity if uploading
              imageFileUploadingProgress < 100 &&
              "opacity-20"
            }`}
          />
        </div>
        {/* Show an error message if any upload error occurs */}
        {imageFileUploadError && (
          <Alert color="failure">{imageFileUploadError}</Alert>
        )}
        {/* Input field for username */}
        <TextInput
          type="text"
          id="username"
          placeholder="username" // Placeholder text
          defaultValue={currentUser.username} // Default value set to current user's username
        />
        {/* Input field for email */}
        <TextInput
          type="email"
          id="email"
          placeholder="email" // Placeholder text
          defaultValue={currentUser.email} // Default value set to current user's email
        />
        {/* Input field for password (no default value for security reasons) */}
        <TextInput type="password" id="password" placeholder="password" />
        {/* Button to submit the form */}
        <Button type="submit" gradientDuoTone="purpleToBlue" outline>
          Update
        </Button>
        {/* Links for account actions */}
        <div className="text-red-500 flex justify-between mt-5">
          <span className="cursor-pointer">Delete Account</span>
          {/* Link to delete the account */}
          <span className="cursor-pointer">Sign Out</span>
          {/* Link to sign out */}
        </div>
      </form>
    </div>
  );
}

export default DashProfile; // Exporting the DashProfile component for use in other parts of the application
