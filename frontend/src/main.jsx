import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import AdminAuthProvider from './Components/Context/AdminAuthProvider.jsx'
import AdminProductsProvider from './Components/Context/AdminProductsProvider.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AdminProductsProvider>
    <AdminAuthProvider>

    <App />
    
    </AdminAuthProvider>
    </AdminProductsProvider>
  </StrictMode>,
)
