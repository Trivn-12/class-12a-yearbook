import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { DataManager } from '../utils/dataManager'
import SignatureCloud3D from '../components/SignatureCloud3D'

const Gallery3DPage = () => {
  const [signatures, setSignatures] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [viewMode, setViewMode] = useState('sphere')
  const [selectedSignature, setSelectedSignature] = useState(null)
  const [message, setMessage] = useState('')

  useEffect(() => {
    loadSignatures()
  }, [])

  const loadSignatures = async () => {
    try {
      const data = await DataManager.loadData()
      setSignatures(data.signatures || [])
    } catch (error) {
      console.error('Lỗi khi tải chữ ký:', error)
      setMessage('❌ Không thể tải danh sách chữ ký')
    } finally {
      setLoading(false)
    }
  }

  const handleSignatureSelect = (signature) => {
    setSelectedSignature(signature)
  }

  const filteredSignatures = signatures.filter(sig => 
    sig.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4 animate-spin">🌐</div>
          <div className="text-white text-xl">Loading 3D Gallery...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 bg-purple-500/10 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute top-40 right-20 w-24 h-24 bg-blue-500/10 rounded-full blur-lg animate-bounce"></div>
        <div className="absolute bottom-32 left-1/4 w-40 h-40 bg-indigo-500/5 rounded-full blur-2xl animate-pulse delay-1000"></div>
        
        {/* Floating particles */}
        <div className="absolute top-1/4 left-1/3 text-white/10 text-2xl animate-bounce delay-500">✨</div>
        <div className="absolute top-1/3 right-1/4 text-white/10 text-3xl animate-bounce delay-1000">🌟</div>
        <div className="absolute bottom-1/3 left-1/5 text-white/10 text-2xl animate-bounce delay-1500">💫</div>
      </div>

      {/* Header */}
      <div className="relative z-10 pt-8 pb-4">
        <div className="container mx-auto px-4">
          <div className="text-center mb-6">
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-4" 
                style={{ fontFamily: 'serif', textShadow: '0 0 30px rgba(255,255,255,0.5)' }}>
              12A
            </h1>
            <p className="text-white/80 text-lg mb-2">3D Signature Galaxy</p>
            <p className="text-purple-300/70 text-sm">
              Explore {signatures.length} signatures in an immersive 3D space
            </p>
          </div>

          {/* Navigation */}
          <nav className="glass rounded-2xl p-4 mb-6">
            <div className="flex flex-wrap justify-center gap-3">
              <Link
                to="/"
                className="px-4 py-2 rounded-xl font-medium text-white hover:bg-white/20 transition-all duration-300 hover:scale-105"
              >
                🏠 Home
              </Link>
              <Link
                to="/signature-form"
                className="px-4 py-2 rounded-xl font-medium text-white hover:bg-white/20 transition-all duration-300 hover:scale-105"
              >
                ✍️ Sign
              </Link>
              <Link
                to="/gallery"
                className="px-4 py-2 rounded-xl font-medium text-white hover:bg-white/20 transition-all duration-300 hover:scale-105"
              >
                📋 2D Gallery
              </Link>
              <div className="px-4 py-2 rounded-xl font-medium bg-purple-600 text-white shadow-lg">
                🌐 3D Gallery
              </div>
              <Link
                to="/history"
                className="px-4 py-2 rounded-xl font-medium text-white hover:bg-white/20 transition-all duration-300 hover:scale-105"
              >
                📜 History
              </Link>
            </div>
          </nav>

          {/* Search Bar */}
          <div className="max-w-md mx-auto mb-6">
            <div className="relative">
              <input
                type="text"
                placeholder="Search signatures..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-3 pl-12 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
              />
              <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/60">
                🔍
              </div>
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white/60 hover:text-white transition-colors"
                >
                  ✕
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Message */}
      {message && (
        <div className="relative z-10 container mx-auto px-4 mb-4">
          <div className="max-w-2xl mx-auto">
            <div className="glass rounded-xl p-4 text-center border border-red-400/30">
              <p className="text-white font-medium">{message}</p>
            </div>
          </div>
        </div>
      )}

      {/* Main 3D Gallery */}
      <div className="relative z-10 flex-1">
        <div className="container mx-auto px-4 h-full">
          {signatures.length === 0 ? (
            <div className="glass rounded-2xl p-12 text-center">
              <div className="text-6xl mb-4">🌌</div>
              <h3 className="text-2xl font-bold text-white mb-4">Empty Galaxy</h3>
              <p className="text-purple-300 text-lg mb-6">
                No signatures have been approved yet!
              </p>
              <Link
                to="/signature-form"
                className="inline-block px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold rounded-2xl hover:from-purple-600 hover:to-pink-600 transition-all duration-300 transform hover:scale-105 shadow-2xl"
              >
                Be the first to sign! ✨
              </Link>
            </div>
          ) : (
            <div className="glass rounded-2xl overflow-hidden" style={{ height: '70vh' }}>
              <SignatureCloud3D
                signatures={filteredSignatures}
                onSignatureSelect={handleSignatureSelect}
                searchTerm={searchTerm}
                viewMode={viewMode}
                onViewModeChange={setViewMode}
              />
            </div>
          )}
        </div>
      </div>

      {/* Selected Signature Details */}
      {selectedSignature && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="glass rounded-2xl p-6 max-w-md w-full">
            <div className="text-center">
              <div className="text-4xl mb-4">
                {selectedSignature.type === 'student' ? '🎓' : '👨‍🏫'}
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">
                {selectedSignature.name}
              </h3>
              <p className="text-purple-300 mb-4">
                {selectedSignature.type === 'student' ? 'Student' : 'Teacher'}
              </p>
              <div className="mb-6">
                <img
                  src={DataManager.getSignatureImage(selectedSignature.id)}
                  alt={`Signature of ${selectedSignature.name}`}
                  className="max-w-full h-32 object-contain mx-auto bg-white rounded-lg"
                />
              </div>
              <button
                onClick={() => setSelectedSignature(null)}
                className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Instructions */}
      <div className="relative z-10 container mx-auto px-4 py-4">
        <div className="text-center">
          <p className="text-white/60 text-sm">
            {viewMode === 'sphere' ? (
              <>🌐 Sphere mode: Auto-rotating 3D cloud • Hover to explore</>
            ) : (
              <>📋 Grid mode: Organized 2D layout • Click to view details</>
            )}
          </p>
        </div>
      </div>
    </div>
  )
}

export default Gallery3DPage
