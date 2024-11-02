import { Button, Modal, Table } from "flowbite-react"; // Import UI components for styling
import { useEffect, useState } from "react"; // Import React hooks for state and lifecycle
import { HiOutlineExclamationCircle } from "react-icons/hi"; // Import icon for delete confirmation
import { useSelector } from "react-redux"; // Import useSelector to access Redux state

// Dashboard Comments Component
export default function DashComments() {
  const { currentUser } = useSelector((state) => state.user); // Get the current user from Redux state
  const [comments, setComments] = useState([]); // State to hold the list of comments
  const [showMore, setShowMore] = useState(true); // State to control the display of the "Show More" button
  const [showModal, setShowModal] = useState(false); // State to control the visibility of the delete confirmation modal
  const [commentIdToDelete, setCommentIdToDelete] = useState(""); // State to store the ID of the comment to be deleted

  useEffect(() => {
    // Function to fetch comments from the backend
    const fetchComments = async () => {
      try {
        const res = await fetch(`/api/comment/getcomments`); // API call to get comments
        const data = await res.json(); // Parse response to JSON
        if (res.ok) {
          setComments(data.comments); // Update state with fetched comments
          // Disable "Show More" if fewer than 9 comments are retrieved
          if (data.comments.length < 9) {
            setShowMore(false);
          }
        }
      } catch (error) {
        console.log(error.message); // Log error message on failure
      }
    };

    // Fetch comments only if the current user is an admin
    if (currentUser.isAdmin) {
      fetchComments();
    }
  }, [currentUser._id]); // Dependency array ensures effect runs when currentUser._id changes

  // Function to load more comments when "Show More" button is clicked
  const handleShowMore = async () => {
    const startIndex = comments.length; // Determine index to fetch more comments starting from
    try {
      const res = await fetch(
        `/api/comment/getcomments?startIndex=${startIndex}`
      ); // Fetch more comments
      const data = await res.json(); // Parse response to JSON
      if (res.ok) {
        setComments((prev) => [...prev, ...data.comments]); // Append new comments to existing ones
        // Disable "Show More" if no more than 9 new comments are retrieved
        if (data.comments.length < 9) {
          setShowMore(false);
        }
      }
    } catch (error) {
      console.log(error.message); // Log error message on failure
    }
  };

  // Function to handle comment deletion
  const handleDeleteComment = async () => {
    setShowModal(false); // Close the confirmation modal
    try {
      const res = await fetch(
        `/api/comment/deleteComment/${commentIdToDelete}`,
        {
          method: "DELETE" // Specify DELETE request method
        }
      );
      const data = await res.json(); // Parse response to JSON
      if (res.ok) {
        // Update comments state by removing the deleted comment
        setComments((prev) =>
          prev.filter((comment) => comment._id !== commentIdToDelete)
        );
        setShowModal(false); // Ensure modal is closed
      } else {
        console.log(data.message); // Log any error message from the server
      }
    } catch (error) {
      console.log(error.message); // Log error message if deletion fails
    }
  };

  return (
    <div className="table-auto overflow-x-scroll md:mx-auto p-3 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500">
      {/* Check if user is admin and there are comments to display */}
      {currentUser.isAdmin && comments.length > 0 ? (
        <>
          {/* Comments table */}
          <Table hoverable className="shadow-md">
            <Table.Head>
              {/* Table headers */}
              <Table.HeadCell>Date updated</Table.HeadCell>
              <Table.HeadCell>Comment content</Table.HeadCell>
              <Table.HeadCell>Number of likes</Table.HeadCell>
              <Table.HeadCell>PostId</Table.HeadCell>
              <Table.HeadCell>UserId</Table.HeadCell>
              <Table.HeadCell>Delete</Table.HeadCell>
            </Table.Head>
            {/* Table body containing comments */}
            <Table.Body className="divide-y">
              {comments.map((comment) => (
                <Table.Row
                  key={comment._id}
                  className="bg-white dark:border-gray-700 dark:bg-gray-800"
                >
                  <Table.Cell>
                    {new Date(comment.updatedAt).toLocaleDateString()}
                  </Table.Cell>
                  <Table.Cell>{comment.content}</Table.Cell>
                  <Table.Cell>{comment.numberOfLikes}</Table.Cell>
                  <Table.Cell>{comment.postId}</Table.Cell>
                  <Table.Cell>{comment.userId}</Table.Cell>
                  <Table.Cell>
                    <span
                      onClick={() => {
                        setShowModal(true); // Open the modal for confirmation
                        setCommentIdToDelete(comment._id); // Set the ID of the comment to delete
                      }}
                      className="font-medium text-red-500 hover:underline cursor-pointer"
                    >
                      Delete
                    </span>
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
          {/* Show "Show More" button if there are more comments to load */}
          {showMore && (
            <button
              onClick={handleShowMore} // Load more comments when clicked
              className="w-full text-teal-500 self-center text-sm py-7"
            >
              Show more {/* Button label */}
            </button>
          )}
        </>
      ) : (
        <p>You have no comments yet!</p> // Message when there are no comments
      )}

      {/* Modal for delete confirmation */}
      <Modal
        show={showModal} // Control modal visibility
        onClose={() => setShowModal(false)} // Close modal function
        popup
        size="md"
      >
        <Modal.Header /> {/* Optional header */}
        <Modal.Body>
          <div className="text-center">
            <HiOutlineExclamationCircle className="h-14 w-14 text-gray-400 dark:text-gray-200 mb-4 mx-auto" />
            <h3 className="mb-5 text-lg text-gray-500 dark:text-gray-400">
              Are you sure you want to delete this comment?{" "}
              {/* Confirmation prompt */}
            </h3>
            <div className="flex justify-center gap-4">
              <Button color="failure" onClick={handleDeleteComment}>
                Yes, I'm sure {/* Confirmation button label */}
              </Button>
              <Button color="gray" onClick={() => setShowModal(false)}>
                No, cancel {/* Cancellation button label */}
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
}
