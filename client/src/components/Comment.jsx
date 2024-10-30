import React, { useEffect, useState } from "react";
import moment from "moment";

// Component to display an individual comment
function Comment({ comment }) {
  // State to store user details fetched based on comment's userId
  const [user, setUser] = useState({});

  useEffect(() => {
    // Function to fetch user details based on userId
    const getUser = async () => {
      try {
        // Make a request to fetch user data
        const res = await fetch(`/api/user/${comment.userId}`);
        const data = await res.json();
        // If the response is successful, set the user state with fetched data
        if (res.ok) {
          setUser(data);
        }
      } catch (error) {
        // Log any error encountered during fetch
        console.log(error);
      }
    };

    // Fetch user data when component mounts or comment changes
    getUser();
  }, [comment]);

  return (
    <div className="flex p-4 border-b dark:border-gray-600 text-sm">
      {/* User profile image */}
      <div className="flex-shrink-0 mr-3">
        <img
          className="w-10 h-10 rounded-full bg-gray-200"
          src={user.profilePicture} // Display user's profile picture
          alt={user.username} // Use username as alt text for accessibility
        />
      </div>
      {/* Comment content area */}
      <div className="flex-1">
        {/* Display username and timestamp */}
        <div className="flex items-center mb-1">
          <span className="font-bold mr-1 text-xs truncate">
            {/* Display username if available; otherwise, show "anonymous user" */}
            {user ? `@${user.username}` : "anonymous user"}
          </span>
          <span className="text-gray-500 text-xs">
            {/* Display relative time using moment.js for when the comment was created */}
            {moment(comment.createdAt).fromNow()}
          </span>
        </div>
        {/* Display comment content */}
        <p className="text-gray-500 mb-2">{comment.content}</p>
      </div>
    </div>
  );
}

export default Comment;
