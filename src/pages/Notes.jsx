import React, { useState, useEffect } from "react";
import axios from "axios";
import NoteForm from "../components/NoteForm";
import NoteItem from "../components/NoteItem";
import NavBar from "../components/NavBar";
import { useNavigate } from "react-router-dom";
import styles from "./Notes.module.css";

export default function Notes() {
  const [notes, setNotes] = useState([]);
  const navigate = useNavigate();

  // Fetch notes from backend
  const fetchNotes = async (storedToken) => {
    try {
      const res = await axios.get(
        "https://notes-app-backend-1-fou7.onrender.com/notes",
        { headers: { Authorization: `Bearer ${storedToken}` } }
      );
      setNotes(res.data);
    } catch (err) {
      console.error("Error fetching notes:", err);
      navigate("/login");
    }
  };

  // Run only once on component mount
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      fetchNotes(storedToken);
    } else {
      navigate("/login");
    }
  }, [navigate]);

  const handleAdd = async (note) => {
    const storedToken = localStorage.getItem("token");
    const res = await axios.post(
      "https://notes-app-backend-1-fou7.onrender.com/notes",
      note,
      { headers: { Authorization: `Bearer ${storedToken}` } }
    );
    setNotes((prev) => [...prev, res.data]);
  };

  const handleUpdate = async (id, updated) => {
    const storedToken = localStorage.getItem("token");
    const res = await axios.put(
      `https://notes-app-backend-1-fou7.onrender.com/notes/${id}`,
      updated,
      { headers: { Authorization: `Bearer ${storedToken}` } }
    );
    setNotes((prev) => prev.map((n) => (n.id === id ? res.data : n)));
  };

  const handleDelete = async (id) => {
    const storedToken = localStorage.getItem("token");
    await axios.delete(
      `https://notes-app-backend-1-fou7.onrender.com/notes/${id}`,
      { headers: { Authorization: `Bearer ${storedToken}` } }
    );
    setNotes((prev) => prev.filter((n) => n.id !== id));
  };

  return (
    <div>
      <NavBar islogged={true} />
      <NoteForm onSubmit={handleAdd} />
      <div className={styles.notesList}>
        {notes.map((note) => (
          <div key={note.id} className={styles.noteCard}>
            <NoteItem
              note={note}
              onUpdate={handleUpdate}
              onDelete={handleDelete}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
