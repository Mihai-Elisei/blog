import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable
} from "firebase/storage"; // Import functions for Firebase storage
import { Alert, Button, FileInput, Select, TextInput } from "flowbite-react"; // Import UI components from Flowbite
import React, { useState } from "react"; // Import React and useState hook
import ReactQuill from "react-quill"; // Import ReactQuill for rich text editing
import "react-quill/dist/quill.snow.css"; // Import stylesheet for ReactQuill
import { app } from "../firebase"; // Import configured Firebase app
import { CircularProgressbar } from "react-circular-progressbar"; // Import CircularProgress component
import "react-circular-progressbar/dist/styles.css"; // Import styles for CircularProgress component

// Component to create a new post with title, category selection, image upload, and content editor
function CreatePost() {
  // State hooks to manage file upload, progress, errors, and form data
  const [file, setFile] = useState(null); // Holds the selected file
  const [imageUploadProgress, setImageUploadProgress] = useState(null); // Tracks upload progress
  const [imageUploadError, setImageUploadError] = useState(null); // Holds any upload errors
  const [formData, setFormData] = useState({}); // Holds the form data

  // Function to handle image upload to Firebase Storage
  const handleUploadImage = async () => {
    try {
      // Check if a file is selected
      if (!file) {
        setImageUploadError("Please select an image to upload");
        return; // Exit if no file is selected
      }
      setImageUploadError(null); // Clear any previous errors

      // Get a reference to Firebase storage
      const storage = getStorage(app);
      // Create a unique file name using timestamp
      const fileName = new Date().getTime() + "-" + file.name;
      // Create a reference to the storage location
      const storageRef = ref(storage, fileName);
      // Start the upload task
      const uploadTask = uploadBytesResumable(storageRef, file);

      // Monitor the upload progress
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          // Calculate progress percentage
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          // Update progress in state
          setImageUploadProgress(progress.toFixed(0));
        },
        (error) => {
          // Handle upload errors
          setImageUploadError("Error uploading image: " + error.message);
          setImageUploadProgress(null);
        },
        () => {
          // Handle successful uploads
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            // Reset progress and error states
            setImageUploadProgress(null);
            setImageUploadError(null);
            // Update form data with the uploaded image URL
            setFormData({ ...formData, image: downloadURL });
          });
        }
      );
    } catch (error) {
      // Handle any unexpected errors
      setImageUploadError("Error uploading image: " + error.message);
      setImageUploadProgress(null);
      console.error("Error uploading image: ", error);
    }
  };

  return (
    <div className="p-3 mx-w-3lx mx-auto min-h-screen">
      {/* Page title */}
      <h1 className="text-center text-3xl my-7 font-semibold">Create a post</h1>

      {/* Form to create a new post */}
      <form className="flex flex-col gap-4">
        {/* Row for title input and category selection */}
        <div className="flex flex-col gap-4 sm:flex-row justify-between">
          {/* Text input for the post title */}
          <TextInput
            type="text"
            label="Title"
            placeholder="Enter title"
            required
            id="title"
            className="flex-1"
          />

          {/* Select dropdown for choosing post category */}
          <Select>
            <option value="uncategorized">Select a category</option>
            <option value="javascript">JavaScript</option>
            <option value="react">React.js</option>
            <option value="nextjs">Next.js</option>
          </Select>
        </div>

        {/* Section for file upload with dotted border styling */}
        <div className="flex gap-4 items-center justify-between border-4 border-teal-500 border-dotted p-3">
          {/* File input for uploading an image */}
          <FileInput
            type="file"
            id="file"
            accept="image/*"
            onChange={(e) => setFile(e.target.files[0])} // Set the selected file to state
          />

          {/* Button to trigger image upload */}
          <Button
            type="button"
            gradientDuoTone="purpleToBlue"
            size="sm"
            outline
            onClick={handleUploadImage} // Call upload function on click
            disabled={imageUploadProgress} // Disable if upload is in progress
          >
            {imageUploadProgress ? (
              <div className="w-16 h-16">
                <CircularProgressbar
                  value={imageUploadProgress}
                  text={`${imageUploadProgress || 0}%`}
                />
              </div>
            ) : (
              "Upload Image"
            )}
          </Button>
        </div>

        {/* Error message for image upload */}
        {imageUploadError && <Alert color="failure">{imageUploadError}</Alert>}

        {/* Show the uploaded image preview if available */}
        {formData.image && (
          <img
            src={formData.image}
            alt="uploaded"
            className="w-full h-72 object-cover"
          />
        )}

        {/* Text editor for post content using ReactQuill */}
        <ReactQuill
          theme="snow"
          placeholder="Write Something"
          className="h-72 mb-12"
          required
        />

        {/* Submit button to publish the post */}
        <Button type="submit" gradientDuoTone="purpleToPink">
          Publish
        </Button>
      </form>
    </div>
  );
}

export default CreatePost; // Export the component for use in other files
