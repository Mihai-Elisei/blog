import { Alert, Button, Modal, TextInput } from "flowbite-react"; // Import components from Flowbite library
import React, { useEffect, useRef, useState } from "react"; // Import React and necessary hooks
import { useSelector } from "react-redux"; // Import useSelector for accessing Redux state
import {
  getDownloadURL,
  getStorage,
  uploadBytesResumable,
  ref
} from "firebase/storage"; // Import Firebase storage functions for file upload
import { app } from "../firebase"; // Import initialized Firebase app instance
import { CircularProgressbar } from "react-circular-progressbar"; // Import progress bar component for upload progress
import "react-circular-progressbar/dist/styles.css"; // Import CSS for progress bar
import { Link } from "react-router-dom"; // Import Link for navigation
import {
  updateStart,
  updateSuccess,
  updateFailure,
  deleteUserStart,
  deleteUserSuccess,
  deleteUserFailure,
  signoutSuccess
} from "../redux/user/userSlice"; // Import Redux actions
import { useDispatch } from "react-redux"; // Import useDispatch to dispatch Redux actions
import { HiOutlineExclamationCircle } from "react-icons/hi"; // Import icon for modal

function DashProfile() {
  // Access current user and error state from Redux store
  const { currentUser, error, loading } = useSelector((state) => state.user);

  // States for managing profile updates and image uploads
  const [imageFile, setImageFile] = useState(null); // State for selected image file
  const [imageFileUrl, setImageFileUrl] = useState(null); // State for image file URL after upload
  const [imageFileUploadingProgress, setImageFileUploadingProgress] =
    useState(null); // State for upload progress
  const [imageFileUploadError, setImageFileUploadError] = useState(null); // State for upload error
  const [imageFileUploading, setImageFileUploading] = useState(false); // State for upload status
  const [updateUserSuccess, setUpdateUserSuccess] = useState(null); // State for update success message
  const [updateUserError, setUpdateUserError] = useState(null); // State for update error message
  const [showModal, setShowModal] = useState(false); // State to control account deletion modal visibility
  const [formData, setFormData] = useState({}); // State to hold form data for user updates
  const filePickerRef = useRef(); // Ref for file input element
  const dispatch = useDispatch(); // Function to dispatch actions to Redux store

  // Handle file selection for profile picture upload
  const handleImageChange = (e) => {
    const file = e.target.files[0]; // Get selected file
    if (file) {
      setImageFile(file); // Set selected file in state
      setImageFileUrl(URL.createObjectURL(file)); // Create temporary URL for preview
    }
  };

  // Effect to upload image when a new image file is selected
  useEffect(() => {
    if (imageFile) {
      uploadImage(); // Trigger image upload
    }
  }, [imageFile]); // Run effect when imageFile state changes

  // Upload selected image to Firebase Storage
  const uploadImage = async () => {
    setImageFileUploading(true); // Set upload status to true
    setImageFileUploadError(null); // Clear previous errors
    const storage = getStorage(app); // Get Firebase storage reference
    const fileName = new Date().getTime() + imageFile.name; // Create unique file name
    const storageRef = ref(storage, fileName); // Create file reference in storage
    const uploadTask = uploadBytesResumable(storageRef, imageFile); // Start upload

    // Monitor upload progress, handle errors, and get download URL on success
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        // Monitor progress
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setImageFileUploadingProgress(progress.toFixed(0)); // Update progress state
      },
      (error) => {
        // Handle upload error
        setImageFileUploadError(
          "Could not upload image (File must be less than 2MB)"
        );
        setImageFileUploading(false); // Reset uploading status
        setImageFileUploadingProgress(null); // Clear progress
      },
      () => {
        // Handle successful upload
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setImageFileUrl(downloadURL); // Set download URL in state
          setFormData({ ...formData, profilePicture: downloadURL }); // Update form data with new URL
          setImageFileUploading(false); // Reset uploading status
        });
      }
    );
  };

  // Update form data state on input change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  // Handle form submission for profile update
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form behavior
    setUpdateUserError(null); // Clear previous error messages
    setUpdateUserSuccess(null); // Clear previous success messages
    if (Object.keys(formData).length === 0) {
      setUpdateUserError("No changes made"); // Show error if no changes made
      return;
    }
    if (imageFileUploading) {
      setUpdateUserError("Please wait for image to upload"); // Show error if upload is in progress
      return;
    }
    try {
      dispatch(updateStart()); // Dispatch update start action
      const res = await fetch(`/api/user/update/${currentUser._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if (!res.ok) {
        dispatch(updateFailure(data.message)); // Dispatch failure if request fails
        setUpdateUserError(data.message); // Show error message
      } else {
        dispatch(updateSuccess(data)); // Dispatch success with user data
        setUpdateUserSuccess("User profile updated successfully"); // Show success message
      }
    } catch (error) {
      dispatch(updateFailure(error.message)); // Dispatch failure on exception
    }
  };

  // Handle user account deletion
  const handleDeleteUser = async () => {
    setShowModal(false); // Close modal
    try {
      dispatch(deleteUserStart()); // Dispatch delete start action
      const res = await fetch(`/api/user/delete/${currentUser._id}`, {
        method: "DELETE"
      });
      const data = await res.json();
      if (!res.ok) {
        dispatch(deleteUserFailure(data.message)); // Dispatch failure on error
      } else {
        dispatch(deleteUserSuccess(data)); // Dispatch success on successful deletion
      }
    } catch (error) {
      dispatch(deleteUserFailure(error.message)); // Dispatch failure on exception
    }
  };

  // Handle user sign out
  const handleSignout = async () => {
    try {
      const res = await fetch("/api/user/signout", { method: "POST" });
      const data = await res.json();
      if (res.ok) {
        dispatch(signoutSuccess()); // Dispatch success on successful signout
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <div className="max-w-lg mx-auto p-3 w-full">
      <h1 className="my-7 text-center font-semibold text-3xl">Profile</h1>
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        {/* File input for selecting profile image */}
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          ref={filePickerRef}
          hidden
        />
        <div
          className="relative w-32 h-32 self-center cursor-pointer shadow-md overflow-hidden rounded-full"
          onClick={() => filePickerRef.current.click()}
        >
          {imageFileUploadingProgress && (
            <CircularProgressbar
              value={imageFileUploadingProgress || 0}
              text={`${imageFileUploadingProgress}%`}
              strokeWidth={5}
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
                  }`
                }
              }}
            />
          )}
          <img
            src={imageFileUrl || currentUser.profilePicture}
            alt="Profile Image"
            className={`rounded-full w-full h-full object-cover border-8 border-[lightgray] ${
              imageFileUploadingProgress &&
              imageFileUploadingProgress < 100 &&
              "opacity-20"
            }`}
          />
        </div>
        {imageFileUploadError && (
          <Alert color="failure">{imageFileUploadError}</Alert>
        )}

        {/* Username input */}
        <TextInput
          type="text"
          id="username"
          placeholder="username"
          defaultValue={currentUser.username}
          onChange={handleChange}
        />

        {/* Email input */}
        <TextInput
          type="email"
          id="email"
          placeholder="email"
          defaultValue={currentUser.email}
          onChange={handleChange}
        />

        {/* Password input */}
        <TextInput
          type="password"
          id="password"
          placeholder="password"
          onChange={handleChange}
        />

        {/* Update profile button */}
        <Button
          type="submit"
          gradientDuoTone="purpleToBlue"
          outline
          disabled={loading || imageFileUploading}
        >
          {loading ? "Loading..." : "Update"}
        </Button>

        {currentUser.isAdmin && (
          <Link to={"/create-post"}>
            <Button
              type="button"
              gradientDuoTone="purpleToPink"
              className="w-full"
            >
              Create a post
            </Button>
          </Link>
        )}
      </form>

      {/* Account actions links */}
      <div className="text-red-500 flex justify-between mt-5">
        <span onClick={() => setShowModal(true)} className="cursor-pointer">
          Delete Account
        </span>
        <span onClick={handleSignout} className="cursor-pointer">
          Sign Out
        </span>
      </div>

      {/* Display success or error messages */}
      {updateUserSuccess && (
        <Alert color="success" className="mt-5">
          {updateUserSuccess}
        </Alert>
      )}
      {updateUserError && (
        <Alert color="failure" className="mt-5">
          {updateUserError}
        </Alert>
      )}
      {error && (
        <Alert color="failure" className="mt-5">
          {error}
        </Alert>
      )}

      {/* Account deletion confirmation modal */}
      <Modal
        show={showModal}
        onClose={() => setShowModal(false)}
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

export default DashProfile;
