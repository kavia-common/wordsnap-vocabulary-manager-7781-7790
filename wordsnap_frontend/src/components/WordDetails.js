import React from "react";
import { useWordSnap } from "../context/WordSnapContext";

/**
 * PUBLIC_INTERFACE
 * WordDetails displays the detail view for the selected word.
 */
export default function WordDetails() {
  const { selectedWord, setModal } = useWordSnap();

  return (
    <aside className="panel details" aria-label="Word details">
      <div className="panel-header">
        <h3 className="panel-title">Details</h3>
        {selectedWord && (
          <div style={{ display: "flex", gap: 8 }}>
            <button className="btn" onClick={() => setModal({ type: "editWord", payload: selectedWord })}>Edit</button>
          </div>
        )}
      </div>
      <div className="details-body">
        {!selectedWord && (
          <div className="empty">
            Select a word from the list to view details.
          </div>
        )}
        {selectedWord && (
          <>
            <div className="detail-card">
              <h2 className="detail-title">
                {selectedWord.term} {selectedWord.favorite ? "⭐" : ""}
              </h2>
              <p className="detail-subtitle">
                Added on {new Date(selectedWord.addedAt).toLocaleDateString()}
              </p>
              <div style={{ lineHeight: 1.6 }}>
                <strong>Definition:</strong> {selectedWord.definition}
              </div>
            </div>

            {selectedWord.notes && (
              <div className="detail-card">
                <h4 style={{ marginTop: 0, marginBottom: 8 }}>Notes</h4>
                <div style={{ whiteSpace: "pre-wrap" }}>{selectedWord.notes}</div>
              </div>
            )}

            <div className="detail-card">
              <h4 style={{ marginTop: 0, marginBottom: 8 }}>Tags</h4>
              <div className="chips">
                {(selectedWord.tags?.length ? selectedWord.tags : ["untagged"]).map((t, idx) => (
                  <span className="chip" key={idx}>{t}</span>
                ))}
              </div>
            </div>

            <div className="detail-card">
              <h4 style={{ marginTop: 0, marginBottom: 8 }}>Collections</h4>
              <div className="chips">
                {(selectedWord.collections?.length ? selectedWord.collections : ["all"]).map((c, idx) => (
                  <span className="chip" key={idx}>{c}</span>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </aside>
  );
}
