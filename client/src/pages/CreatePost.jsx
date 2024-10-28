import { Select, TextInput, FileInput, Button } from "flowbite-react";
import React from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

// Component to create a new post with title, category selection, image upload, and content editor
function CreatePost() {
  return (
    <div className="p-3 mx-w-3lx mx-auto min-h-screen">
      {/* Page title */}
      <h1 className="text-center text-3xl my-7 font-semibold">Create a post</h1>

      {/* Form to create a new post */}
      <form className="flex flex-col gap-4">
        {/* Row for title input and category selection */}
        <div className="flex flex-col gap-4 sm:flex-row justify-between">
          {/* Text input for the post title */}
          <TextInput
            type="text"
            label="Title"
            placeholder="Enter title"
            required
            id="title"
            className="flex-1"
          />

          {/* Select dropdown for choosing post category */}
          <Select>
            <option value="uncategorized">Select a category</option>
            <option value="javascript">JavaScript</option>
            <option value="react">React.js</option>
            <option value="nextjs">Next.js</option>
          </Select>
        </div>

        {/* Section for file upload with dotted border styling */}
        <div className="flex gap-4 items-center justify-between border-4 border-teal-500 border-dotted p-3">
          {/* File input for uploading an image */}
          <FileInput type="file" id="file" accept="image/*" />

          {/* Button to trigger image upload */}
          <Button
            type="button"
            gradientDuoTone="purpleToBlue"
            size="sm"
            outline
          >
            Upload Image
          </Button>
        </div>

        {/* Text editor for post content using ReactQuill */}
        <ReactQuill
          theme="snow"
          placeholder="Write Something"
          className="h-72 mb-12"
          required
        />

        {/* Submit button to publish the post */}
        <Button type="submit" gradientDuoTone="purpleToPink">
          Publish
        </Button>
      </form>
    </div>
  );
}

export default CreatePost;
