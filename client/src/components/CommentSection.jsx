import { Alert, Button, Textarea } from "flowbite-react";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import Comment from "./Comment";

// Component for displaying and submitting comments on a post
function CommentSection({ postId }) {
  // Retrieve the current user from the Redux store
  const { currentUser } = useSelector((state) => state.user);

  // State to handle new comment input, error messages, and the list of comments
  const [comment, setComment] = useState("");
  const [commentError, setCommentError] = useState(null);
  const [comments, setComments] = useState([]);
  const navigate = useNavigate();

  console.log(comments); // Debugging log to check the comments array

  // Handle comment submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Restrict comment length to a maximum of 200 characters
    if (comment.length > 200) {
      return;
    }

    try {
      // Send the new comment to the API
      const res = await fetch("/api/comment/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          content: comment,
          postId,
          userId: currentUser._id
        })
      });

      const data = await res.json();

      // If submission is successful, reset input, clear errors, and update comments
      if (res.ok) {
        setComment("");
        setCommentError(null);
        setComments([data, ...comments]); // Add the new comment to the beginning of the comments array
      }
    } catch (error) {
      setCommentError(error.message); // Set error message if comment submission fails
    }
  };

  // Fetch existing comments when component mounts or postId changes
  useEffect(() => {
    const getComments = async () => {
      try {
        const res = await fetch(`/api/comment/getPostComments/${postId}`);
        if (res.ok) {
          const data = await res.json();
          setComments(data); // Update state with fetched comments
        }
      } catch (error) {
        console.log(error); // Log errors to console for debugging
      }
    };
    getComments();
  }, [postId]);

  // Handle liking a comment
  const handleLike = async (commentId) => {
    try {
      // Redirect to sign-in if user is not logged in
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
        const data = await res.json();
        setComments(
          comments.map((comment) =>
            comment._id === commentId
              ? {
                  ...comment,
                  likes: data.likes,
                  numberOfLikes: data.likes.length
                }
              : comment
          )
        );
      }
    } catch (error) {
      console.log(error); // Log errors to console for debugging
    }
  };

  return (
    <div className="max-w-2xl mx-auto w-full p-3">
      {/* Show current user information if signed in */}
      {currentUser ? (
        <div className="flex items-center gap-1 my-5 text-gray-500 text-sm">
          <p>Signed in as:</p>
          <img
            className="h-5 w-5 object-cover rounded-full"
            src={currentUser.profilePicture}
            alt="Profile Image"
          />
          <Link
            className="text-xs text-cyan-600 hover:underline"
            to={"/dashboard?tab=profile"}
          >
            @{currentUser.username}
          </Link>
        </div>
      ) : (
        // Message and link to sign in if user is not logged in
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
            value={comment}
          />
          <div className="flex justify-between items-center mt-5">
            <p className="text-gray-500 text-xs">
              {200 - comment.length} characters remaining
            </p>
            <Button outline gradientDuoTone="purpleToBlue" type="submit">
              Submit
            </Button>
          </div>
          {/* Show error message if comment submission fails */}
          {commentError && (
            <Alert color="failure" className="mt-5">
              {commentError}
            </Alert>
          )}
        </form>
      )}

      {/* Display list of comments if any exist */}
      {comments.length === 0 ? (
        <p className="text-sm my-5">No Comments yet!</p>
      ) : (
        <>
          <div className="text-sm my-5 flex items-center gap-1">
            <p>Comments</p>
            <div className="border border-gray-400 py-1 px-2 rounded-sm">
              <p>{comments.length}</p> {/* Show total number of comments */}
            </div>
          </div>
          {/* Render each comment using the Comment component */}
          {comments.map((comment) => (
            <Comment key={comment._id} comment={comment} onLike={handleLike} />
          ))}
        </>
      )}
    </div>
  );
}

export default CommentSection;
