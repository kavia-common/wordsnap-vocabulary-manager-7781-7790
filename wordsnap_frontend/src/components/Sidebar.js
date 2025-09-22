import React from "react";
import { useWordSnap } from "../context/WordSnapContext";

/**
 * PUBLIC_INTERFACE
 * Sidebar shows available collections, selection state, and entry points to edit/delete.
 */
export default function Sidebar() {
  const { collections, counts, activeCollection, setActiveCollection, setModal, removeCollection } = useWordSnap();

  return (
    <aside className="panel collections" aria-label="Collections sidebar">
      <div className="panel-header">
        <h3 className="panel-title">Collections</h3>
        <div style={{ display: "flex", gap: 8 }}>
          <button className="btn btn-ghost" onClick={() => setActiveCollection("all")}>All</button>
          <button className="btn btn-ghost" onClick={() => setActiveCollection("fav")}>⭐</button>
        </div>
      </div>
      <div className="collections-list">
        {collections.map(c => {
          const active = activeCollection === c.id;
          const badge = counts[c.id] ?? (c.id === "all" ? counts["all"] || 0 : 0);
          return (
            <div
              key={c.id}
              className={`collection-item ${active ? "active" : ""}`}
              onClick={() => setActiveCollection(c.id)}
              role="button"
              tabIndex={0}
              onKeyDown={e => e.key === "Enter" && setActiveCollection(c.id)}
            >
              <div className="collection-icon" aria-hidden="true">
                {c.emoji || "📁"}
              </div>
              <div className="collection-name">{c.name}</div>
              <div className="collection-count">{badge}</div>
              {!["all", "fav"].includes(c.id) && (
                <div className="word-actions" onClick={e => e.stopPropagation()}>
                  <button className="btn btn-ghost" onClick={() => setModal({ type: "editCollection", payload: c })}>Edit</button>
                  <button className="btn btn-ghost" onClick={() => removeCollection(c.id)}>Delete</button>
                </div>
              )}
            </div>
          );
        })}
        {collections.length === 0 && <div className="empty">No collections yet.</div>}
      </div>
    </aside>
  );
}
