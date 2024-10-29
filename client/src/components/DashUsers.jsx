import { Button, Modal, Table } from "flowbite-react"; // Import UI components from Flowbite
import React, { useEffect, useState } from "react"; // Import necessary React hooks
import { HiOutlineExclamationCircle } from "react-icons/hi"; // Import ExclamationCircle icon for modal
import { useSelector } from "react-redux"; // Access Redux state
import { FaCheck, FaTimes } from "react-icons/fa"; // Import Check and Times icons

function DashUsers() {
  // Access currentUser from Redux state
  const { currentUser } = useSelector((state) => state.user);
  const [users, setUsers] = useState([]); // State to store the fetched users
  const [showMore, setShowMore] = useState(true); // State to manage "Show More" button visibility
  const [showModal, setShowModal] = useState(false); // State to control the deletion confirmation modal
  const [userIdToDelete, setUserIdToDelete] = useState(""); // State to hold the ID of the user to delete

  // Fetch users when the component mounts or when currentUser changes
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        // Request to fetch all users from the API
        const response = await fetch(`/api/user/getusers`);
        const data = await response.json(); // Parse the response as JSON

        if (response.ok) {
          setUsers(data.users); // Update state with the fetched users
          // Hide "Show More" button if fewer than 10 users are fetched
          if (data.users.length < 10) setShowMore(false);
        }
      } catch (error) {
        console.error(error); // Log any errors encountered during the fetch
      }
    };

    // Only fetch users if the current user is an admin
    if (currentUser.isAdmin) fetchUsers();
  }, [currentUser._id]); // Effect runs when the currentUser ID changes

  // Handle clicks on the "Show More" button to fetch additional users
  const handleShowMore = async () => {
    const startIndex = users.length; // Determine the starting index for new users
    try {
      // Fetch more users from the API
      const response = await fetch(
        `/api/user/getusers?startIndex=${startIndex}&limit=10`
      );
      const data = await response.json();
      if (response.ok) {
        setUsers((prev) => [...prev, ...data.users]); // Append new users to the existing list
        // Hide the "Show More" button if fewer than 10 new users are returned
        if (data.users.length < 10) setShowMore(false);
      }
    } catch (error) {
      console.error(error); // Log any errors encountered during the fetch
    }
  };

  // Function to handle deleting a user (implementation to be defined)
  const handleDeleteUser = async () => {
    try {
      const res = await fetch(`/api/user/delete/${userIdToDelete}`, {
        method: "DELETE" // Send a DELETE request to the API
      });
      const data = await res.json(); // Parse the response as JSON
      if (res.ok) {
        // Handle the response if the request was successful
        setUsers((prev) => prev.filter((user) => user._id !== userIdToDelete)); // Remove the deleted user from the list
        setShowModal(false); // Close the confirmation modal
      } else {
        console.error(data.message); // Log any errors encountered during the fetch
      }
    } catch (error) {
      console.error(error); // Log any errors encountered during the fetch
    }
  };

  return (
    <div className="table-auto w-full overflow-x-auto sm:overflow-x-scroll md:overflow-x-scroll md:mx-auto p-3 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500">
      {/* Check if the current user is an admin and if there are users to display */}
      {currentUser.isAdmin && users.length > 0 ? (
        <>
          {/* Render the users in a table format */}
          <Table hoverable className="shadow-md">
            <Table.Head>
              {/* Table headers for each column */}
              <Table.HeadCell>Date created</Table.HeadCell>
              <Table.HeadCell>User image</Table.HeadCell>
              <Table.HeadCell>Username</Table.HeadCell>
              <Table.HeadCell>Email</Table.HeadCell>
              <Table.HeadCell>Admin</Table.HeadCell>
              <Table.HeadCell>Delete</Table.HeadCell>
            </Table.Head>
            {/* Map through the users to render each one in a table row */}
            {users.map((user) => (
              <Table.Body className="divide-y" key={user._id}>
                <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                  <Table.Cell>
                    {/* Format the createdAt date to a locale string */}
                    {new Date(user.createdAt).toLocaleDateString()}
                  </Table.Cell>
                  <Table.Cell>
                    <img
                      src={user.profilePicture} // User's profile picture URL
                      alt={user.username} // Alt text for better accessibility
                      className="w-10 h-10 object-cover rounded-full bg-gray-500"
                    />
                  </Table.Cell>
                  <Table.Cell>{user.username}</Table.Cell>
                  <Table.Cell>{user.email}</Table.Cell>
                  <Table.Cell>
                    {/* Display icon based on whether user is an admin */}
                    {user.isAdmin ? (
                      <FaCheck className="text-green-500" />
                    ) : (
                      <FaTimes className="text-red-500" />
                    )}
                  </Table.Cell>
                  <Table.Cell>
                    {/* Delete action that triggers modal for confirmation */}
                    <span
                      onClick={() => {
                        setShowModal(true); // Show the confirmation modal
                        setUserIdToDelete(user._id); // Set the ID of the user to be deleted
                      }}
                      className="font-medium text-red-500 hover:underline cursor-pointer"
                    >
                      Delete
                    </span>
                  </Table.Cell>
                </Table.Row>
              </Table.Body>
            ))}
          </Table>
          {/* "Show More" button to load additional users */}
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
        // Message for the case when there are no users
        <p>There are no users yet!</p>
      )}
      {/* Modal for user deletion confirmation */}
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
              Are you sure you want to delete this user?
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

export default DashUsers; // Export the DashUsers component
