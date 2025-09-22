import React, { useEffect, useMemo, useState } from "react";
import { useWordSnap } from "../context/WordSnapContext";

/**
 * PUBLIC_INTERFACE
 * ModalRoot renders active modal content based on global modal state.
 */
export default function ModalRoot() {
  const { modal, setModal } = useWordSnap();

  if (!modal) return null;

  const dismiss = () => setModal(null);

  let content = null;
  switch (modal.type) {
    case "addWord":
      content = <WordForm onClose={dismiss} />;
      break;
    case "editWord":
      content = <WordForm onClose={dismiss} word={modal.payload} />;
      break;
    case "addCollection":
      content = <CollectionForm onClose={dismiss} />;
      break;
    case "editCollection":
      content = <CollectionForm onClose={dismiss} collection={modal.payload} />;
      break;
    default:
      return null;
  }

  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true">
      <div className="modal">
        {content}
      </div>
    </div>
  );
}

// Word form modal
function WordForm({ word, onClose }) {
  const isEdit = !!word;
  const {
    addWord, updateWord,
    collections
  } = useWordSnap();

  const collectionOptions = useMemo(
    () => collections.filter(c => !["all","fav"].includes(c.id)),
    [collections]
  );

  const [form, setForm] = useState({
    term: word?.term || "",
    definition: word?.definition || "",
    notes: word?.notes || "",
    tags: (word?.tags || []).join(", "),
    collections: word?.collections?.filter(c => !["all","fav"].includes(c)) || [],
    favorite: !!word?.favorite
  });

  useEffect(() => {
    const onEsc = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onEsc);
    return () => window.removeEventListener("keydown", onEsc);
  }, [onClose]);

  const submit = (e) => {
    e.preventDefault();
    const payload = {
      term: form.term,
      definition: form.definition,
      notes: form.notes,
      tags: form.tags.split(",").map(t => t.trim()).filter(Boolean),
      collections: form.collections.length ? form.collections : ["all"],
      favorite: form.favorite
    };
    if (isEdit) {
      updateWord(word.id, payload);
    } else {
      addWord(payload);
    }
    onClose();
  };

  const disabled = !form.term.trim() || !form.definition.trim();

  return (
    <>
      <div className="modal-header">
        <h3 className="panel-title" style={{ margin: 0 }}>{isEdit ? "Edit Word" : "Add Word"}</h3>
        <button className="btn btn-ghost" onClick={onClose} aria-label="Close modal">Close</button>
      </div>
      <form className="modal-body" onSubmit={submit}>
        <div className="field">
          <label className="label">Term</label>
          <input className="input" value={form.term} onChange={e => setForm(f => ({ ...f, term: e.target.value }))} autoFocus />
        </div>
        <div className="field">
          <label className="label">Definition</label>
          <textarea className="textarea" value={form.definition} onChange={e => setForm(f => ({ ...f, definition: e.target.value }))} />
        </div>
        <div className="field">
          <label className="label">Notes</label>
          <textarea className="textarea" value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} />
        </div>
        <div className="field">
          <label className="label">Tags (comma separated)</label>
          <input className="input" value={form.tags} onChange={e => setForm(f => ({ ...f, tags: e.target.value }))} />
        </div>
        <div className="field">
          <label className="label">Collections</label>
          <select
            multiple
            className="select"
            value={form.collections}
            onChange={(e) => {
              const opts = Array.from(e.target.selectedOptions).map(o => o.value);
              setForm(f => ({ ...f, collections: opts }));
            }}
          >
            {collectionOptions.map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
          <small style={{ color: "var(--muted)" }}>Hold Ctrl/Cmd to select multiple.</small>
        </div>
        <div className="field" style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <input
            id="fav"
            type="checkbox"
            checked={form.favorite}
            onChange={e => setForm(f => ({ ...f, favorite: e.target.checked }))}
          />
          <label htmlFor="fav" className="label" style={{ margin: 0 }}>Mark as favorite</label>
        </div>
      </form>
      <div className="modal-footer">
        <button className="btn" onClick={onClose} type="button">Cancel</button>
        <button className="btn btn-primary" disabled={disabled} onClick={submit}>{isEdit ? "Save" : "Add Word"}</button>
      </div>
    </>
  );
}

// Collection form modal
function CollectionForm({ collection, onClose }) {
  const isEdit = !!collection;
  const { addCollection, updateCollection } = useWordSnap();
  const [form, setForm] = useState({
    name: collection?.name || "",
    emoji: collection?.emoji || "📁",
    id: collection?.id || ""
  });

  useEffect(() => {
    const onEsc = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onEsc);
    return () => window.removeEventListener("keydown", onEsc);
  }, [onClose]);

  const submit = (e) => {
    e.preventDefault();
    if (!form.name.trim()) return;
    if (isEdit) {
      updateCollection(form.id, { name: form.name.trim(), emoji: form.emoji });
    } else {
      addCollection({ name: form.name.trim(), emoji: form.emoji });
    }
    onClose();
  };

  return (
    <>
      <div className="modal-header">
        <h3 className="panel-title" style={{ margin: 0 }}>{isEdit ? "Edit Collection" : "Add Collection"}</h3>
        <button className="btn btn-ghost" onClick={onClose}>Close</button>
      </div>
      <form className="modal-body" onSubmit={submit}>
        <div className="field">
          <label className="label">Name</label>
          <input className="input" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} autoFocus />
        </div>
        <div className="field">
          <label className="label">Emoji</label>
          <input className="input" value={form.emoji} onChange={e => setForm(f => ({ ...f, emoji: e.target.value }))} />
        </div>
        {isEdit && (
          <div className="field">
            <label className="label">ID</label>
            <input className="input" value={form.id} disabled />
            <small style={{ color: "var(--muted)" }}>Collection IDs cannot be changed.</small>
          </div>
        )}
      </form>
      <div className="modal-footer">
        <button className="btn" onClick={onClose} type="button">Cancel</button>
        <button className="btn btn-primary" onClick={submit}>{isEdit ? "Save" : "Add Collection"}</button>
      </div>
    </>
  );
}
