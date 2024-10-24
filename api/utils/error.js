export const errorHandler = (statusCode, message) => {
  // Create a new instance of the Error object.
  const error = new Error();

  // Attach a custom statusCode property to the error object.
  error.statusCode = statusCode;

  // Set the error message based on the provided argument.
  error.message = message;

  // Return the error object with the custom statusCode and message.
  return error;
};
