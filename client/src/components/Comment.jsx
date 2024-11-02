import { Button, Textarea } from "flowbite-react"; // Import UI components from Flowbite React
import moment from "moment"; // Import moment for formatting timestamps
import { useEffect, useState } from "react"; // Import React hooks for state management and side effects
import { FaThumbsUp } from "react-icons/fa"; // Import the thumbs-up icon for the like button
import { useSelector } from "react-redux"; // Import useSelector to access the Redux store

// Comment component for displaying and managing a single comment
export default function Comment({ comment, onLike, onEdit, onDelete }) {
  const [user, setUser] = useState({}); // State to store user information
  const [isEditing, setIsEditing] = useState(false); // State to toggle edit mode
  const [editedContent, setEditedContent] = useState(comment.content); // State for storing edited comment content
  const { currentUser } = useSelector((state) => state.user); // Access current user from Redux store

  // Fetch the user information for the comment
  useEffect(() => {
    const getUser = async () => {
      try {
        const res = await fetch(`/api/user/${comment.userId}`); // Fetch the user information based on userId
        const data = await res.json(); // Parse the response as JSON
        if (res.ok) {
          setUser(data); // Set user state with the fetched user data
        }
      } catch (error) {
        console.log(error.message); // Log any errors that occur during fetch
      }
    };
    getUser(); // Call the function when the component mounts or when the comment changes
  }, [comment]); // Dependency array ensures this runs when the comment prop changes

  // Function to handle entering edit mode
  const handleEdit = () => {
    setIsEditing(true); // Enable edit mode
    setEditedContent(comment.content); // Set the current content for editing
  };

  // Function to handle saving the edited comment
  const handleSave = async () => {
    try {
      const res = await fetch(`/api/comment/editComment/${comment._id}`, {
        // Send a PUT request to update the comment
        method: "PUT",
        headers: {
          "Content-Type": "application/json" // Specify the content type as JSON
        },
        body: JSON.stringify({ content: editedContent }) // Send the edited content in the request body
      });
      if (res.ok) {
        setIsEditing(false); // Exit edit mode if save is successful
        onEdit(comment, editedContent); // Call onEdit to update the comment in the parent state
      }
    } catch (error) {
      console.log(error.message); // Log any errors that occur during save
    }
  };

  return (
    <div className="flex p-4 border-b dark:border-gray-600 text-sm">
      {/* User profile image */}
      <div className="flex-shrink-0 mr-3">
        <img
          className="w-10 h-10 rounded-full bg-gray-200"
          src={user.profilePicture} // Display the user's profile picture
          alt={user.username} // Use username as the alt text for accessibility
        />
      </div>
      {/* Comment content area */}
      <div className="flex-1">
        <div className="flex items-center mb-1">
          <span className="font-bold mr-1 text-xs truncate">
            {user ? `@${user.username}` : "anonymous user"}{" "}
            {/* Display the user's username */}
          </span>
          <span className="text-gray-500 text-xs">
            {moment(comment.createdAt).fromNow()}{" "}
            {/* Display the comment's timestamp */}
          </span>
        </div>
        {/* Conditional rendering for edit mode */}
        {isEditing ? (
          <>
            <Textarea
              className="mb-2"
              value={editedContent} // Bind editedContent to the textarea
              onChange={(e) => setEditedContent(e.target.value)} // Update state on change
            />
            <div className="flex justify-end gap-2 text-xs">
              <Button
                type="button"
                size="sm"
                gradientDuoTone="purpleToBlue"
                onClick={handleSave} // Call handleSave when the Save button is clicked
              >
                Save
              </Button>
              <Button
                type="button"
                size="sm"
                gradientDuoTone="purpleToBlue"
                outline
                onClick={() => setIsEditing(false)} // Exit edit mode when Cancel button is clicked
              >
                Cancel
              </Button>
            </div>
          </>
        ) : (
          <>
            <p className="text-gray-500 pb-2">{comment.content}</p>{" "}
            {/* Display comment content */}
            <div className="flex items-center pt-2 text-xs border-t dark:border-gray-700 max-w-fit gap-2">
              {/* Like button */}
              <button
                type="button"
                onClick={() => onLike(comment._id)} // Call onLike function with comment ID
                className={`text-gray-400 hover:text-blue-500 ${
                  currentUser &&
                  comment.likes.includes(currentUser._id) &&
                  "!text-blue-500" // Highlight button if the current user liked the comment
                }`}
              >
                <FaThumbsUp className="text-sm" />
              </button>
              {/* Display the number of likes */}
              <p className="text-gray-400">
                {comment.numberOfLikes > 0 &&
                  comment.numberOfLikes +
                    " " +
                    (comment.numberOfLikes === 1 ? "like" : "likes")}
              </p>
              {/* Conditional rendering for edit and delete buttons */}
              {currentUser &&
                (currentUser._id === comment.userId || currentUser.isAdmin) && (
                  <>
                    <button
                      type="button"
                      onClick={handleEdit} // Call handleEdit to enable edit mode
                      className="text-gray-400 hover:text-blue-500"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => onDelete(comment._id)} // Call onDelete with comment ID
                      className="text-gray-400 hover:text-red-500"
                    >
                      Delete
                    </button>
                  </>
                )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
