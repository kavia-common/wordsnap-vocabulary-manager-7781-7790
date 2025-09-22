import React from "react";
import "./theme.css";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import WordList from "./components/WordList";
import WordDetails from "./components/WordDetails";
import ModalRoot from "./components/Modals";
import { WordSnapProvider } from "./context/WordSnapContext";

/**
 * PUBLIC_INTERFACE
 * App is the root of the WordSnap UI, applying the Ocean Professional theme with:
 * - Header with navigation
 * - Main grid: Collections sidebar | Word list | Details panel
 * - Modal dialogs for add/edit actions
 */
function App() {
  return (
    <WordSnapProvider>
      <div className="app-shell">
        <Header />
        <main className="app-main">
          <Sidebar />
          <WordList />
          <WordDetails />
        </main>
        <ModalRoot />
      </div>
    </WordSnapProvider>
  );
}

export default App;
