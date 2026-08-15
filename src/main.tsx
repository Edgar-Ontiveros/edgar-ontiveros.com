import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@fontsource-variable/space-grotesk'
import '@fontsource-variable/inter'
// Cara itálica real de Inter (la intro de Experiencia usa cursiva; sin esto
// el navegador sintetiza una oblicua). Solo se descarga el subset usado.
import '@fontsource-variable/inter/wght-italic.css'
import '@fontsource-variable/jetbrains-mono'
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
