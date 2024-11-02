import { Button, Select, TextInput } from "flowbite-react"; // Import components from Flowbite for UI elements
import { useEffect, useState } from "react"; // Import React hooks for managing state and side effects
import { useLocation, useNavigate } from "react-router-dom"; // Import hooks for handling routing location and navigation
import PostCard from "../components/PostCard"; // Import PostCard component for displaying individual posts

// Search component to handle searching and filtering posts
export default function Search() {
  // State to hold the sidebar data for filtering
  const [sidebarData, setSidebarData] = useState({
    searchTerm: "", // Search term input value
    sort: "desc", // Sort order (latest or oldest)
    category: "uncategorized" // Selected category for filtering
  });

  // State to hold posts fetched from the server
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false); // State to indicate loading status
  const [showMore, setShowMore] = useState(false); // State to determine if more posts can be displayed

  const location = useLocation(); // Get the current location (URL) object
  const navigate = useNavigate(); // Get the navigate function for programmatic navigation

  // useEffect to handle fetching posts and updating sidebar data based on URL parameters
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search); // Parse the query parameters from the URL
    const searchTermFromUrl = urlParams.get("searchTerm"); // Get searchTerm from URL params
    const sortFromUrl = urlParams.get("sort"); // Get sort from URL params
    const categoryFromUrl = urlParams.get("category"); // Get category from URL params

    // Update sidebar data if any parameter exists in the URL
    if (searchTermFromUrl || sortFromUrl || categoryFromUrl) {
      setSidebarData({
        ...sidebarData,
        searchTerm: searchTermFromUrl,
        sort: sortFromUrl,
        category: categoryFromUrl
      });
    }

    // Function to fetch posts based on the current URL parameters
    const fetchPosts = async () => {
      setLoading(true); // Indicate loading has started
      const searchQuery = urlParams.toString(); // Convert URL params to a query string
      const res = await fetch(`/api/post/getposts?${searchQuery}`); // Fetch posts from API

      // Check if the response is ok
      if (!res.ok) {
        setLoading(false); // Stop loading if there's an error
        return;
      }

      // Parse the response JSON and update the posts state
      if (res.ok) {
        const data = await res.json();
        setPosts(data.posts); // Update posts state with fetched posts
        setLoading(false); // Stop loading

        // Show "Show More" button if exactly 9 posts returned
        if (data.posts.length === 9) {
          setShowMore(true);
        } else {
          setShowMore(false);
        }
      }
    };

    fetchPosts(); // Invoke the fetch function
  }, [location.search]); // Run this effect whenever location.search changes

  // Handler for input changes on the sidebar
  const handleChange = (e) => {
    if (e.target.id === "searchTerm") {
      setSidebarData({ ...sidebarData, searchTerm: e.target.value }); // Update search term in state
    }
    if (e.target.id === "sort") {
      const order = e.target.value || "desc"; // Set the sort order, default to "desc"
      setSidebarData({ ...sidebarData, sort: order }); // Update sort in state
    }
    if (e.target.id === "category") {
      const category = e.target.value || "uncategorized"; // Set category, default to "uncategorized"
      setSidebarData({ ...sidebarData, category }); // Update category in state
    }
  };

  // Handler for form submission to apply filters
  const handleSubmit = (e) => {
    e.preventDefault(); // Prevent default form submission
    const urlParams = new URLSearchParams(location.search); // Parse the current URL parameters
    urlParams.set("searchTerm", sidebarData.searchTerm); // Update searchTerm in URL params
    urlParams.set("sort", sidebarData.sort); // Update sort in URL params
    urlParams.set("category", sidebarData.category); // Update category in URL params
    const searchQuery = urlParams.toString(); // Convert URL params to a query string
    navigate(`/search?${searchQuery}`); // Navigate to the new URL with updated query parameters
  };

  // Handler for loading more posts when "Show More" is clicked
  const handleShowMore = async () => {
    const numberOfPosts = posts.length; // Get the current number of posts
    const startIndex = numberOfPosts; // Determine start index for fetching more posts
    const urlParams = new URLSearchParams(location.search); // Get current URL params
    urlParams.set("startIndex", startIndex); // Update startIndex in URL params
    const searchQuery = urlParams.toString(); // Convert to query string
    const res = await fetch(`/api/post/getposts?${searchQuery}`); // Fetch more posts from API

    // Check if the response is ok
    if (!res.ok) {
      return; // Exit if there's an error
    }

    // Parse the response and update posts state
    if (res.ok) {
      const data = await res.json();
      setPosts([...posts, ...data.posts]); // Append new posts to existing posts
      // Show "Show More" button if exactly 10 posts returned
      if (data.posts.length === 10) {
        setShowMore(true);
      } else {
        setShowMore(false);
      }
    }
  };

  return (
    <div className="flex flex-col md:flex-row">
      {/* Sidebar for filters */}
      <div className="p-7 border-b md:border-r md:min-h-screen border-gray-500">
        <form className="flex flex-col gap-8" onSubmit={handleSubmit}>
          {/* Input for search term */}
          <div className="flex items-center gap-2">
            <label className="whitespace-nowrap font-semibold">
              Search Term:
            </label>
            <TextInput
              placeholder="Search..."
              id="searchTerm"
              type="text"
              value={sidebarData.searchTerm}
              onChange={handleChange}
            />
          </div>
          {/* Dropdown for sort order */}
          <div className="flex items-center gap-2">
            <label className="font-semibold">Sort:</label>
            <Select onChange={handleChange} value={sidebarData.sort} id="sort">
              <option value="desc">Latest</option>
              <option value="asc">Oldest</option>
            </Select>
          </div>
          {/* Dropdown for category selection */}
          <div className="flex items-center gap-2">
            <label className="font-semibold">Category:</label>
            <Select
              onChange={handleChange}
              value={sidebarData.category}
              id="category"
            >
              <option value="uncategorized">Uncategorized</option>
              <option value="reactjs">React.js</option>
              <option value="nextjs">Next.js</option>
              <option value="javascript">JavaScript</option>
            </Select>
          </div>
          {/* Button to apply filters */}
          <Button type="submit" outline gradientDuoTone="purpleToPink">
            Apply Filters
          </Button>
        </form>
      </div>

      {/* Main content area for displaying posts */}
      <div className="w-full">
        <h1 className="text-3xl font-semibold sm:border-b border-gray-500 p-3 mt-5 ">
          Posts results:
        </h1>
        <div className="p-7 flex flex-wrap gap-4">
          {/* Display message if no posts are found */}
          {!loading && posts.length === 0 && (
            <p className="text-xl text-gray-500">No posts found.</p>
          )}
          {/* Display loading message if data is being fetched */}
          {loading && <p className="text-xl text-gray-500">Loading...</p>}
          {/* Render PostCard components for each post */}
          {!loading &&
            posts &&
            posts.map((post) => <PostCard key={post._id} post={post} />)}
          {/* "Show More" button if applicable */}
          {showMore && (
            <button
              onClick={handleShowMore}
              className="text-teal-500 text-lg hover:underline p-7 w-full"
            >
              Show More
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
