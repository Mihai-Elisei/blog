import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom"; // Import routing components
import Header from "./components/Header"; // Import Header component
import About from "./pages/About"; // Import About page
import Dashboard from "./pages/Dashboard"; // Import Dashboard page
import Home from "./pages/Home"; // Import Home page
import Projects from "./pages/Projects"; // Import Projects page
import SignIn from "./pages/SignIn"; // Import SignIn page
import SignUp from "./pages/SignUp"; // Import SignUp page
import Footer from "./components/Footer"; // Import Footer component
import PrivateRoute from "./components/PrivateRoute"; // Import PrivateRoute component for protected routes

function App() {
  return (
    <BrowserRouter>
      {/* Header displayed on all pages */}
      <Header />

      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Home />} /> {/* Home page */}
        <Route path="/about" element={<About />} /> {/* About page */}
        <Route path="/sign-in" element={<SignIn />} /> {/* SignIn page */}
        <Route path="/sign-up" element={<SignUp />} /> {/* SignUp page */}
        {/* Private route for authenticated users */}
        <Route element={<PrivateRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />{" "}
          {/* Protected Dashboard page */}
        </Route>
        {/* Projects page is public */}
        <Route path="/projects" element={<Projects />} /> {/* Projects page */}
      </Routes>

      {/* Footer displayed on all pages */}
      <Footer />
    </BrowserRouter>
  );
}

export default App;
