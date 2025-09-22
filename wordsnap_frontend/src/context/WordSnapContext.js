import React, { createContext, useContext, useMemo, useState } from "react";

/**
 * PUBLIC_INTERFACE
 * WordSnapContext provides global state for collections, words, selection, and modals.
 */
const WordSnapContext = createContext(null);

// Seed demo data
const seedCollections = [
  { id: "all", name: "All Words", emoji: "📚" },
  { id: "fav", name: "Favorites", emoji: "⭐" },
  { id: "tech", name: "Tech Terms", emoji: "💻" },
  { id: "literature", name: "Literature", emoji: "🖋️" }
];

const seedWords = [
  { id: "w1", term: "Eloquent", definition: "Fluent or persuasive in speaking or writing.", notes: "Often used to describe speech.", tags: ["communication"], collections: ["literature"], favorite: true, addedAt: Date.now() - 86400000 * 1 },
  { id: "w2", term: "Idempotent", definition: "Operation that has no additional effect if applied more than once.", notes: "Common in APIs and functional programming.", tags: ["math","programming"], collections: ["tech"], favorite: false, addedAt: Date.now() - 86400000 * 2 },
  { id: "w3", term: "Ubiquitous", definition: "Present, appearing, or found everywhere.", notes: "", tags: ["general"], collections: ["all"], favorite: false, addedAt: Date.now() - 86400000 * 3 },
  { id: "w4", term: "Paradigm", definition: "A typical example or pattern of something; a model.", notes: "Paradigm shift.", tags: ["general"], collections: ["literature","tech"], favorite: true, addedAt: Date.now() - 86400000 * 5 },
];

function computeCounts(words) {
  const counts = {};
  for (const w of words) {
    for (const c of w.collections) {
      counts[c] = (counts[c] || 0) + 1;
    }
    // Also count "all"
    counts["all"] = (counts["all"] || 0) + 1;
    if (w.favorite) counts["fav"] = (counts["fav"] || 0) + 1;
  }
  return counts;
}

// PUBLIC_INTERFACE
export function WordSnapProvider({ children }) {
  /** Provides app state with CRUD and filtering helpers. */
  const [collections, setCollections] = useState(seedCollections);
  const [words, setWords] = useState(seedWords);
  const [activeCollection, setActiveCollection] = useState("all");
  const [search, setSearch] = useState("");
  const [selectedWordId, setSelectedWordId] = useState(null);
  const [modal, setModal] = useState(null); // { type: 'addWord'|'editWord'|'addCollection'|'editCollection', payload? }

  const counts = useMemo(() => computeCounts(words), [words]);

  const filteredWords = useMemo(() => {
    let list = [...words];
    if (activeCollection === "fav") {
      list = list.filter(w => w.favorite);
    } else if (activeCollection !== "all") {
      list = list.filter(w => w.collections.includes(activeCollection));
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(w =>
        w.term.toLowerCase().includes(q) ||
        w.definition.toLowerCase().includes(q) ||
        w.tags.some(t => t.toLowerCase().includes(q))
      );
    }
    return list.sort((a, b) => a.term.localeCompare(b.term));
  }, [words, activeCollection, search]);

  const selectedWord = useMemo(
    () => words.find(w => w.id === selectedWordId) || null,
    [words, selectedWordId]
  );

  // Word ops
  const addWord = (data) => {
    const id = "w" + (Math.random().toString(36).slice(2, 8));
    const word = {
      id,
      term: data.term.trim(),
      definition: data.definition.trim(),
      notes: data.notes?.trim() || "",
      tags: (data.tags || []).map(t => t.trim()).filter(Boolean),
      collections: (data.collections || ["all"]),
      favorite: !!data.favorite,
      addedAt: Date.now()
    };
    setWords(prev => [...prev, word]);
    setSelectedWordId(id);
  };

  const updateWord = (id, patch) => {
    setWords(prev => prev.map(w => w.id === id ? { ...w, ...patch } : w));
  };

  const removeWord = (id) => {
    setWords(prev => prev.filter(w => w.id !== id));
    if (selectedWordId === id) setSelectedWordId(null);
  };

  const toggleFavorite = (id) => {
    setWords(prev => prev.map(w => w.id === id ? { ...w, favorite: !w.favorite } : w));
  };

  // Collection ops
  const addCollection = (data) => {
    const id = data.id?.trim() || data.name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
    if (!id) return;
    if (collections.some(c => c.id === id)) return;
    setCollections(prev => [...prev, { id, name: data.name.trim(), emoji: data.emoji || "📁" }]);
  };

  const updateCollection = (id, patch) => {
    setCollections(prev => prev.map(c => c.id === id ? { ...c, ...patch } : c));
  };

  const removeCollection = (id) => {
    if (["all","fav"].includes(id)) return;
    setCollections(prev => prev.filter(c => c.id !== id));
    setWords(prev => prev.map(w => ({ ...w, collections: w.collections.filter(cid => cid !== id) })));
    if (activeCollection === id) setActiveCollection("all");
  };

  const value = {
    collections, counts, words, filteredWords,
    activeCollection, setActiveCollection,
    search, setSearch,
    selectedWord, setSelectedWordId,
    modal, setModal,
    addWord, updateWord, removeWord, toggleFavorite,
    addCollection, updateCollection, removeCollection
  };

  return <WordSnapContext.Provider value={value}>{children}</WordSnapContext.Provider>;
}

// PUBLIC_INTERFACE
export function useWordSnap() {
  /** Access the WordSnap global state and actions. */
  const ctx = useContext(WordSnapContext);
  if (!ctx) throw new Error("useWordSnap must be used within WordSnapProvider");
  return ctx;
}
