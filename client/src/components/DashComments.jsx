import { Modal, Table, Button } from "flowbite-react"; // Import UI components from Flowbite React for styling and functionality
import { useEffect, useState } from "react"; // Import React hooks for state and side effects
import { useSelector } from "react-redux"; // Import useSelector to access the Redux store
import { HiOutlineExclamationCircle } from "react-icons/hi"; // Import warning icon for the delete confirmation modal
import { FaCheck, FaTimes } from "react-icons/fa"; // Import icons for visual elements

// Component for managing and displaying comments in the admin dashboard
export default function DashComments() {
  const { currentUser } = useSelector((state) => state.user); // Access the current user from the Redux store
  const [comments, setComments] = useState([]); // State for storing the list of comments
  const [showMore, setShowMore] = useState(true); // State to control the "Show more" button visibility
  const [showModal, setShowModal] = useState(false); // State to control the visibility of the delete confirmation modal
  const [commentIdToDelete, setCommentIdToDelete] = useState(""); // State to store the ID of the comment to be deleted

  // Effect to fetch comments when the component mounts or when currentUser changes
  useEffect(() => {
    const fetchComments = async () => {
      try {
        const res = await fetch(`/api/comment/getcomments`); // Fetch comments from the API
        const data = await res.json(); // Parse the response as JSON
        if (res.ok) {
          setComments(data.comments); // Update comments state with the fetched data
          if (data.comments.length < 9) {
            setShowMore(false); // Hide "Show more" button if fewer than 9 comments are fetched
          }
        }
      } catch (error) {
        console.log(error.message); // Log errors for debugging
      }
    };
    if (currentUser.isAdmin) {
      fetchComments(); // Only fetch comments if the current user is an admin
    }
  }, [currentUser._id]); // Dependency array ensures this runs when currentUser._id changes

  // Function to handle loading more comments when "Show more" button is clicked
  const handleShowMore = async () => {
    const startIndex = comments.length; // Calculate the starting index for fetching more comments
    try {
      const res = await fetch(
        `/api/comment/getcomments?startIndex=${startIndex}`
      ); // Fetch more comments from the API
      const data = await res.json(); // Parse the response as JSON
      if (res.ok) {
        setComments((prev) => [...prev, ...data.comments]); // Append new comments to the existing list
        if (data.comments.length < 9) {
          setShowMore(false); // Hide "Show more" button if no more than 9 comments are returned
        }
      }
    } catch (error) {
      console.log(error.message); // Log any errors during the fetch
    }
  };

  // Function to handle deleting a comment
  const handleDeleteComment = async () => {
    setShowModal(false); // Close the modal after confirming the deletion
    try {
      const res = await fetch(
        `/api/comment/deleteComment/${commentIdToDelete}`,
        {
          method: "DELETE" // Send a DELETE request to the API
        }
      );
      const data = await res.json(); // Parse the response as JSON
      if (res.ok) {
        setComments(
          (prev) => prev.filter((comment) => comment._id !== commentIdToDelete) // Remove the deleted comment from the state
        );
        setShowModal(false); // Ensure the modal is closed
      } else {
        console.log(data.message); // Log any errors returned by the server
      }
    } catch (error) {
      console.log(error.message); // Log any errors that occur during deletion
    }
  };

  return (
    <div className="table-auto overflow-x-scroll md:mx-auto p-3 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500">
      {/* Display the comments table if the current user is an admin and there are comments */}
      {currentUser.isAdmin && comments.length > 0 ? (
        <>
          <Table hoverable className="shadow-md">
            {" "}
            {/* Table to display comment data */}
            <Table.Head>
              <Table.HeadCell>Date updated</Table.HeadCell>{" "}
              {/* Header for date */}
              <Table.HeadCell>Comment content</Table.HeadCell>{" "}
              {/* Header for comment content */}
              <Table.HeadCell>Number of likes</Table.HeadCell>{" "}
              {/* Header for number of likes */}
              <Table.HeadCell>PostId</Table.HeadCell> {/* Header for post ID */}
              <Table.HeadCell>UserId</Table.HeadCell> {/* Header for user ID */}
              <Table.HeadCell>Delete</Table.HeadCell>{" "}
              {/* Header for delete action */}
            </Table.Head>
            {/* Map over the comments array to create a table row for each comment */}
            {comments.map((comment) => (
              <Table.Body className="divide-y" key={comment._id}>
                <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                  <Table.Cell>
                    {new Date(comment.updatedAt).toLocaleDateString()}
                  </Table.Cell>{" "}
                  {/* Display formatted date */}
                  <Table.Cell>{comment.content}</Table.Cell>{" "}
                  {/* Display comment content */}
                  <Table.Cell>{comment.numberOfLikes}</Table.Cell>{" "}
                  {/* Display number of likes */}
                  <Table.Cell>{comment.postId}</Table.Cell>{" "}
                  {/* Display post ID */}
                  <Table.Cell>{comment.userId}</Table.Cell>{" "}
                  {/* Display user ID */}
                  <Table.Cell>
                    <span
                      onClick={() => {
                        setShowModal(true); // Show the modal when delete is clicked
                        setCommentIdToDelete(comment._id); // Set the comment ID for deletion
                      }}
                      className="font-medium text-red-500 hover:underline cursor-pointer"
                    >
                      Delete {/* Delete button */}
                    </span>
                  </Table.Cell>
                </Table.Row>
              </Table.Body>
            ))}
          </Table>
          {/* Show "Show more" button if applicable */}
          {showMore && (
            <button
              onClick={handleShowMore} // Load more comments when clicked
              className="w-full text-teal-500 self-center text-sm py-7"
            >
              Show more {/* Button text */}
            </button>
          )}
        </>
      ) : (
        <p>You have no comments yet!</p> // Display message if there are no comments
      )}
      {/* Modal for delete confirmation */}
      <Modal
        show={showModal} // Control modal visibility
        onClose={() => setShowModal(false)} // Close modal when requested
        popup
        size="md"
      >
        <Modal.Header /> {/* Modal header (optional) */}
        <Modal.Body>
          <div className="text-center">
            <HiOutlineExclamationCircle className="h-14 w-14 text-gray-400 dark:text-gray-200 mb-4 mx-auto" />{" "}
            {/* Warning icon */}
            <h3 className="mb-5 text-lg text-gray-500 dark:text-gray-400">
              Are you sure you want to delete this comment?{" "}
              {/* Confirmation text */}
            </h3>
            <div className="flex justify-center gap-4">
              <Button color="failure" onClick={handleDeleteComment}>
                Yes, I'm sure {/* Confirmation button */}
              </Button>
              <Button color="gray" onClick={() => setShowModal(false)}>
                No, cancel {/* Cancel button */}
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
}
