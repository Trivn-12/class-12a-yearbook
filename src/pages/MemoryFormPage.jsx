import React, { useState, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { DataManager } from '../utils/dataManager'

const MemoryFormPage = () => {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [selectedImage, setSelectedImage] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitMessage, setSubmitMessage] = useState('')
  const fileInputRef = useRef(null)
  const navigate = useNavigate()

  const handleImageSelect = (e) => {
    const file = e.target.files[0]
    if (file) {
      // Kiểm tra loại file
      if (!file.type.startsWith('image/')) {
        setSubmitMessage('❌ Vui lòng chọn file ảnh!')
        return
      }

      // Kiểm tra kích thước file (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setSubmitMessage('❌ Ảnh quá lớn! Vui lòng chọn ảnh nhỏ hơn 5MB.')
        return
      }

      setSelectedImage(file)
      setSubmitMessage('')

      // Tạo preview
      const reader = new FileReader()
      reader.onload = (e) => {
        setImagePreview(e.target.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!name.trim()) {
      setSubmitMessage('❌ Vui lòng nhập tên của bạn!')
      return
    }

    if (!selectedImage) {
      setSubmitMessage('❌ Vui lòng chọn ảnh kỷ niệm!')
      return
    }

    setIsSubmitting(true)
    setSubmitMessage('')

    try {
      console.log('Starting memory submission...')

      // Chuyển đổi file thành base64
      const reader = new FileReader()
      reader.onload = async (e) => {
        try {
          const imageData = e.target.result

          // Gửi ảnh kỷ niệm lên server
          const newMemory = await DataManager.addMemory({
            name: name.trim(),
            description: description.trim(),
            imageData
          })

          console.log('Memory created:', newMemory)

          // Lưu thông tin vào localStorage
          localStorage.setItem('lastSubmittedMemory', JSON.stringify({
            name: name.trim(),
            description: description.trim(),
            id: newMemory.id
          }))

          // Reset form
          setName('')
          setDescription('')
          setSelectedImage(null)
          setImagePreview(null)
          if (fileInputRef.current) {
            fileInputRef.current.value = ''
          }

          // Chuyển đến trang pending
          navigate('/pending')

        } catch (error) {
          console.error('Error submitting memory:', error)
          setSubmitMessage('❌ Có lỗi xảy ra. Vui lòng thử lại!')
          setIsSubmitting(false)
        }
      }

      reader.readAsDataURL(selectedImage)

    } catch (error) {
      console.error('Error submitting memory:', error)
      setSubmitMessage('❌ Có lỗi xảy ra. Vui lòng thử lại!')
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-900 via-purple-900 to-indigo-900 transition-all duration-500 relative">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 bg-white/5 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute top-40 right-20 w-24 h-24 bg-white/10 rounded-full blur-lg animate-bounce"></div>
        <div className="absolute bottom-32 left-1/4 w-40 h-40 bg-white/5 rounded-full blur-2xl animate-pulse delay-1000"></div>
        
        {/* Floating memory icons */}
        <div className="absolute top-1/4 left-1/3 text-white/20 text-5xl animate-bounce delay-500">📸</div>
        <div className="absolute top-1/3 right-1/4 text-white/15 text-4xl animate-bounce delay-1000">🌸</div>
        <div className="absolute bottom-1/3 left-1/5 text-white/10 text-5xl animate-bounce delay-1500">💝</div>
        <div className="absolute top-1/2 right-1/5 text-white/15 text-3xl animate-bounce delay-2000">✨</div>
      </div>

      <div className="container mx-auto px-4 py-8 relative z-10">
        {/* Header */}
        <div className="text-center mb-6 md:mb-8 fade-in">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-2 md:mb-4" style={{ fontFamily: 'serif', textShadow: '0 0 20px rgba(255,255,255,0.3)' }}>
            12A
          </h1>
          <p className="text-white/80 text-base md:text-lg">Memory Collection</p>
        </div>

        {/* Navigation */}
        <nav className="glass rounded-2xl p-4 md:p-6 mb-6 md:mb-8 slide-in neon-hover">
          <div className="flex flex-wrap justify-center gap-3 md:gap-4">
            <Link
              to="/"
              className="group flex items-center gap-2 md:gap-3 px-5 md:px-7 py-3 md:py-4 rounded-xl font-bold text-white hover:bg-purple-500/20 transition-all duration-300 hover:scale-105 text-sm md:text-base border border-transparent hover:border-purple-500/30 neon-hover"
            >
              <span>Home</span>
            </Link>
            <Link
              to="/signature-form"
              className="group flex items-center gap-2 md:gap-3 px-5 md:px-7 py-3 md:py-4 rounded-xl font-bold text-white hover:bg-purple-500/20 transition-all duration-300 hover:scale-105 text-sm md:text-base border border-transparent hover:border-purple-500/30 neon-hover"
            >
              <span>Signature</span>
            </Link>
            <div className="flex items-center gap-2 md:gap-3 px-5 md:px-7 py-3 md:py-4 rounded-xl font-bold neon-button text-white shadow-lg transform scale-105 text-sm md:text-base">
              <span>📸 Memory</span>
            </div>
            <Link
              to="/gallery"
              className="group flex items-center gap-2 md:gap-3 px-5 md:px-7 py-3 md:py-4 rounded-xl font-bold text-white hover:bg-purple-500/20 transition-all duration-300 hover:scale-105 text-sm md:text-base border border-transparent hover:border-purple-500/30 neon-hover"
            >
              <span>Gallery</span>
            </Link>
            <Link
              to="/history"
              className="group flex items-center gap-2 md:gap-3 px-5 md:px-7 py-3 md:py-4 rounded-xl font-bold text-white hover:bg-purple-500/20 transition-all duration-300 hover:scale-105 text-sm md:text-base border border-transparent hover:border-purple-500/30 neon-hover"
            >
              <span>History</span>
            </Link>
          </div>
        </nav>

        {/* Main Content */}
        <div className="max-w-4xl mx-auto">
          <div className="glass rounded-2xl md:rounded-3xl p-6 md:p-8 fade-in shadow-2xl neon-hover">
            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-3 neon-button rounded-full px-6 py-3 mb-4">
                <span className="text-white font-bold text-lg tracking-wide">📸 Chia sẻ kỷ niệm</span>
              </div>
              <div className="w-16 h-1 bg-gradient-to-r from-pink-500 to-purple-500 mx-auto rounded-full neon-pulse"></div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name */}
              <div className="group">
                <label className="block text-white text-xl font-bold mb-4 flex items-center gap-3">
                  <div className="w-2 h-2 bg-pink-500 rounded-full neon-pulse"></div>
                  Tên của bạn:
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-6 py-4 rounded-2xl border-2 border-pink-500/30 bg-black/20 text-white text-lg placeholder-pink-300/70 focus:border-pink-400 focus:outline-none focus:ring-4 focus:ring-pink-500/20 transition-all duration-300 backdrop-blur-sm neon-hover"
                    style={{ boxShadow: '0 0 15px rgba(236, 72, 153, 0.3)' }}
                    placeholder="Nhập tên của bạn..."
                    autoComplete="name"
                    spellCheck="false"
                    required
                  />
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-pink-500/10 to-purple-500/10 pointer-events-none"></div>
                </div>
              </div>

              {/* Description */}
              <div className="group">
                <label className="block text-white text-xl font-bold mb-4 flex items-center gap-3">
                  <div className="w-2 h-2 bg-purple-500 rounded-full neon-pulse"></div>
                  Mô tả kỷ niệm (tùy chọn):
                </label>
                <div className="relative">
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full px-6 py-4 rounded-2xl border-2 border-purple-500/30 bg-black/20 text-white text-lg placeholder-purple-300/70 focus:border-purple-400 focus:outline-none focus:ring-4 focus:ring-purple-500/20 transition-all duration-300 backdrop-blur-sm neon-hover resize-none"
                    style={{ boxShadow: '0 0 15px rgba(139, 92, 246, 0.3)' }}
                    placeholder="Chia sẻ câu chuyện về bức ảnh này..."
                    rows="3"
                  />
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-purple-500/10 to-pink-500/10 pointer-events-none"></div>
                </div>
              </div>

              {/* Image Upload */}
              <div className="group">
                <label className="block text-white text-xl font-bold mb-4 flex items-center gap-3">
                  <div className="w-2 h-2 bg-cyan-500 rounded-full neon-pulse"></div>
                  Chọn ảnh kỷ niệm:
                </label>
                
                <div className="space-y-4">
                  {/* Upload Button */}
                  <div className="relative">
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleImageSelect}
                      className="hidden"
                    />
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="w-full px-6 py-4 border-2 border-dashed border-cyan-500/50 rounded-2xl bg-black/20 text-white hover:border-cyan-400 hover:bg-cyan-500/10 transition-all duration-300 backdrop-blur-sm neon-hover"
                    >
                      <div className="flex flex-col items-center gap-3">
                        <div className="text-4xl">📁</div>
                        <div>
                          <p className="text-lg font-medium">Chọn ảnh từ thiết bị</p>
                          <p className="text-sm text-cyan-300/70">PNG, JPG, JPEG (tối đa 5MB)</p>
                        </div>
                      </div>
                    </button>
                  </div>

                  {/* Image Preview */}
                  {imagePreview && (
                    <div className="relative">
                      <div className="glass rounded-2xl p-4 border border-cyan-500/30">
                        <div className="text-center mb-4">
                          <h4 className="text-white font-bold">Xem trước ảnh:</h4>
                        </div>
                        <div className="flex justify-center">
                          <img
                            src={imagePreview}
                            alt="Preview"
                            className="max-w-full max-h-64 object-contain rounded-xl border-2 border-white/20"
                          />
                        </div>
                        <div className="text-center mt-4">
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedImage(null)
                              setImagePreview(null)
                              if (fileInputRef.current) {
                                fileInputRef.current.value = ''
                              }
                            }}
                            className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-xl transition-colors text-sm"
                          >
                            🗑️ Xóa ảnh
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Submit button */}
              <div className="text-center pt-6">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="group relative px-8 py-4 neon-button text-white font-bold text-lg rounded-2xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 shadow-2xl w-full overflow-hidden"
                  style={{
                    background: isSubmitting
                      ? '#6b7280'
                      : 'linear-gradient(135deg, #ec4899, #8b5cf6)',
                    boxShadow: isSubmitting
                      ? '0 0 20px rgba(107, 114, 128, 0.5)'
                      : '0 0 30px rgba(236, 72, 153, 0.6)'
                  }}
                >
                  <span className="relative z-10 flex items-center justify-center gap-3">
                    {isSubmitting ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span className="font-bold tracking-wide">Đang gửi...</span>
                      </>
                    ) : (
                      <>
                        <span className="text-xl">📸</span>
                        <span className="font-bold tracking-wide">Chia sẻ kỷ niệm</span>
                        <span className="text-xl">✨</span>
                      </>
                    )}
                  </span>
                </button>
              </div>

              {/* Message */}
              {submitMessage && (
                <div className="text-center fade-in mt-6">
                  <div className="glass rounded-xl p-4 border-2 border-pink-500/30 neon-hover">
                    <p className="text-white font-bold">
                      {submitMessage}
                    </p>
                  </div>
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MemoryFormPage
