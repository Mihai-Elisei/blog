import React from "react";
import { useSelector } from "react-redux"; // Import useSelector to access Redux state.
import { Outlet, Navigate } from "react-router-dom"; // Import Outlet for nested routes and Navigate for redirection.

export default function OnlyAdminPrivateRoute() {
  // Access the current user from Redux state to check authentication status.
  const { currentUser } = useSelector((state) => state.user);

  // If a user is admin, render the nested route components via <Outlet />.
  // Otherwise, redirect to the sign-in page.
  return currentUser && currentUser.isAdmin ? (
    <Outlet />
  ) : (
    <Navigate to="/sign-in" />
  );
}
