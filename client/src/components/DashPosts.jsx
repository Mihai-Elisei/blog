import React, { useEffect } from "react"; // Import necessary React and Redux hooks
import { useSelector } from "react-redux"; // Import useSelector to access Redux state
import { useState } from "react"; // Import useState for local component state
import { Table } from "flowbite-react"; // Import Table component from Flowbite for UI display
import { Link } from "react-router-dom"; // Import Link for navigation

function DashPosts() {
  // Access the currentUser from Redux state
  const { currentUser } = useSelector((state) => state.user);
  const [userPosts, setUserPosts] = useState([]); // State to hold the fetched user's posts

  // Log the userPosts to the console for debugging
  console.log(userPosts);

  // Fetch posts effect
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        // Fetch the posts for the current user from the API
        const response = await fetch(
          `/api/post/getposts?userId=${currentUser._id}`
        );
        const data = await response.json(); // Parse the response to JSON

        // Check if the response is OK and set the state with the posts data
        if (response.ok) {
          setUserPosts(data.posts);
        }
      } catch (error) {
        console.error(error); // Log any errors that occur during the fetch
      }
    };

    // Only fetch posts if the current user is an admin
    if (currentUser.isAdmin) fetchPosts();
  }, [currentUser._id]); // Effect runs when currentUser._id changes

  return (
    <div className="table-auto overflow-x-scroll md:mx-auto p-3 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500">
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
            {userPosts.map((post) => (
              // Render each post in the table body
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
                        src={post.image}
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
                    {/* Placeholder for delete action — needs to be implemented */}
                    <span className="font-medium text-red-500 hover:underline cursor-pointer">
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
        </>
      ) : (
        // Message for users with no posts
        <p>You have no posts yet!</p>
      )}
    </div>
  );
}

export default DashPosts; // Export the DashPosts component
