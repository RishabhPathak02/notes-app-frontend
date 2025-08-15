import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import styles from "./Register.module.css";
import NavBar from "../components/NavBar";

export default function Register() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem("token")) {
      navigate("/");
    }
  }, [navigate]);

  const handleRegister = async (e) => {
    e.preventDefault();
    if (loading) return;

    setLoading(true);
    try {
      await axios.post(
        "https://notes-app-backend-1-fou7.onrender.com/auth/register",
        { username, password }
      );
      alert("Registration successful! Please log in.");
      navigate("/login");
    } catch (err) {
      alert(err.response?.data?.error || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <NavBar islogged={false} />
      <div className={styles.registerContainer}>
        <h2>Register</h2>
        <form onSubmit={handleRegister}>
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
            className={styles.registerButton}
            disabled={loading}
          >
            {loading ? "Registering..." : "Register"}
          </button>
        </form>
        <p className={styles.loginText}>
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </div>
    </>
  );
}
