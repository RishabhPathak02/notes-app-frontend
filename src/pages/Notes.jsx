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
  const token = localStorage.getItem("token");

  const fetchNotes = async () => {
    try {
      const res = await axios.get(
        "https://notes-app-backend-1-fou7.onrender.com/notes",
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setNotes(res.data);
      console.log("Response from backend:", res.data);
    } catch (err) {
      console.error(err);
      navigate("/login");
    }
  };

  useEffect(() => {
    if (token) {
      fetchNotes();
    } else {
      navigate("/login");
    }
  }, [token]); 

  const handleAdd = async (note) => {
    const res = await axios.post(
      "https://notes-app-backend-1-fou7.onrender.com/notes",
      note,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    setNotes((prev) => [...prev, res.data]); 
  };

  const handleUpdate = async (id, updated) => {
    const res = await axios.put(
      `https://notes-app-backend-1-fou7.onrender.com/notes/${id}`,
      updated,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    setNotes((prev) => prev.map((n) => (n.id === id ? res.data : n)));
  };

  const handleDelete = async (id) => {
    await axios.delete(
      `https://notes-app-backend-1-fou7.onrender.com/notes/${id}`,
      { headers: { Authorization: `Bearer ${token}` } }
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
