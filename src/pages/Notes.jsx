import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import NoteForm from "../components/NoteForm";
import NoteItem from "../components/NoteItem";
import NavBar from "../components/NavBar";
import { useNavigate } from "react-router-dom";
import styles from "./Notes.module.css";

// 1. Create a reusable Axios instance for API calls
// This avoids repeating the base URL and headers in every function.
const apiClient = axios.create({
  baseURL: "https://notes-app-backend-1-fou7.onrender.com",
});

// Use an interceptor to automatically add the auth token to every request
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default function Notes() {
  const [notes, setNotes] = useState([]);
  // 2. Add loading and error states for better UX
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // 3. Wrap the fetch function in useCallback
  // This memoizes the function, preventing it from being recreated on every render.
  // It's a best practice when a function is a dependency of useEffect.
  const fetchNotes = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const res = await apiClient.get("/notes");
      setNotes(res.data);
    } catch (err) {
      console.error("Error fetching notes:", err);
      // If the token is invalid or expired (often a 401 or 403 error), redirect to login
      if (err.response && (err.response.status === 401 || err.response.status === 403)) {
        navigate("/login");
      } else {
        setError("Failed to fetch notes. Please try again later.");
      }
    } finally {
      setIsLoading(false);
    }
  }, [navigate]);

  // Run only once on component mount
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      fetchNotes();
    } else {
      navigate("/login");
    }
  }, [fetchNotes, navigate]);

  // 4. Add error handling to all CUD (Create, Update, Delete) operations
  const handleAdd = async (note) => {
    try {
      const res = await apiClient.post("/notes", note);
      setNotes((prev) => [...prev, res.data]);
    } catch (err) {
      console.error("Error adding note:", err);
      setError("Failed to add the note.");
    }
  };

  const handleUpdate = async (id, updated) => {
    try {
      const res = await apiClient.put(`/notes/${id}`, updated);
      setNotes((prev) => prev.map((n) => (n._id === id ? res.data : n))); // Use _id if that's what MongoDB provides
    } catch (err) {
      console.error("Error updating note:", err);
      setError("Failed to update the note.");
    }
  };

  const handleDelete = async (id) => {
    try {
      await apiClient.delete(`/notes/${id}`);
      setNotes((prev) => prev.filter((n) => n._id !== id)); // Use _id if that's what MongoDB provides
    } catch (err) {
      console.error("Error deleting note:", err);
      setError("Failed to delete the note.");
    }
  };

  // 5. Render UI based on loading and error states
  const renderContent = () => {
    if (isLoading) {
      return <p className={styles.message}>Loading notes...</p>;
    }
    if (error) {
      return <p className={styles.error}>{error}</p>;
    }
    if (notes.length === 0) {
      return <p className={styles.message}>No notes yet. Add one above!</p>;
    }
    return (
      <div className={styles.notesList}>
        {notes.map((note) => (
          // Use note._id if your backend sends _id from MongoDB, otherwise use note.id
          <div key={note._id || note.id} className={styles.noteCard}>
            <NoteItem
              note={note}
              onUpdate={handleUpdate}
              onDelete={handleDelete}
            />
          </div>
        ))}
      </div>
    );
  };

  return (
    <div>
      <NavBar islogged={true} />
      <NoteForm onSubmit={handleAdd} />
      {renderContent()}
    </div>
  );
}