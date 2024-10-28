import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable
} from "firebase/storage";
import { Alert, Button, FileInput, Select, TextInput } from "flowbite-react";
import React, { useEffect, useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { app } from "../firebase";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";

function UpdatePost() {
  // State hooks for managing form data and UI state
  const [file, setFile] = useState(null); // Selected image file
  const [imageUploadProgress, setImageUploadProgress] = useState(null); // Progress of image upload
  const [imageUploadError, setImageUploadError] = useState(null); // Error state for image upload
  const [formData, setFormData] = useState({
    title: "",
    category: "uncategorized",
    image: "",
    content: ""
  });
  const [publishError, setPublishError] = useState(null); // Error state for publishing the post
  const [loading, setLoading] = useState(true); // Loading state to manage asynchronous data fetching
  const { currentUser } = useSelector((state) => state.user); // Get current user from Redux store
  const { postId } = useParams(); // Get post ID from URL parameters
  const navigate = useNavigate(); // Hook for programmatic navigation

  // Fetch post data when the component mounts or postId changes
  useEffect(() => {
    const fetchPost = async () => {
      try {
        // Make an API call to fetch the post details
        const res = await fetch(`/api/post/getposts?postId=${postId}`);
        const data = await res.json();
        if (!res.ok) {
          console.error("Error fetching post data: ", data.message);
          setPublishError(data.message); // Set error message if the request fails
        } else {
          // Populate formData state with fetched post data
          setFormData({
            title: data.posts[0].title,
            category: data.posts[0].category,
            image: data.posts[0].image,
            content: data.posts[0].content,
            _id: data.posts[0]._id // Include post ID for the update
          });
          setPublishError(null); // Clear any previous errors
        }
      } catch (error) {
        console.error("Error fetching post data: ", error);
        setPublishError("Could not load post data"); // Set error if fetching fails
      } finally {
        setLoading(false); // Mark loading completed
      }
    };

    fetchPost(); // Call the async function to fetch post data
  }, [postId]);

  // Handle image upload to Firebase Storage
  const handleUploadImage = async () => {
    if (!file) {
      setImageUploadError("Please select an image to upload"); // Error if no file selected
      return;
    }
    setImageUploadError(null); // Clear any previous errors
    const storage = getStorage(app); // Reference to Firebase storage
    const fileName = new Date().getTime() + "-" + file.name; // Create a unique file name
    const storageRef = ref(storage, fileName); // Create a reference for the file in storage
    const uploadTask = uploadBytesResumable(storageRef, file); // Start the upload task

    // Monitor the upload's state changes
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        // Calculate and set the upload progress
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setImageUploadProgress(progress.toFixed(0)); // Update progress state
      },
      (error) => {
        // Handle any errors during upload
        setImageUploadError("Error uploading image: " + error.message);
        setImageUploadProgress(null); // Reset progress on error
      },
      () => {
        // Handle successful upload
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          // Set the image URL in formData once uploaded
          setImageUploadProgress(null);
          setImageUploadError(null);
          setFormData((prevData) => ({ ...prevData, image: downloadURL }));
        });
      }
    );
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission behavior
    console.log("Form Data to Submit: ", formData); // Log the data being submitted

    // Validation checks before submission
    if (!formData._id) {
      setPublishError("Post ID is not set."); // Ensure post ID is available
      return;
    }

    if (!currentUser || !currentUser._id) {
      setPublishError("Current user is not authenticated."); // Ensure the user is authenticated
      return;
    }

    try {
      // Send a PUT request to update the post
      const res = await fetch(
        `/api/post/updatepost/${formData._id}/${currentUser._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json" // Set content type for JSON data
          },
          body: JSON.stringify(formData) // Include form data in the request body
        }
      );
      const data = await res.json(); // Parse JSON response

      console.log("Response Data: ", data); // Log response data for debugging

      if (!res.ok) {
        console.error("Error: ", data.message); // Log error message if the request fails
        setPublishError(data.message); // Show the error
        return;
      }

      if (res.ok) {
        setPublishError(null); // Clear any previous errors
        navigate(`/post/${data.slug}`); // Redirect to the updated post's page
      }
    } catch (error) {
      console.error("Caught Error: ", error); // Log any caught errors
      setPublishError("Something went wrong"); // Show a generic error message
    }
  };

  // Show a loading message while the data is being fetched
  if (loading) return <p>Loading...</p>;

  return (
    <div className="p-3 max-w-3xl mx-auto min-h-screen">
      <h1 className="text-center text-3xl my-7 font-semibold">Update post</h1>

      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <div className="flex flex-col gap-4 sm:flex-row justify-between">
          <TextInput
            type="text"
            label="Title"
            placeholder="Enter title"
            required
            id="title"
            className="flex-1"
            onChange={
              (e) => setFormData({ ...formData, title: e.target.value }) // Update title in form data
            }
            value={formData.title || ""} // Bind the input value
          />

          <Select
            onChange={
              (e) => setFormData({ ...formData, category: e.target.value }) // Update category in form data
            }
            value={formData.category || "uncategorized"}
          >
            <option value="uncategorized">Select a category</option>
            <option value="javascript">JavaScript</option>
            <option value="react">React.js</option>
            <option value="nextjs">Next.js</option>
          </Select>
        </div>
        <div className="flex gap-4 items-center justify-between border-4 border-teal-500 border-dotted p-3">
          <FileInput
            type="file"
            id="file"
            accept="image/*"
            onChange={(e) => setFile(e.target.files[0])} // Set the selected file
          />
          <Button
            type="button"
            gradientDuoTone="purpleToBlue"
            size="sm"
            outline
            onClick={handleUploadImage} // Call the upload function
            disabled={imageUploadProgress} // Disable the button during upload
          >
            {imageUploadProgress ? (
              <div className="w-16 h-16">
                <CircularProgressbar
                  value={imageUploadProgress}
                  text={`${imageUploadProgress || 0}%`} // Show the upload progress
                />
              </div>
            ) : (
              "Upload Image" // Button text before upload starts
            )}
          </Button>
        </div>
        {imageUploadError && <Alert color="failure">{imageUploadError}</Alert>}{" "}
        // Show any upload errors
        {formData.image && (
          <img
            src={formData.image}
            alt="uploaded"
            className="w-full h-72 object-cover"
          />
        )}
        <ReactQuill
          theme="snow"
          value={formData.content || ""} // Bind the editor value to form data
          placeholder="Write Something"
          className="h-72 mb-12"
          required
          onChange={
            (value) => setFormData({ ...formData, content: value }) // Update content in form data
          }
        />
        <Button type="submit" gradientDuoTone="purpleToPink">
          Update
        </Button>
        {publishError && (
          <Alert color="failure" className="mt-5">
            {publishError} {/*Show any publishing errors */}
          </Alert>
        )}
      </form>
    </div>
  );
}

export default UpdatePost;
