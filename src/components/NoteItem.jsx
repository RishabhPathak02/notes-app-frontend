import { useState, useEffect } from "react";
import styles from "./NoteItem.module.css";
import { FaPencilAlt } from 'react-icons/fa'; // Font Awesome pencil
import { FaTrash } from "react-icons/fa";


export default function NoteItem({ note, onUpdate, onDelete }) {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(note.title);
  const [content, setContent] = useState(note.content);

  useEffect(() => {
    setTitle(note.title);
    setContent(note.content);
  }, [note]);

  const handleSave = () => {
    onUpdate(note.id, { title, content });
    setIsEditing(false);
  };

  return (
    <div className={styles.noteCard}>
      {isEditing ? (
        <>
          <input
            className={styles.input}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <textarea
            className={styles.textarea}
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
          <div className={styles.buttonGroup}>
            <button className={styles.saveBtn} onClick={handleSave}>Save</button>
            <button className={styles.cancelBtn} onClick={() => setIsEditing(false)}>Cancel</button>
          </div>
        </>
      ) : (
        <>
          <h3 className={styles.title}>{title}</h3>
          <p className={styles.content}>{content}</p>
          <div className={styles.buttonGroup}>
            <button className={styles.editBtn} onClick={() => setIsEditing(true)}>
              <FaPencilAlt size={15} /></button>
            <button className={styles.deleteBtn} onClick={() => onDelete(note.id)}><FaTrash size={16} /> </button>
          </div>
        </>
      )}
    </div>
  );
}
