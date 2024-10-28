import { Button, Modal, Table } from "flowbite-react"; // Import UI components from Flowbite
import React, { useEffect, useState } from "react"; // Import necessary React hooks
import { HiOutlineExclamationCircle } from "react-icons/hi"; // Import ExclamationCircle icon for user confirmation modal
import { useSelector } from "react-redux"; // Import useSelector to access Redux state
import { Link } from "react-router-dom"; // Import Link for navigation in React Router

function DashPosts() {
  // Access the currentUser from the Redux state
  const { currentUser } = useSelector((state) => state.user);
  const [userPosts, setUserPosts] = useState([]); // State to hold the fetched user's posts
  const [showMore, setShowMore] = useState(true); // State to toggle the visibility of the "Show More" button
  const [showModal, setShowModal] = useState(false); // State to toggle the modal for post deletion confirmation
  const [postIdToDelete, setPostIdToDelete] = useState(""); // State to store the ID of the post to delete

  // Log the userPosts to the console for debugging
  console.log(userPosts);

  // Effect to fetch posts when the component mounts or when currentUser changes
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        // Fetch the posts for the current user from the API
        const response = await fetch(
          `/api/post/getposts?userId=${currentUser._id}`
        );
        const data = await response.json(); // Parse the response to JSON

        // Check if the response is OK and update the state with the posts data
        if (response.ok) {
          setUserPosts(data.posts); // Set the fetched posts
          // Hide "Show More" if the number of fetched posts is less than 9
          if (data.posts.length < 9) setShowMore(false);
        }
      } catch (error) {
        console.error(error); // Log any errors that occur during the fetch
      }
    };

    // Only fetch posts if the current user is an admin
    if (currentUser.isAdmin) fetchPosts();
  }, [currentUser._id]); // Effect runs when currentUser._id changes

  // Handle the "Show More" button click to fetch additional posts
  const handleShowMore = async () => {
    const startIndex = userPosts.length; // Determine where to start fetching new posts
    try {
      // Fetch more posts from the API with a specified limit
      const res = await fetch(
        `/api/post/getposts?userId=${currentUser._id}&startIndex=${startIndex}&limit=9`
      );
      const data = await res.json();
      if (res.ok) {
        setUserPosts((prev) => [...prev, ...data.posts]); // Append new posts to the existing posts list
        // Hide "Show More" button if the number of new posts returned is less than 9
        if (data.posts.length < 9) setShowMore(false);
      }
    } catch (error) {
      console.error(error); // Handle any errors that occur during the fetch
    }
  };

  // Handle deleting a post
  const handleDeletePost = async () => {
    setShowModal(false); // Close the modal after confirmation
    try {
      // Send a DELETE request to the API to delete the specified post
      const res = await fetch(
        `/api/post/delete/${postIdToDelete}/${currentUser._id}`,
        {
          method: "DELETE"
        }
      );
      const data = await res.json();
      if (!res.ok) {
        console.error(data.message); // Log error message if deletion fails
      } else {
        // Update the posts state to remove the deleted post
        setUserPosts((prev) =>
          prev.filter((post) => post._id !== postIdToDelete)
        );
        // Hide "Show More" button if the total posts drop below 9
        if (userPosts.length <= 9) setShowMore(false);
      }
    } catch (error) {
      console.log(error.message); // Handle any error that occurs during deletion
    }
  };

  return (
    <div className="table-auto w-full overflow-x-auto sm:overflow-x-scroll md:overflow-x-scroll md:mx-auto p-3 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500">
      {/* Check if the current user is an admin and if there are posts to display */}
      {currentUser.isAdmin && userPosts.length > 0 ? (
        <>
          {/* Render the posts in a table format */}
          <Table hoverable className="shadow-md">
            <Table.Head>
              {/* Table headers */}
              <Table.HeadCell>Date updated</Table.HeadCell>
              <Table.HeadCell>Post image</Table.HeadCell>
              <Table.HeadCell>Post title</Table.HeadCell>
              <Table.HeadCell>Category</Table.HeadCell>
              <Table.HeadCell>Delete</Table.HeadCell>
              <Table.HeadCell>
                <span>Edit</span>
              </Table.HeadCell>
            </Table.Head>
            {/* Render each post in the table body */}
            {userPosts.map((post) => (
              <Table.Body className="divide-y" key={post._id}>
                <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                  <Table.Cell>
                    {/* Format the updatedAt date to a locale string */}
                    {new Date(post.updatedAt).toLocaleDateString()}
                  </Table.Cell>
                  <Table.Cell>
                    {/* Link to post details with an image */}
                    <Link to={`/post/${post.slug}`}>
                      <img
                        src={post.image} // Post image URL
                        alt={post.title} // Alt text for accessibility
                        className="w-20 h-10 object-cover bg-gray-500"
                      />
                    </Link>
                  </Table.Cell>
                  <Table.Cell>
                    {/* Link to post details with title */}
                    <Link
                      className="font-medium text-gray-900 dark:text-white"
                      to={`/post/${post.slug}`}
                    >
                      {post.title}
                    </Link>
                  </Table.Cell>
                  <Table.Cell>{post.category}</Table.Cell>
                  <Table.Cell>
                    {/* Delete action with confirmation modal */}
                    <span
                      onClick={() => {
                        setShowModal(true); // Show the confirmation modal
                        setPostIdToDelete(post._id); // Set the ID of the post to delete
                      }}
                      className="font-medium text-red-500 hover:underline cursor-pointer"
                    >
                      Delete
                    </span>
                  </Table.Cell>
                  <Table.Cell>
                    {/* Link to edit the post */}
                    <Link
                      className="text-teal-500 hover:underline"
                      to={`/update-post/${post._id}`}
                    >
                      <span>Edit</span>
                    </Link>
                  </Table.Cell>
                </Table.Row>
              </Table.Body>
            ))}
          </Table>
          {/* Show more button */}
          {showMore && (
            <button
              onClick={handleShowMore}
              className="w-full text-teal-500 self-center text-sm py-7"
            >
              Show More
            </button>
          )}
        </>
      ) : (
        // Message for users with no posts
        <p>You have no posts yet!</p>
      )}
      {/* Modal for deletion confirmation */}
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
              Are you sure you want to delete this post?
            </h3>
            <div className="flex justify-center gap-4">
              <Button color="failure" onClick={handleDeletePost}>
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

export default DashPosts; // Export the DashPosts component
