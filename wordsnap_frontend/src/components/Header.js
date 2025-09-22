import React from "react";
import { useWordSnap } from "../context/WordSnapContext";

/**
 * PUBLIC_INTERFACE
 * Header renders the brand and global actions (Add Word, Add Collection).
 */
export default function Header() {
  const { setModal } = useWordSnap();

  return (
    <header className="app-header">
      <div className="brand">
        <div className="brand-mark" aria-hidden="true" />
        <div>
          <div className="brand-title">WordSnap</div>
          <div style={{ color: "var(--muted)", fontSize: 12, fontWeight: 500 }}>
            Vocabulary Manager
          </div>
        </div>
      </div>
      <div className="nav-actions">
        <button
          className="btn"
          onClick={() => setModal({ type: "addCollection" })}
          aria-label="Add collection"
        >
          ➕ New Collection
        </button>
        <button
          className="btn btn-amber"
          onClick={() => setModal({ type: "addWord" })}
          aria-label="Add word"
        >
          ✨ Add Word
        </button>
      </div>
    </header>
  );
}
