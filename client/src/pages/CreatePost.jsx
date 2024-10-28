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
import { useNavigate } from "react-router-dom"; // Import useNavigate hook from React Router

// Component to create a new post with title, category selection, image upload, and content editor
function CreatePost() {
  // State hooks to manage file upload, progress, errors, and form data
  const [file, setFile] = useState(null); // Holds the selected file from input
  const [imageUploadProgress, setImageUploadProgress] = useState(null); // Tracks upload progress percentage
  const [imageUploadError, setImageUploadError] = useState(null); // Holds any errors encountered during image upload
  const [formData, setFormData] = useState({}); // Holds the form data (title, category, image, content)
  const [publishError, setPublishError] = useState(null); // Holds any errors encountered during post publishing
  const navigate = useNavigate(); // Hook to programmatically navigate to different routes

  // Function to handle image upload to Firebase Storage
  const handleUploadImage = async () => {
    try {
      // Check if a file is selected
      if (!file) {
        setImageUploadError("Please select an image to upload"); // Set error if no file is selected
        return; // Exit if no file selected
      }
      setImageUploadError(null); // Clear any previous errors

      // Get a reference to Firebase Storage
      const storage = getStorage(app);
      // Create a unique file name using the current timestamp and original file name
      const fileName = new Date().getTime() + "-" + file.name;
      // Create a reference to the location in storage where the file will be uploaded
      const storageRef = ref(storage, fileName);
      // Start the upload task, allowing progress tracking
      const uploadTask = uploadBytesResumable(storageRef, file);

      // Monitor the upload process
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          // Calculate the upload progress as a percentage
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          // Update the state with the upload progress
          setImageUploadProgress(progress.toFixed(0));
        },
        (error) => {
          // Handle upload errors
          setImageUploadError("Error uploading image: " + error.message); // Set error message
          setImageUploadProgress(null); // Reset progress state
        },
        () => {
          // Handle successful uploads
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            // Reset progress and error states after successful upload
            setImageUploadProgress(null);
            setImageUploadError(null);
            // Update the form data with the URL of the uploaded image
            setFormData({ ...formData, image: downloadURL });
          });
        }
      );
    } catch (error) {
      // Handle any unexpected errors that may occur
      setImageUploadError("Error uploading image: " + error.message);
      setImageUploadProgress(null); // Reset progress state
      console.error("Error uploading image: ", error); // Log error to console for debugging
    }
  };

  // Function to handle post submission
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent the default form submission behavior
    try {
      // Send a POST request to the API with the form data
      const res = await fetch("/api/post/create", {
        method: "POST", // Use POST method for creating a new post
        headers: {
          "Content-Type": "application/json" // Set the Content-Type header to application/json
        },
        body: JSON.stringify(formData) // Convert the form data to JSON string for the request body
      });
      // Parse the JSON response from the server
      const data = await res.json();
      // Check if the response is not OK (indicates an error)
      if (!res.ok) {
        setPublishError(data.message); // Set error message returned from the server
        return; // Exit the function if there was an error
      }

      if (res.ok) {
        setPublishError(null); // Clear any previous publish errors
        navigate(`/post/${data.slug}`); // Redirect to the newly created post's route using its slug
      }
    } catch (error) {
      // Handle any errors that may occur during the fetch operation
      setPublishError("Error creating post: " + error.message);
    }
  };

  return (
    <div className="p-3 mx-w-3lx mx-auto min-h-screen">
      {/* Page title */}
      <h1 className="text-center text-3xl my-7 font-semibold">Create a post</h1>

      {/* Form to create a new post */}
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
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
            onChange={(e) => {
              // Update the title field in formData state on input change
              setFormData({ ...formData, title: e.target.value });
            }}
          />

          {/* Select dropdown for choosing post category */}
          <Select
            onChange={(e) => {
              // Update the category field in formData state on selection change
              setFormData({ ...formData, category: e.target.value });
            }}
          >
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
            accept="image/*" // Only accept image files
            onChange={(e) => setFile(e.target.files[0])} // Set the selected file to state on selection change
          />

          {/* Button to trigger image upload */}
          <Button
            type="button"
            gradientDuoTone="purpleToBlue"
            size="sm"
            outline
            onClick={handleUploadImage} // Call the image upload function on click
            disabled={imageUploadProgress} // Disable the button if upload is in progress
          >
            {imageUploadProgress ? ( // Show progress if available
              <div className="w-16 h-16">
                <CircularProgressbar
                  value={imageUploadProgress}
                  text={`${imageUploadProgress || 0}%`} // Show the upload percentage
                />
              </div>
            ) : (
              "Upload Image" // Button text when not uploading
            )}
          </Button>
        </div>

        {/* Error message for image upload */}
        {imageUploadError && <Alert color="failure">{imageUploadError}</Alert>}

        {/* Show the uploaded image preview if available */}
        {formData.image && (
          <img
            src={formData.image} // Show the uploaded image using the URL stored in formData
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
          onChange={(value) => {
            // Update the content field in formData state on editor change
            setFormData({ ...formData, content: value });
          }}
        />

        {/* Submit button to publish the post */}
        <Button type="submit" gradientDuoTone="purpleToPink">
          Publish
        </Button>

        {/* Error message for post creation */}
        {publishError && (
          <Alert color="failure" className="mt-5">
            {publishError}{" "}
          </Alert>
        )}
      </form>
    </div>
  );
}

export default CreatePost; // Export the component for use in other files
