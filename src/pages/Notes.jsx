import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import NoteForm from "../components/NoteForm";
import NoteItem from "../components/NoteItem";
import NavBar from "../components/NavBar";
import { useNavigate } from "react-router-dom";
import styles from "./Notes.module.css";


const apiClient = axios.create({
  baseURL: "http://localhost:3000",
});

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

  // ✅ Fetch notes
  const fetchNotes = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const res = await apiClient.get("/notes");
      setNotes(res.data);
    } catch (err) {
      console.error("Error fetching notes:", err);
      if (err.response?.status === 401 || err.response?.status === 403) {
        localStorage.removeItem("token");
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
      fetchNotes();
    } else {
      navigate("/login");
    }
  }, [fetchNotes, navigate]);

  // ✅ Add note
  const handleAdd = async (note) => {
    try {
      const res = await apiClient.post("/notes", note);
      setNotes((prev) => [res.data, ...prev]);
      setError(null);
    } catch (err) {
      console.error("Error adding note:", err);
      setError("Failed to add the note.");
    }
  };

  // ✅ Update note (title/content or status)
  const handleUpdate = async (id, updatedFields) => {
    try {
      const existing = notes.find((n) => n.id === id);
      if (!existing) return;

      const payload = { ...existing, ...updatedFields }; // merge fields
      const res = await apiClient.put(`/notes/${id}`, payload);

      setNotes((prev) => prev.map((n) => (n.id === id ? res.data : n)));
      setError(null);
    } catch (err) {
      console.error("Error updating note:", err);
      setError("Failed to update the note.");
    }
  };

  // ✅ Delete note
  const handleDelete = async (id) => {
    try {
      await apiClient.delete(`/notes/${id}`);
      setNotes((prev) => prev.filter((n) => n.id !== id));
      setError(null);
    } catch (err) {
      console.error("Error deleting note:", err);
      setError("Failed to delete the note.");
    }
  };

  // ✅ Toggle complete
  const handleComplete = async (id, status) => {
    await handleUpdate(id, { status });
  };

  // ✅ Render content
  const renderContent = () => {
    if (isLoading) return <p className={styles.message}>Loading notes...</p>;
    if (error) return <p className={styles.error}>{error}</p>;
    if (notes.length === 0)
      return <p className={styles.message}>No notes yet. Add one above!</p>;

    return (
      <div className={styles.notesList}>
        {notes.map((note) => (
          <NoteItem
            key={note.id}
            note={note}
            onUpdate={handleUpdate}
            onDelete={handleDelete}
            onComplete={handleComplete}
          />
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
