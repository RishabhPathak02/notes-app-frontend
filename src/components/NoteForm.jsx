// NoteForm.jsx
import React, { useState } from "react";
import styles from './NoteForm.module.css'; // import as object
import { FaSave } from 'react-icons/fa';

export default function NoteForm({ onSubmit }) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ title, content });
    setTitle("");
    setContent("");
  };

  return (
    <form onSubmit={handleSubmit} className={styles.noteForm}>
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Title"
        required
      />
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Content"
        required
        rows="4"
      />
      <button type="submit"><FaSave size={16} /></button>
    </form>
  );
}
