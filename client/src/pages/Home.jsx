import { Link } from "react-router-dom"; // Import Link for routing between pages
import CallToAction from "../components/CallToAction"; // Import CallToAction component
import { useEffect, useState } from "react"; // Import React hooks for state management and side effects
import PostCard from "../components/PostCard"; // Import PostCard component for displaying individual posts

// Home component that displays the homepage content
export default function Home() {
  const [posts, setPosts] = useState([]); // State to hold the list of posts

  useEffect(() => {
    // Function to fetch posts from the backend
    const fetchPosts = async () => {
      const res = await fetch("/api/post/getPosts"); // API call to get posts
      const data = await res.json(); // Parse response data as JSON
      setPosts(data.posts); // Update the state with fetched posts
    };
    fetchPosts(); // Call the fetch function
  }, []); // Empty array means this effect runs only once after the component mounts

  return (
    <div>
      {/* Main content area */}
      <div className="flex flex-col gap-6 p-28 px-3 max-w-6xl mx-auto ">
        <h1 className="text-3xl font-bold lg:text-6xl">Welcome to my Blog</h1>{" "}
        {/* Main heading */}
        <p className="text-gray-500 text-xs sm:text-sm">
          Here you'll find a variety of articles and tutorials on topics such as
          web development, software engineering, and programming languages.
        </p>{" "}
        {/* Brief introduction */}
        {/* Link to view all posts */}
        <Link
          to="/search"
          className="text-xs sm:text-sm text-teal-500 font-bold hover:underline"
        >
          View all posts
        </Link>
      </div>

      {/* Call to Action section */}
      <div className="p-3 w-[80%] mx-auto bg-amber-100 dark:bg-slate-700">
        <CallToAction /> {/* Render the CallToAction component */}
      </div>

      {/* Section for displaying recent posts */}
      <div className="max-w-6xl mx-auto p-3 flex flex-col gap-8 py-7">
        {posts &&
          posts.length > 0 && ( // Check if posts exist and are not empty
            <div className="flex flex-col gap-6">
              <h2 className="text-2xl font-semibold text-center">
                Recent Posts
              </h2>{" "}
              {/* Subheading for recent posts */}
              <div className="flex flex-wrap gap-4">
                {posts.map((post) => (
                  <PostCard key={post._id} post={post} /> // Map through posts and render PostCard component for each
                ))}
              </div>
              {/* Link to view all posts again */}
              <Link
                to={"/search"}
                className="text-lg text-teal-500 hover:underline text-center"
              >
                View all posts
              </Link>
            </div>
          )}
      </div>
    </div>
  );
}
