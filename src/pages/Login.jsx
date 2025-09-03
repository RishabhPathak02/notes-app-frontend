import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import styles from "./Login.module.css";
import NavBar from "../components/NavBar";

// Accept 'onLoginSuccess' as a prop
export default function Login({ onLoginSuccess }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    if (loading) return;
    setLoading(true);

    try {
      const res = await axios.post(
        "http://localhost:3000/auth/login",
        { username, password }
      );
      
      // 1. Call the parent's function to update the token state in App.jsx
      onLoginSuccess(res.data.token);
      
      // 2. Set the username (this is fine to keep here)
      localStorage.setItem("username", username);
      
      // 3. Navigate to the home page
      navigate("/");

    } catch (err) {
      alert(err.response?.data?.error || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <NavBar islogged={false} />
      <div className={styles.loginContainer}>
        <h2>Login</h2>
        <form onSubmit={handleLogin}>
          <input
            className={styles.inputField}
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Username"
            required
          />
          <input
            type="password"
            className={styles.inputField}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            required
          />
          <button
            type="submit"
            className={styles.loginButton}
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
        <p className={styles.registerText}>
          New user? <Link to="/register">Register</Link>
        </p>
      </div>
    </>
  );
}