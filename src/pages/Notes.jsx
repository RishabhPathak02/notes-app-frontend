import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import NoteForm from "../components/NoteForm";
import NoteItem from "../components/NoteItem";
import NavBar from "../components/NavBar";
import { useNavigate } from "react-router-dom";
import styles from "./Notes.module.css";

// Create a reusable Axios instance for API calls
const apiClient = axios.create({
  baseURL: "https://notes-app-backend-1-fou7.onrender.com",
});

// Automatically add token to every request
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default function Notes() {
  const [notes, setNotes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const fetchNotes = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const res = await apiClient.get("/notes");
      setNotes(res.data);
    } catch (err) {
      console.error("Error fetching notes:", err);
      if (err.response && (err.response.status === 401 || err.response.status === 403)) {
        navigate("/login");
      } else {
        setError("Failed to fetch notes. Please try again later.");
      }
    } finally {
      setIsLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");

    if (storedToken) {
      // Token already in localStorage → fetch immediately
      fetchNotes();
    } else {
      // Wait a tick in case we just came from login and token hasn't been set yet
      const timer = setTimeout(() => {
        const retryToken = localStorage.getItem("token");
        if (retryToken) {
          fetchNotes();
        } else {
          navigate("/login");
        }
      }, 50);

      return () => clearTimeout(timer);
    }
  }, [fetchNotes, navigate]);

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
      setNotes((prev) => prev.map((n) => (n._id === id ? res.data : n)));
    } catch (err) {
      console.error("Error updating note:", err);
      setError("Failed to update the note.");
    }
  };

  const handleDelete = async (id) => {
    try {
      await apiClient.delete(`/notes/${id}`);
      setNotes((prev) => prev.filter((n) => n._id !== id));
    } catch (err) {
      console.error("Error deleting note:", err);
      setError("Failed to delete the note.");
    }
  };

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
          <div key={note._id || note.id} className={styles.noteCard}>
            <NoteItem note={note} onUpdate={handleUpdate} onDelete={handleDelete} />
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
