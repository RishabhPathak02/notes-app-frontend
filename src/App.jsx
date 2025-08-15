import React, { useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Notes from "./pages/Notes";

export default function App() {
  // Manage the token in state, initializing from localStorage
  const [token, setToken] = useState(localStorage.getItem("token"));

  // This function will be called by the Login component on success
  const handleLoginSuccess = (newToken) => {
    localStorage.setItem("token", newToken);
    setToken(newToken);
  };

  return (
    <Routes>
      <Route
        path="/"
        // The routing logic now depends on the 'token' state variable
        element={token ? <Notes /> : <Navigate to="/login" />}
      />
      <Route
        path="/login"
        // Pass the handler function as a prop to Login
        element={<Login onLoginSuccess={handleLoginSuccess} />}
      />
      <Route path="/register" element={<Register />} />
    </Routes>
  );
}