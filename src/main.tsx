import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

// Initialize theme before rendering to prevent flash
const initializeTheme = () => {
  const themeStorageKey = 'habit-tracker-theme';
  const stored = localStorage.getItem(themeStorageKey);
  
  if (stored === 'light' || stored === 'dark') {
    document.documentElement.classList.add(stored);
  } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.add('light');
  }
};

// Initialize theme immediately
initializeTheme();

// Register Service Worker
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("/service_worker.js")
      .then(() => console.log("Service Worker Registered"))
      .catch(err => console.error("SW Error:", err));
  });
}

createRoot(document.getElementById("root")!).render(<App />);
