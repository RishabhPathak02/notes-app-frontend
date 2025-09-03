import { useState, useEffect } from "react";
import styles from "./NoteItem.module.css";
import { FaPencilAlt, FaTrash, FaCheck, FaTimes } from "react-icons/fa";

export default function NoteItem({ note, onUpdate, onDelete, onComplete }) {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(note.title);
  const [content, setContent] = useState(note.content);

  useEffect(() => {
    setTitle(note.title);
    setContent(note.content);
  }, [note]);

  const handleSave = () => {
    if (title !== note.title || content !== note.content) {
      onUpdate(note.id, { title, content, status: note.status });
    }
    setIsEditing(false);
  };

  return (
    <div
      className={`${styles.noteCard} ${
        note.status === "completed" ? styles.completed : ""
      }`}
    >
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
            <button className={styles.saveBtn} onClick={handleSave}>
              <FaCheck size={14} /> Save
            </button>
            <button
              className={styles.cancelBtn}
              onClick={() => setIsEditing(false)}
            >
              <FaTimes size={14} /> Cancel
            </button>
          </div>
        </>
      ) : (
        <>
          <h3
            className={`${styles.title} ${
              note.status === "completed" ? styles.strikethrough : ""
            }`}
          >
            {title}
          </h3>
          <p className={styles.content}>{content}</p>
          <div className={styles.buttonGroup}>
            <button
              className={styles.editBtn}
              onClick={() => setIsEditing(true)}
            >
              <FaPencilAlt size={15} /> Edit
            </button>
            <button
              className={styles.deleteBtn}
              onClick={() => onDelete(note.id)}
            >
              <FaTrash size={16} /> Delete
            </button>
            <button
              className={styles.completeBtn}
              onClick={() =>
                onComplete(
                  note.id,
                  note.status === "completed" ? "pending" : "completed"
                )
              }
            >
              {note.status === "completed" ? "Undo" : "Complete"}
            </button>
          </div>
        </>
      )}
    </div>
  );
}
