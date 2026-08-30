import '@fortawesome/fontawesome-free/css/all.min.css' 
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { QueryClient , QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

const Client = new QueryClient();

createRoot(document.getElementById('root')!).render(
  <QueryClientProvider client={Client}>
    <ReactQueryDevtools/>
        <App />
  </QueryClientProvider>
  
)
