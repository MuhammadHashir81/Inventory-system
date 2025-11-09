import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import AdminAuthProvider from './Components/Context/AdminAuthProvider.jsx'
import AdminProductsProvider from './Components/Context/AdminProductsProvider.jsx'
import SupplierAuthProvider from './Components/Context/SupplierAuthProvider.jsx'
import DebtsProvider from './Components/Context/DebtsProvider.jsx'
import SoldItemsProvider from './Components/Context/SoldItemsProvider.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AdminProductsProvider>
    <AdminAuthProvider>
      <SupplierAuthProvider>
          <SoldItemsProvider>
        <DebtsProvider>

    <App />

        </DebtsProvider>
          </SoldItemsProvider>
      </SupplierAuthProvider>
    </AdminAuthProvider>
    </AdminProductsProvider>
  </StrictMode>,
)
