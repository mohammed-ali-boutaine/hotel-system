import { StrictMode } from 'react'
import { ToastContainer } from "react-toastify";

import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import 'leaflet/dist/leaflet.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
    <ToastContainer position="top-right" autoClose={1500} />

  </StrictMode>,
)
