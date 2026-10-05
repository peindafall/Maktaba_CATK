import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './styles/globals.css';
import './styles/components.css';

// Appliquer le thème AVANT le rendu React
try {
  const stored = localStorage.getItem('catk-ui-storage');
  // Si l'utilisateur a déjà choisi → on respecte son choix
  // Sinon (nouveau visiteur) → mode sombre par défaut
  const isDark = stored ? JSON.parse(stored)?.state?.isDarkMode ?? true : true;

  if (isDark) {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
} catch {
  // En cas d'erreur, on applique le mode sombre par défaut
  document.documentElement.classList.add('dark');
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);