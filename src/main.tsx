import '@fortawesome/fontawesome-free/css/all.min.css' 
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import AuthProvider from './context/AuthProvider.tsx'
import DarkModeProvider from './context/DarkModeProvider.tsx'


createRoot(document.getElementById('root')!).render(
  <DarkModeProvider>
    <AuthProvider>
    <App />
    </AuthProvider>
  </DarkModeProvider>
  
)
