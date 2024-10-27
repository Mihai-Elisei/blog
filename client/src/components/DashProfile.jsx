import { Button, TextInput } from "flowbite-react"; // Importing necessary components from the Flowbite library
import React from "react"; // Importing React
import { useSelector } from "react-redux"; // Importing useSelector to access Redux state

function DashProfile() {
  // Accessing the current user from the Redux store
  const { currentUser } = useSelector((state) => state.user);

  return (
    <div className="max-w-lg mx-auto p-3 w-full">
      
      {/* Master container for the profile with max width and centered */}
      <h1 className="my-7 text-center font-semibold text-3xl">Profile</h1>
      {/* Header for the profile section */}
      <form className="flex flex-col gap-4">
        
        {/* Form to update profile information */}
        {/* Profile picture display */}
        <div className="w-32 h-32 self-center cursor-pointer shadow-md overflow-hidden rounded-full">
          <img
            src={currentUser.profilePicture} // Profile picture sourced from currentUser state
            alt="Profile Image" // Alt text for the image
            className="rounded-full w-full h-full object-cover border-8 border-[lightgray]" 
          />
        </div>
        {/* Input field for username */}
        <TextInput
          type="text"
          id="username"
          placeholder="username"
          defaultValue={currentUser.username}
        />
        {/* Input field for email */}
        <TextInput
          type="email"
          id="email"
          placeholder="email"
          defaultValue={currentUser.email}
        />
        {/* Input field for password (no default value for security reasons) */}
        <TextInput type="password" id="password" placeholder="password" />
        {/* Button to submit the form */}
        <Button type="submit" gradientDuoTone="purpleToBlue" outline>
          Update
        </Button>
        {/* Links for account actions */}
        <div className="text-red-500 flex justify-between mt-5">
          <span className="cursor-pointer">Delete Account</span>
          {/* Link to delete the account */}
          <span className="cursor-pointer">Sign Out</span>
          {/* Link to sign out */}
        </div>
      </form>
    </div>
  );
}

export default DashProfile; // Exporting the DashProfile component for use in other parts of the application
