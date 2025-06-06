import React, { useState, useEffect, useRef } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { DataManager } from '../utils/dataManager'
import html2canvas from 'html2canvas'

const GalleryPage = () => {
  const [signatures, setSignatures] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchParams] = useSearchParams()
  const [draggedSignature, setDraggedSignature] = useState(null)
  const [message, setMessage] = useState('')
  const [zoomLevel, setZoomLevel] = useState(1)
  const [touchedSignature, setTouchedSignature] = useState(null)
  const [isCapturing, setIsCapturing] = useState(false)
  const [resizingSignature, setResizingSignature] = useState(null)
  const [resizeStartPos, setResizeStartPos] = useState({ x: 0, y: 0 })
  const canvasRef = useRef(null)

  // Kiểm tra xem có phải admin không (từ URL parameter)
  const isAdmin = searchParams.get('admin') === 'true'

  useEffect(() => {
    loadSignatures()
  }, [])

  // Keyboard shortcuts cho resize
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isAdmin || !touchedSignature) return

      if (e.key === '+' || e.key === '=') {
        e.preventDefault()
        // Phóng to
        setSignatures(prev => prev.map(sig =>
          sig.id === touchedSignature
            ? { ...sig, scale: Math.min(5, (sig.scale || 1) + 0.1) }
            : sig
        ))
      } else if (e.key === '-') {
        e.preventDefault()
        // Thu nhỏ
        setSignatures(prev => prev.map(sig =>
          sig.id === touchedSignature
            ? { ...sig, scale: Math.max(0.3, (sig.scale || 1) - 0.1) }
            : sig
        ))
      } else if (e.key === '0') {
        e.preventDefault()
        // Reset về 1x
        setSignatures(prev => prev.map(sig =>
          sig.id === touchedSignature
            ? { ...sig, scale: 1 }
            : sig
        ))
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isAdmin, touchedSignature])

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

  // Resize handlers
  const handleResizeStart = (e, signature) => {
    if (!isAdmin) return
    e.stopPropagation() // Ngăn drag

    setResizingSignature(signature)
    setResizeStartPos({
      x: e.clientX,
      y: e.clientY,
      initialScale: signature.scale || 1
    })
  }

  const handleResizeMove = (e) => {
    if (!isAdmin || !resizingSignature) return

    const deltaX = e.clientX - resizeStartPos.x
    const deltaY = e.clientY - resizeStartPos.y

    // Tính khoảng cách di chuyển
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY)

    // Xác định hướng (phóng to hay thu nhỏ)
    const direction = deltaX + deltaY > 0 ? 1 : -1

    // Tính scale mới
    const scaleFactor = 1 + (direction * distance * 0.002) // Sensitivity
    const newScale = Math.max(0.3, Math.min(5, resizeStartPos.initialScale * scaleFactor))

    // Cập nhật scale tạm thời
    setSignatures(prev => prev.map(sig =>
      sig.id === resizingSignature.id
        ? { ...sig, scale: newScale }
        : sig
    ))
  }

  const handleResizeEnd = async () => {
    if (!isAdmin || !resizingSignature) return

    try {
      const signature = signatures.find(s => s.id === resizingSignature.id)
      if (signature) {
        await DataManager.updateSignatureScale(resizingSignature.id, signature.scale || 1)
        setMessage(`✅ Đã thay đổi kích thước thành ${(signature.scale || 1).toFixed(1)}x!`)
        setTimeout(() => setMessage(''), 2000)
      }
    } catch (error) {
      console.error('Lỗi khi thay đổi kích thước:', error)
      setMessage('❌ Không thể thay đổi kích thước')
    }

    setResizingSignature(null)
    setResizeStartPos({ x: 0, y: 0, initialScale: 1 })
  }

  // Function để chụp ảnh gallery - in tất cả mọi thứ
  const handleCaptureImage = async () => {
    if (!canvasRef.current) {
      console.error('Canvas ref không tồn tại')
      setMessage('❌ Không tìm thấy canvas')
      return
    }

    setIsCapturing(true)
    setMessage('📷 Đang chuẩn bị chụp canvas...')

    try {
      console.log('Canvas element:', canvasRef.current)
      console.log('Canvas dimensions:', {
        width: canvasRef.current.offsetWidth,
        height: canvasRef.current.offsetHeight,
        scrollWidth: canvasRef.current.scrollWidth,
        scrollHeight: canvasRef.current.scrollHeight
      })

      // Hiện tất cả tooltips tạm thời để chụp
      const tooltips = document.querySelectorAll('.signature-tooltip')
      console.log('Found tooltips:', tooltips.length)
      tooltips.forEach(tooltip => {
        tooltip.style.opacity = '1'
        tooltip.style.visibility = 'visible'
      })

      // Ẩn border và background của signatures khi chụp
      const signatureItems = canvasRef.current.querySelectorAll('.signature-item')
      console.log('Found signature items:', signatureItems.length)
      signatureItems.forEach(item => {
        item.style.border = 'none'
        item.style.backgroundColor = 'transparent'
      })

      // Đợi tất cả ảnh load xong
      const images = canvasRef.current.querySelectorAll('img')
      console.log('Found images:', images.length)

      const imagePromises = Array.from(images).map((img, index) => {
        return new Promise((resolve) => {
          console.log(`Image ${index}:`, img.src, 'Complete:', img.complete)
          if (img.complete) {
            resolve()
          } else {
            img.onload = () => {
              console.log(`Image ${index} loaded`)
              resolve()
            }
            img.onerror = () => {
              console.log(`Image ${index} error`)
              resolve()
            }
          }
        })
      })

      await Promise.all(imagePromises)
      console.log('Tất cả ảnh đã load xong, bắt đầu chụp...')
      setMessage(`📷 Đang chụp canvas độ phân giải cao (${scale}x)...`)

      // Đợi thêm 500ms để đảm bảo render hoàn tất
      await new Promise(resolve => setTimeout(resolve, 500))

      // Chụp ảnh canvas với độ phân giải cao cố định
      console.log('Bắt đầu html2canvas...')
      const pixelRatio = window.devicePixelRatio || 1
      const scale = Math.max(5, pixelRatio * 3) // Cố định 5x+

      console.log(`Sử dụng scale: ${scale}x (devicePixelRatio: ${pixelRatio})`)

      const canvas = await html2canvas(canvasRef.current, {
        backgroundColor: '#ffffff',
        scale: scale,
        useCORS: true,
        allowTaint: false,
        logging: true,
        width: canvasRef.current.offsetWidth,
        height: canvasRef.current.offsetHeight,
        foreignObjectRendering: true,
        imageTimeout: 60000, // 1 phút
        onclone: (clonedDoc) => {
          // Đảm bảo fonts được load và ẩn border trong cloned document
          const style = clonedDoc.createElement('style')
          style.textContent = `
            @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
            * { font-family: 'Inter', sans-serif !important; }
            .signature-item { border: none !important; background-color: transparent !important; }
          `
          clonedDoc.head.appendChild(style)
        }
      })

      console.log('html2canvas hoàn thành, canvas size:', canvas.width, 'x', canvas.height)

      if (canvas.width === 0 || canvas.height === 0) {
        throw new Error('Canvas có kích thước 0')
      }

      // Tạo link download
      const dataURL = canvas.toDataURL('image/png', 1.0)
      console.log('DataURL length:', dataURL.length)

      const link = document.createElement('a')
      link.download = `AK25-Canvas-${scale}x-${new Date().toISOString().split('T')[0]}.png`
      link.href = dataURL

      // Trigger download
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)

      setMessage(`✅ Đã tải ảnh canvas độ phân giải cao (${canvas.width}x${canvas.height}) thành công!`)

      // Khôi phục trạng thái tooltips và signature items
      tooltips.forEach(tooltip => {
        tooltip.style.opacity = ''
        tooltip.style.visibility = ''
      })

      // Khôi phục border và background của signatures
      signatureItems.forEach(item => {
        item.style.border = ''
        item.style.backgroundColor = ''
      })

    } catch (error) {
      console.error('Lỗi chi tiết khi chụp ảnh:', error)
      setMessage(`❌ Lỗi: ${error.message}`)

      // Fallback: Thử chụp với cấu hình tối thiểu
      try {
        console.log('Thử fallback method...')
        setMessage('🔄 Thử phương pháp khác...')

        const fallbackCanvas = await html2canvas(canvasRef.current, {
          backgroundColor: '#ffffff',
          scale: 4, // Fallback dùng scale 4x
          logging: true,
          useCORS: true,
          imageTimeout: 30000
        })

        if (fallbackCanvas.width > 0 && fallbackCanvas.height > 0) {
          const dataURL = fallbackCanvas.toDataURL('image/png')
          const link = document.createElement('a')
          link.download = `AK25-Canvas-Fallback-${new Date().toISOString().split('T')[0]}.png`
          link.href = dataURL
          document.body.appendChild(link)
          link.click()
          document.body.removeChild(link)
          setMessage('✅ Đã tải ảnh bằng phương pháp dự phòng!')
        } else {
          setMessage('❌ Không thể chụp ảnh canvas')
        }
      } catch (fallbackError) {
        console.error('Fallback cũng thất bại:', fallbackError)
        setMessage('❌ Không thể chụp ảnh canvas')
      }
    } finally {
      setIsCapturing(false)
      // Tự động ẩn message sau 5 giây
      setTimeout(() => setMessage(''), 5000)
    }
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
            AK25
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
              to="/memory-form"
              className="group flex items-center gap-3 px-6 py-3 rounded-xl font-medium text-white hover:bg-white/20 transition-all duration-300 hover:scale-105"
            >
              <span>Memory</span>
            </Link>
            <Link
              to="/history"
              className="group flex items-center gap-3 px-6 py-3 rounded-xl font-medium text-white hover:bg-white/20 transition-all duration-300 hover:scale-105"
            >
              <span>History</span>
            </Link>
            <button
              onClick={handleCaptureImage}
              disabled={isCapturing || signatures.length === 0}
              className="group flex items-center gap-3 px-6 py-3 rounded-xl font-medium text-white hover:bg-green-500/20 transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed border border-green-500/30 hover:border-green-400/50"
            >
              <span>{isCapturing ? '📷 Đang chụp...' : '🖨️ In Canvas'}</span>
            </button>
          </div>
        </nav>

        {/* Admin Mode Indicator */}
        {isAdmin && (
          <div className="text-center mb-6">
            <div className="inline-flex items-center gap-3 bg-red-500/20 border border-red-400/30 rounded-2xl px-6 py-3 backdrop-blur-sm">
              <span className="text-white font-semibold">Admin Mode - Drag to move, Resize handle to scale</span>
            </div>
            <div className="mt-4 space-y-2">
              <Link
                to="/gallery"
                className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 rounded-xl text-white transition-all duration-300 hover:scale-105"
              >
                Switch to normal view
              </Link>
              <div className="text-white/70 text-sm">
                💡 Hover signature → Drag yellow handle to resize | Keys: +/- to scale, 0 to reset
              </div>
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
                className="zoom-container relative w-full h-[400px] md:h-[600px] lg:h-[700px] bg-white rounded-xl border-2 border-gray-300 overflow-auto"
                onMouseMove={(e) => {
                  handleMouseMove(e)
                  handleResizeMove(e)
                }}
                onMouseUp={() => {
                  handleMouseUp()
                  handleResizeEnd()
                }}
                onMouseLeave={() => {
                  handleMouseUp()
                  handleResizeEnd()
                }}
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
                  const scale = signature.scale || 1

                  return (
                    <div
                      key={signature.id}
                      className={`
                        signature-item group relative w-32 h-20 p-2 rounded-lg border-2
                        ${signature.type === 'student' ? 'border-blue-400 bg-blue-100/20' : 'border-red-400 bg-red-100/20'}
                        ${isAdmin ? 'cursor-move hover:scale-105' : 'cursor-default'}
                        transition-transform duration-200
                      `}
                      style={{
                        left: x,
                        top: y,
                        transform: `scale(${scale})`,
                        transformOrigin: 'top left'
                      }}
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
                              crossOrigin="anonymous"
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



                      {/* Resize handle - chỉ hiện khi admin */}
                      {isAdmin && (
                        <div
                          className="absolute -bottom-2 -right-2 w-4 h-4 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full cursor-se-resize opacity-0 group-hover:opacity-100 transition-all duration-200 border-2 border-white shadow-lg hover:scale-110 flex items-center justify-center"
                          onMouseDown={(e) => handleResizeStart(e, signature)}
                          title={`Resize (current: ${(signature.scale || 1).toFixed(1)}x)`}
                        >
                          <div className="w-1 h-1 bg-white rounded-full"></div>
                        </div>
                      )}

                      {/* Scale indicator */}
                      {isAdmin && (signature.scale && signature.scale !== 1) && (
                        <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 bg-black/70 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                          {(signature.scale).toFixed(1)}x
                        </div>
                      )}
                    </div>
                  )
                })}

                {isAdmin && (
                  <div className="absolute bottom-2 right-2 text-white/50 text-xs max-w-48 text-right">
                    Drag to move • Resize handle to scale • +/- keys to adjust
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
