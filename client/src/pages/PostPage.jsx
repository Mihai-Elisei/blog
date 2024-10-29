import React, { useEffect, useState } from "react"; // Import React and hooks
import { useParams } from "react-router-dom"; // Import useParams hook to access route parameters
import { Button, Spinner } from "flowbite-react"; // Import Button and Spinner components from Flowbite
import { Link } from "react-router-dom"; // Import Link component for navigation

function PostPage() {
  const { postSlug } = useParams(); // Extract the post slug from the URL parameters
  const [loading, setLoading] = useState(true); // State to manage loading state
  const [error, setError] = useState(false); // State to manage error state
  const [post, setPost] = useState(null); // State to store the fetched post data

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true); // Set loading state to true before fetching
        const response = await fetch(`/api/post/getposts?slug=${postSlug}`); // Fetch post data using the slug
        const data = await response.json(); // Parse the JSON response

        // Check if the response is not OK, set error state and loading state
        if (!response.ok) {
          setError(true);
          setLoading(false);
          return; // Exit function if there was an error
        }

        // If the response is OK, update the post state and loading state
        setPost(data.posts[0]); // Assuming response returns an array of posts
        setLoading(false);
        setError(false);
      } catch (error) {
        // Handle any errors that may occur during fetch
        setError(true);
        setLoading(false);
      }
    };

    fetchPost(); // Call the fetchPost function to retrieve the post data
  }, [postSlug]); // Dependency array: effect runs when postSlug changes

  // Render a Spinner component while loading
  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spinner size="xl" /> {/* Display the spinner in center */}
      </div>
    );

  return (
    <main className="p-3 flex flex-col max-w-6xl mx-auto min-h-screen">
      {/* Render post title */}
      <h1 className="text-3xl mt-10 p-3 text-center font-serif max-w-2xl mx-auto lg:text-4xl">
        {post && post.title} {/* Render title if post exists */}
      </h1>
      {/* Link to category search with category button */}
      <Link
        to={`/search?category=${post && post.category}`} // Dynamically create link based on post category
        className="self-center mt-5"
      >
        <Button color="gray" pill size="xs">
          {post && post.category} {/* Display category label */}
        </Button>
      </Link>
      {/* Render post image */}
      <img
        src={post && post.image} // Post image URL
        alt={post && post.title} // Alt text for accessibility
        className="mt-10 p-3 max-h-[600px] w-full object-cover"
      />
      {/* Render post creation date and estimated read time */}
      <div className="flex justify-between p-3 border-b border-slate-500 mx-auto w-full max-w-2xl text-xs">
        <span>{post && new Date(post.createdAt).toLocaleDateString()}</span>{" "}
        {/* Format creation date */}
        {post && post.content.length / 1000 >= 1 && (
          <span className="italic">
            {(post.content.length / 1000).toFixed(0)} mins read{" "}
            {/* Calculate estimated read time */}
          </span>
        )}
      </div>
      {/* Render post content using dangerouslySetInnerHTML for HTML content */}
      <div
        className="p-3 max-w-2xl mx-auto w-full post-content"
        dangerouslySetInnerHTML={{ __html: post && post.content }} // Render HTML content
      ></div>
    </main>
  );
}

export default PostPage; // Export the PostPage component
