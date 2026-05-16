import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import Dashboard from './components/Dashboard'
import Inventory from './components/Inventory'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/inventory" element={<Inventory />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
