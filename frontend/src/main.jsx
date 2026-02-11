import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import AdminAuthProvider from './Components/Context/AdminAuthProvider.jsx'
import SupplierAuthProvider from './Components/Context/SupplierAuthProvider.jsx'
import { BrowserRouter } from 'react-router-dom'

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
      <AdminAuthProvider>
        <SupplierAuthProvider>
              <App />
        </SupplierAuthProvider>
      </AdminAuthProvider>
  </BrowserRouter>
)


{/* mongodb password: 4iiOrna7DIbMVb2F */ }