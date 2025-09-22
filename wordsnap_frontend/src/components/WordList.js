import React from "react";
import { useWordSnap } from "../context/WordSnapContext";

/**
 * PUBLIC_INTERFACE
 * WordList displays filtered words, search input, and row actions.
 */
export default function WordList() {
  const {
    filteredWords, search, setSearch, setSelectedWordId,
    toggleFavorite, removeWord, setModal
  } = useWordSnap();

  return (
    <section className="panel wordlist" aria-label="Word list">
      <div className="panel-header">
        <h3 className="panel-title">Words</h3>
        <div style={{ color: "var(--muted)", fontSize: 12 }}>
          {filteredWords.length} items
        </div>
      </div>
      <div className="toolbar">
        <div className="search">
          <span className="icon">🔎</span>
          <input
            aria-label="Search words"
            placeholder="Search by term, definition, or tag..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <button className="btn" onClick={() => setModal({ type: "addWord" })}>+ Add</button>
      </div>
      <div className="wordlist-content">
        {filteredWords.length === 0 && (
          <div className="empty">No words found. Try a different search or add new ones.</div>
        )}
        {filteredWords.map(w => (
          <div className="word-row" key={w.id}>
            <div className="word-term">{w.term}</div>
            <div className="word-def" title={w.definition}>{w.definition}</div>
            <div className="word-added">{new Date(w.addedAt).toLocaleDateString()}</div>
            <div className="word-actions">
              <button className="btn btn-ghost" onClick={() => setSelectedWordId(w.id)}>View</button>
              <button className="btn btn-ghost" onClick={() => toggleFavorite(w.id)}>{w.favorite ? "⭐" : "☆"}</button>
              <button className="btn btn-ghost" onClick={() => setModal({ type: "editWord", payload: w })}>Edit</button>
              <button className="btn btn-ghost" onClick={() => removeWord(w.id)}>Del</button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
