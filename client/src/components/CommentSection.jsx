import { Alert, Button, Textarea } from "flowbite-react"; // Import UI components from Flowbite React
import React, { useEffect, useState } from "react"; // Import React hooks for state and effects
import { useSelector } from "react-redux"; // Import useSelector hook for accessing Redux store
import { Link, useNavigate } from "react-router-dom"; // Import Link for navigation and useNavigate for redirecting
import Comment from "./Comment"; // Import the Comment component
import { Modal } from "flowbite-react"; // Import Modal component for confirmation dialogs
import { HiOutlineExclamationCircle } from "react-icons/hi"; // Import warning icon from react-icons

// Component for displaying and submitting comments on a post
function CommentSection({ postId }) {
  // Retrieve the current user from the Redux store
  const { currentUser } = useSelector((state) => state.user);

  // State to handle new comment input, error messages, and the list of comments
  const [comment, setComment] = useState(""); // State for new comment input
  const [commentError, setCommentError] = useState(null); // State for storing any errors during submission
  const [comments, setComments] = useState([]); // State for storing list of comments
  const [showModal, setShowModal] = useState(false); // State to control the visibility of the delete confirmation modal
  const [commentToDelete, setCommentToDelete] = useState(null); // State to store the ID of the comment to delete
  const navigate = useNavigate(); // Hook for navigation/redirects

  // Handle comment submission
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission

    // Restrict comment length to a maximum of 200 characters
    if (comment.length > 200) {
      return; // Exit if the comment is too long
    }

    try {
      // Send the new comment to the API
      const res = await fetch("/api/comment/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json" // Indicate that the request body is in JSON format
        },
        body: JSON.stringify({
          content: comment, // Content of the new comment
          postId, // ID of the post the comment is associated with
          userId: currentUser._id // ID of the current user
        })
      });

      const data = await res.json(); // Parse the JSON response

      // If submission is successful, reset input, clear errors, and update comments
      if (res.ok) {
        setComment(""); // Clear the comment input
        setCommentError(null); // Clear any existing errors
        setComments([data, ...comments]); // Add the new comment to the start of the comments array
      }
    } catch (error) {
      setCommentError(error.message); // Set error message if comment submission fails
    }
  };

  // Fetch existing comments when the component mounts or postId changes
  useEffect(() => {
    const getComments = async () => {
      try {
        const res = await fetch(`/api/comment/getPostComments/${postId}`); // Fetch comments for the post
        if (res.ok) {
          const data = await res.json(); // Parse the JSON response
          setComments(data); // Update state with fetched comments
        }
      } catch (error) {
        console.log(error); // Log any errors to the console for debugging
      }
    };
    getComments(); // Call the function to fetch comments
  }, [postId]); // Dependency array ensures this runs when postId changes

  // Handle liking a comment
  const handleLike = async (commentId) => {
    try {
      // Redirect to sign-in if the user is not logged in
      if (!currentUser) {
        navigate("/sign-in");
        return;
      }

      // Send a request to like the comment
      const res = await fetch(`/api/comment/likeComment/${commentId}`, {
        method: "PUT"
      });

      // Update comment's likes if the request is successful
      if (res.ok) {
        const data = await res.json(); // Parse the response data
        setComments(
          comments.map(
            (comment) =>
              comment._id === commentId
                ? {
                    ...comment,
                    likes: data.likes, // Update the likes array
                    numberOfLikes: data.likes.length // Update the number of likes
                  }
                : comment // Leave other comments unchanged
          )
        );
      }
    } catch (error) {
      console.log(error); // Log any errors for debugging
    }
  };

  // Handle editing a comment
  const handleEdit = async (comment, editedContent) => {
    setComments(
      comments.map(
        (c) => (c._id === comment._id ? { ...c, content: editedContent } : c) // Update the comment content if it matches
      )
    );
  };

  // Handle deleting a comment
  const handleDelete = async (commentId) => {
    setShowModal(false); // Close the modal after confirming
    try {
      if (!currentUser) {
        navigate("/sign-in"); // Redirect if the user is not signed in
        return;
      }
      const res = await fetch(`/api/comment/deleteComment/${commentId}`, {
        method: "DELETE" // Send a DELETE request to the API
      });
      if (res.ok) {
        setComments(comments.filter((comment) => comment._id !== commentId)); // Remove the deleted comment from the state
      }
    } catch (error) {
      console.log(error.message); // Log any error messages
    }
  };

  return (
    <div className="max-w-2xl mx-auto w-full p-3">
      {/* Display current user info if signed in */}
      {currentUser ? (
        <div className="flex items-center gap-1 my-5 text-gray-500 text-sm">
          <p>Signed in as:</p>
          <img
            className="h-5 w-5 object-cover rounded-full"
            src={currentUser.profilePicture} // Display the user's profile picture
            alt="Profile Image"
          />
          <Link
            className="text-xs text-cyan-600 hover:underline"
            to={"/dashboard?tab=profile"}
          >
            @{currentUser.username} {/* Display the user's username */}
          </Link>
        </div>
      ) : (
        // Message and sign-in link if user is not logged in
        <div className="text-sm text-teal-500 my-5 flex gap-1">
          You must be signed in to comment.
          <Link className="text-blue-500 hover:underline" to="/sign-in">
            Sign in
          </Link>
        </div>
      )}

      {/* Comment submission form if user is logged in */}
      {currentUser && (
        <form
          onSubmit={handleSubmit}
          className="border border-teal-500 rounded-md p-3"
        >
          <Textarea
            placeholder="Add a comment"
            rows="3"
            maxLength="200"
            onChange={(e) => setComment(e.target.value)} // Update comment state on change
            value={comment} // Bind the value to the comment state
          />
          <div className="flex justify-between items-center mt-5">
            <p className="text-gray-500 text-xs">
              {200 - comment.length} characters remaining{" "}
              {/* Show remaining characters */}
            </p>
            <Button outline gradientDuoTone="purpleToBlue" type="submit">
              Submit {/* Submit button */}
            </Button>
          </div>
          {/* Show error message if comment submission fails */}
          {commentError && (
            <Alert color="failure" className="mt-5">
              {commentError} {/* Display error message */}
            </Alert>
          )}
        </form>
      )}

      {/* Display list of comments if any exist */}
      {comments.length === 0 ? (
        <p className="text-sm my-5">No Comments yet!</p> // Message when no comments are present
      ) : (
        <>
          <div className="text-sm my-5 flex items-center gap-1">
            <p>Comments</p>
            <div className="border border-gray-400 py-1 px-2 rounded-sm">
              <p>{comments.length}</p> {/* Show the number of comments */}
            </div>
          </div>
          {/* Render each comment using the Comment component */}
          {comments.map((comment) => (
            <Comment
              key={comment._id} // Unique key for each comment
              comment={comment}
              onLike={handleLike} // Pass handleLike function as prop
              onEdit={handleEdit} // Pass handleEdit function as prop
              onDelete={(commentId) => {
                setShowModal(true); // Show the modal when a delete action is triggered
                setCommentToDelete(commentId); // Store the comment ID to be deleted
              }}
            />
          ))}
        </>
      )}

      {/* Modal for delete confirmation */}
      <Modal
        show={showModal} // Control the visibility of the modal
        onClose={() => setShowModal(false)} // Close modal function
        popup
        size="md"
      >
        <Modal.Header /> {/* Optional header for the modal */}
        <Modal.Body>
          <div className="text-center">
            <HiOutlineExclamationCircle className="h-14 w-14 text-gray-400 dark:text-gray-200 mb-4 mx-auto" />
            <h3 className="mb-5 text-lg text-gray-500 dark:text-gray-400">
              Are you sure you want to delete this comment?
            </h3>
            <div className="flex justify-center gap-4">
              <Button
                color="failure" // Button color for a destructive action
                onClick={() => handleDelete(commentToDelete)} // Confirm delete action
              >
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

export default CommentSection; // Export the component for use in other parts of the app
