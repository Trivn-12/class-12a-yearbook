import React from 'react'
import { Routes, Route } from 'react-router-dom'
import SignaturePage from './pages/SignaturePage'
import SignatureFormPage from './pages/SignatureFormPage'
import MemoryFormPage from './pages/MemoryFormPage'
import AdminPage from './pages/AdminPage'
import GalleryPage from './pages/GalleryPage'
import HistoryPage from './pages/HistoryPage'
import SleepPage from './pages/SleepPage'
import PendingPage from './pages/PendingPage'
import ThankYouPage from './pages/ThankYouPage'

function App() {
  return (
    <div className="min-h-screen">
      <Routes>
        <Route path="/" element={<SignaturePage />} />
        <Route path="/signature-form" element={<SignatureFormPage />} />
        <Route path="/memory-form" element={<MemoryFormPage />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/gallery" element={<GalleryPage />} />
        <Route path="/history" element={<HistoryPage />} />
        <Route path="/sleep" element={<SleepPage />} />
        <Route path="/pending" element={<PendingPage />} />
        <Route path="/thankyou" element={<ThankYouPage />} />
      </Routes>
    </div>
  )
}

export default App
