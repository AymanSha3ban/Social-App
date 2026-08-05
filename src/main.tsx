import '@fortawesome/fontawesome-free/css/all.min.css' 
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import AuthProvider from './context/AuthProvider.tsx'
import DarkModeProvider from './context/DarkModeProvider.tsx'
import { QueryClient , QueryClientProvider } from '@tanstack/react-query'

const Client = new QueryClient();

createRoot(document.getElementById('root')!).render(
  <QueryClientProvider client={Client}>
    <DarkModeProvider>
      <AuthProvider>
        <App />
      </AuthProvider>
    </DarkModeProvider>
  </QueryClientProvider>
  
)
