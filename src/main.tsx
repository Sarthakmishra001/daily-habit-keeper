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

createRoot(document.getElementById("root")!).render(<App />);
