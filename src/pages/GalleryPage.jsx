import React, { useState, useEffect, useRef } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { DataManager } from '../utils/dataManager'

const GalleryPage = () => {
  const [signatures, setSignatures] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchParams] = useSearchParams()
  const [draggedSignature, setDraggedSignature] = useState(null)
  const [message, setMessage] = useState('')
  const [zoomLevel, setZoomLevel] = useState(1)
  const [touchedSignature, setTouchedSignature] = useState(null)
  const canvasRef = useRef(null)

  // Kiểm tra xem có phải admin không (từ URL parameter)
  const isAdmin = searchParams.get('admin') === 'true'

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

  const getSignatureImage = (signatureId) => {
    return DataManager.getSignatureImage(signatureId)
  }

  // Zoom functions
  const handleZoomIn = () => {
    setZoomLevel(prev => Math.min(prev + 0.2, 3)) // Max zoom 3x
  }

  const handleZoomOut = () => {
    setZoomLevel(prev => Math.max(prev - 0.2, 0.5)) // Min zoom 0.5x
  }

  const handleResetZoom = () => {
    setZoomLevel(1)
  }

  // Wheel zoom
  const handleWheel = (e) => {
    if (e.ctrlKey) {
      e.preventDefault()
      const delta = e.deltaY > 0 ? -0.1 : 0.1
      setZoomLevel(prev => Math.max(0.5, Math.min(3, prev + delta)))
    }
  }

  // Drag & Drop handlers cho canvas tự do
  const handleMouseDown = (e, signature) => {
    if (!isAdmin) return

    const rect = canvasRef.current.getBoundingClientRect()
    const offsetX = (e.clientX - rect.left) / zoomLevel - (signature.position?.x || 0)
    const offsetY = (e.clientY - rect.top) / zoomLevel - (signature.position?.y || 0)

    setDraggedSignature({ ...signature, offsetX, offsetY })
  }

  const handleMouseMove = (e) => {
    if (!isAdmin || !draggedSignature) return

    const rect = canvasRef.current.getBoundingClientRect()
    const x = (e.clientX - rect.left) / zoomLevel - draggedSignature.offsetX
    const y = (e.clientY - rect.top) / zoomLevel - draggedSignature.offsetY

    // Cập nhật vị trí tạm thời
    setSignatures(prev => prev.map(sig =>
      sig.id === draggedSignature.id
        ? { ...sig, position: { ...sig.position, x, y } }
        : sig
    ))
  }

  const handleMouseUp = async () => {
    if (!isAdmin || !draggedSignature) return

    try {
      // Lưu vị trí mới
      const signature = signatures.find(s => s.id === draggedSignature.id)
      if (signature) {
        await DataManager.updateSignaturePosition(draggedSignature.id, signature.position)
        setMessage('✅ Đã di chuyển chữ ký thành công!')
      }
    } catch (error) {
      console.error('Lỗi khi di chuyển chữ ký:', error)
      setMessage('❌ Không thể di chuyển chữ ký')
    }

    setDraggedSignature(null)
  }

  // Touch handlers cho mobile
  const handleTouchStart = (signature) => {
    setTouchedSignature(signature.id)
    // Tự động ẩn sau 2 giây
    setTimeout(() => {
      setTouchedSignature(null)
    }, 2000)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 to-blue-900 flex items-center justify-center">
        <div className="text-white text-xl">⏳ Đang tải...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 to-blue-900 relative">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 bg-white/5 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute top-40 right-20 w-24 h-24 bg-white/10 rounded-full blur-lg animate-bounce"></div>
        <div className="absolute bottom-32 left-1/4 w-40 h-40 bg-white/5 rounded-full blur-2xl animate-pulse delay-1000"></div>
      </div>

      <div className="container mx-auto px-4 py-8 relative z-10">
        {/* Header với animation */}
        <div className="text-center mb-8 fade-in">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-4" style={{ fontFamily: 'serif', textShadow: '0 0 20px rgba(255,255,255,0.3)' }}>
            12A
          </h1>
          <p className="text-white/80 text-lg">Yearbook Signature Gallery</p>
        </div>

        {/* Navigation */}
        <nav className="glass rounded-2xl p-6 mb-8 slide-in">
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              to="/"
              className="group flex items-center gap-3 px-6 py-3 rounded-xl font-medium text-white hover:bg-white/20 transition-all duration-300 hover:scale-105"
            >
              <span>Home</span>
            </Link>
            <Link
              to="/signature-form"
              className="group flex items-center gap-3 px-6 py-3 rounded-xl font-medium text-white hover:bg-white/20 transition-all duration-300 hover:scale-105"
            >
              <span>Sign</span>
            </Link>
            <div className="flex items-center gap-3 px-6 py-3 rounded-xl font-medium bg-white text-gray-800 shadow-lg transform scale-105">
              <span>Gallery</span>
            </div>
            <Link
              to="/history"
              className="group flex items-center gap-3 px-6 py-3 rounded-xl font-medium text-white hover:bg-white/20 transition-all duration-300 hover:scale-105"
            >
              <span>History</span>
            </Link>
          </div>
        </nav>

        {/* Admin Mode Indicator */}
        {isAdmin && (
          <div className="text-center mb-6">
            <div className="inline-flex items-center gap-3 bg-red-500/20 border border-red-400/30 rounded-2xl px-6 py-3 backdrop-blur-sm">
              <span className="text-white font-semibold">Admin Mode - Drag and drop to rearrange</span>
            </div>
            <div className="mt-4">
              <Link
                to="/gallery"
                className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 rounded-xl text-white transition-all duration-300 hover:scale-105"
              >
                Switch to normal view
              </Link>
            </div>
          </div>
        )}

        {/* Message */}
        {message && (
          <div className="max-w-2xl mx-auto mb-6">
            <div className="glass rounded-xl p-4 text-center">
              <p className="text-white font-medium">{message}</p>
            </div>
          </div>
        )}



        {/* Gallery Canvas Only */}
        <div className="max-w-7xl mx-auto">
          <div className="glass rounded-2xl p-6 shadow-2xl neon-hover">
            <div className="text-center mb-6">
              <h3 className="text-white font-bold text-2xl flex items-center justify-center gap-3">
                <div className="w-3 h-3 bg-pink-500 rounded-full neon-pulse"></div>
                Signature Gallery
                <div className="w-3 h-3 bg-purple-500 rounded-full neon-pulse"></div>
              </h3>
              <p className="text-purple-300/80 text-sm mt-2">
                {signatures.length} signatures collected
              </p>
            </div>

            {signatures.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-purple-300 text-lg font-medium">
                  No signatures approved yet!
                </p>
              </div>
            ) : (
              <div
                ref={canvasRef}
                className="zoom-container relative w-full h-[400px] md:h-[600px] lg:h-[700px] bg-white/5 rounded-xl border-2 border-white/20 overflow-auto"
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
                onWheel={handleWheel}
                style={{ cursor: zoomLevel > 1 ? 'grab' : 'default' }}
              >
                <div
                  className="zoom-canvas relative min-w-full min-h-full"
                  style={{
                    transform: `scale(${zoomLevel})`,
                    transformOrigin: 'top left',
                    width: `${100 / zoomLevel}%`,
                    height: `${100 / zoomLevel}%`
                  }}
                >
                {signatures.map((signature) => {
                  const x = signature.position?.x || Math.random() * 800
                  const y = signature.position?.y || Math.random() * 500

                  return (
                    <div
                      key={signature.id}
                      className={`
                        group relative w-32 h-20 p-2 rounded-lg border-2
                        ${signature.type === 'student' ? 'border-blue-400 bg-blue-100/20' : 'border-red-400 bg-red-100/20'}
                        ${isAdmin ? 'cursor-move hover:scale-105' : 'cursor-default'}
                        transition-transform duration-200
                      `}
                      style={{ left: x, top: y }}
                      onMouseDown={(e) => handleMouseDown(e, signature)}
                      onTouchStart={() => handleTouchStart(signature)}
                    >
                      {/* Tên - chỉ hiện khi hover/touch */}
                      <div className={`
                        signature-tooltip absolute -top-8 left-1/2 transform -translate-x-1/2 bg-black/80 text-white text-xs px-2 py-1 rounded whitespace-nowrap z-10
                        ${touchedSignature === signature.id ? 'opacity-100' : ''}
                      `}>
                        {signature.name}
                      </div>

                      {/* Nội dung - chiếm toàn bộ không gian */}
                      <div className="w-full h-full flex items-center justify-center">
                        {(() => {
                          const isMemory = signature.contentType === 'memory'
                          const imageData = isMemory
                            ? DataManager.getMemoryImage(signature.id)
                            : getSignatureImage(signature.id)
                          console.log(`Gallery: Hiển thị ${isMemory ? 'kỷ niệm' : 'chữ ký'} cho ${signature.name} (ID: ${signature.id}):`, !!imageData)

                          return imageData ? (
                            <img
                              src={imageData}
                              alt={isMemory ? `Kỷ niệm của ${signature.name}` : `Chữ ký của ${signature.name}`}
                              className={`max-w-full max-h-full ${isMemory ? 'object-cover' : 'object-contain'} bg-white rounded`}
                              draggable={false}
                              onError={(e) => {
                                console.error('Lỗi load ảnh:', e)
                                e.target.style.display = 'none'
                              }}
                            />
                          ) : (
                            <div className="text-xs text-gray-300 text-center">
                              Không có ảnh
                            </div>
                          )
                        })()}
                      </div>

                      {/* Icon loại - góc dưới phải */}
                      <div className="absolute bottom-1 right-1 bg-black/50 rounded-full w-5 h-5 flex items-center justify-center">
                        <span className="text-xs">
                          {signature.contentType === 'memory' ? '📸' :
                           signature.type === 'student' ? '🎓' : '👨‍🏫'}
                        </span>
                      </div>
                    </div>
                  )
                })}

                {isAdmin && (
                  <div className="absolute bottom-2 right-2 text-white/50 text-xs">
                    Drag and drop to rearrange signatures
                  </div>
                )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Admin Access */}
        {!isAdmin && (
          <div className="text-center mt-6">
            <Link
              to="/gallery?admin=true"
              className="text-purple-400 hover:text-purple-300 text-sm underline font-medium"
            >
              Admin Mode (Rearrange Signatures)
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}

export default GalleryPage
