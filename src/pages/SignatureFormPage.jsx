import React, { useState, useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import ResponsiveSignatureCanvas from '../components/ResponsiveSignatureCanvas'
import { DataManager } from '../utils/dataManager'

const SignatureFormPage = () => {
  const [name, setName] = useState('')
  const [type, setType] = useState('student')
  const [currentCanvas, setCurrentCanvas] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitMessage, setSubmitMessage] = useState('')
  const canvasRef = useRef(null)
  const navigate = useNavigate()



  const handleSignatureChange = (canvas) => {
    setCurrentCanvas(canvas)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    console.log('Form submitted with:', { name: name.trim(), type, currentCanvas: !!currentCanvas })

    if (!name.trim()) {
      setSubmitMessage('Please enter your name!')
      console.log('Error: Name is empty')
      return
    }

    if (!currentCanvas) {
      setSubmitMessage('Please write your signature!')
      console.log('Error: No canvas data')
      return
    }

    setIsSubmitting(true)
    setSubmitMessage('')

    try {
      console.log('Starting signature submission...')

      // Get image data from canvas
      const imageData = DataManager.getImageDataFromCanvas(currentCanvas)
      console.log('Canvas data length:', imageData?.length)
      console.log('Canvas data preview:', imageData?.substring(0, 100) + '...')

      // Validate image data
      if (!imageData || imageData.length < 100) {
        throw new Error('Invalid canvas data - signature may be empty')
      }

      // Send signature to server
      const newSignature = await DataManager.addSignature({
        name: name.trim(),
        type,
        imageData
      })

      console.log('Signature created:', newSignature)

      // Lưu thông tin signature vào localStorage để sử dụng sau
      localStorage.setItem('lastSubmittedSignature', JSON.stringify({
        name: name.trim(),
        type,
        id: newSignature.id
      }))

      // Reset form
      setName('')
      setCurrentCanvas(null)
      if (canvasRef.current) {
        canvasRef.current.clearCanvas()
      }

      // Chuyển hướng dựa trên loại người dùng
      if (type === 'student') {
        // Học sinh sẽ đi đến trang sleep
        navigate('/sleep')
      } else {
        // Giáo viên sẽ đi đến trang cảm ơn
        navigate('/thankyou')
      }

    } catch (error) {
      console.error('Error submitting signature:', error)
      setSubmitMessage('❌ An error occurred. Please try again!')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-1 transition-all duration-500 relative">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 bg-white/5 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute top-40 right-20 w-24 h-24 bg-white/10 rounded-full blur-lg animate-bounce"></div>
        <div className="absolute bottom-32 left-1/4 w-40 h-40 bg-white/5 rounded-full blur-2xl animate-pulse delay-1000"></div>
      </div>

      <div className="container mx-auto px-4 py-8 relative z-10">
        {/* Header với animation */}
        <div className="text-center mb-6 md:mb-8 fade-in">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-2 md:mb-4" style={{ fontFamily: 'serif', textShadow: '0 0 20px rgba(255,255,255,0.3)' }}>
            12A
          </h1>
          <p className="text-white/80 text-base md:text-lg">Yearbook Signature Collection</p>
        </div>

        {/* Navigation với neon effect */}
        <nav className="glass rounded-2xl p-4 md:p-6 mb-6 md:mb-8 slide-in neon-hover">
          <div className="flex flex-wrap justify-center gap-3 md:gap-4">
            <Link
              to="/"
              className="group flex items-center gap-2 md:gap-3 px-5 md:px-7 py-3 md:py-4 rounded-xl font-bold text-white hover:bg-purple-500/20 transition-all duration-300 hover:scale-105 text-sm md:text-base border border-transparent hover:border-purple-500/30 neon-hover"
            >
              <span>Home</span>
            </Link>
            <div className="flex items-center gap-2 md:gap-3 px-5 md:px-7 py-3 md:py-4 rounded-xl font-bold neon-button text-white shadow-lg transform scale-105 text-sm md:text-base">
              <span>Signature Form</span>
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



        {/* Main Content - Two Column Layout */}
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">

            {/* Left Column - Form */}
            <div className="glass rounded-2xl md:rounded-3xl p-6 md:p-8 fade-in shadow-2xl neon-hover">
              <div className="text-center mb-8">
                <div className="inline-flex items-center gap-3 neon-button rounded-full px-6 py-3 mb-4">
                  <span className="text-white font-bold text-lg tracking-wide">Personal Information</span>
                </div>
                <div className="w-16 h-1 bg-gradient-to-r from-purple-500 to-pink-500 mx-auto rounded-full neon-pulse"></div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name */}
              <div className="group">
                <label className="block text-white text-xl font-bold mb-4 flex items-center gap-3">
                  <div className="w-2 h-2 bg-purple-500 rounded-full neon-pulse"></div>
                  Your Name:
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-6 py-4 rounded-2xl border-2 border-purple-500/30 bg-black/20 text-white text-lg placeholder-purple-300/70 focus:border-purple-400 focus:outline-none focus:ring-4 focus:ring-purple-500/20 transition-all duration-300 backdrop-blur-sm neon-hover"
                    style={{ boxShadow: '0 0 15px rgba(139, 92, 246, 0.3)' }}
                    placeholder="Enter your name..."
                    autoComplete="name"
                    spellCheck="false"
                    required
                  />
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-purple-500/10 to-pink-500/10 pointer-events-none"></div>
                </div>
              </div>

              {/* Type */}
              <div className="group">
                <label className="block text-white text-xl font-bold mb-6 flex items-center gap-3">
                  <div className="w-2 h-2 bg-pink-500 rounded-full neon-pulse"></div>
                  You are:
                </label>
                <div className="flex gap-6 justify-center">
                  <label className="group/radio flex items-center gap-4 cursor-pointer bg-black/20 border-2 border-blue-500/30 rounded-2xl px-8 py-5 hover:border-blue-400 transition-all duration-300 hover:scale-105 neon-hover relative overflow-hidden">
                    <input
                      type="radio"
                      value="student"
                      checked={type === 'student'}
                      onChange={(e) => setType(e.target.value)}
                      className="w-5 h-5 text-blue-500 bg-transparent border-2 border-blue-500 focus:ring-blue-500"
                    />
                    <span className="text-white text-lg font-bold relative z-10">
                      Student
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 opacity-0 group-hover/radio:opacity-100 transition-opacity"></div>
                    {type === 'student' && <div className="absolute inset-0 bg-blue-500/20 rounded-2xl" style={{ boxShadow: '0 0 20px rgba(59, 130, 246, 0.5)' }}></div>}
                  </label>
                  <label className="group/radio flex items-center gap-4 cursor-pointer bg-black/20 border-2 border-pink-500/30 rounded-2xl px-8 py-5 hover:border-pink-400 transition-all duration-300 hover:scale-105 neon-hover relative overflow-hidden">
                    <input
                      type="radio"
                      value="teacher"
                      checked={type === 'teacher'}
                      onChange={(e) => setType(e.target.value)}
                      className="w-5 h-5 text-pink-500 bg-transparent border-2 border-pink-500 focus:ring-pink-500"
                    />
                    <span className="text-white text-lg font-bold relative z-10">
                      Teacher
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-r from-pink-500/10 to-purple-500/10 opacity-0 group-hover/radio:opacity-100 transition-opacity"></div>
                    {type === 'teacher' && <div className="absolute inset-0 bg-pink-500/20 rounded-2xl" style={{ boxShadow: '0 0 20px rgba(236, 72, 153, 0.5)' }}></div>}
                  </label>
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
                      : '#8b5cf6',
                    boxShadow: isSubmitting
                      ? '0 0 20px rgba(107, 114, 128, 0.5)'
                      : '0 0 30px rgba(139, 92, 246, 0.6)'
                  }}
                >
                  <span className="relative z-10 flex items-center justify-center gap-3">
                    {isSubmitting ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span className="font-bold tracking-wide">Submitting...</span>
                      </>
                    ) : (
                      <>
                        <span className="text-xl">✨</span>
                        <span className="font-bold tracking-wide">Submit Signature</span>
                        <span className="text-xl">✨</span>
                      </>
                    )}
                  </span>
                </button>
              </div>

              {/* Message */}
              {submitMessage && (
                <div className="text-center fade-in mt-6">
                  <div className="glass rounded-xl p-4 border-2 border-purple-500/30 neon-hover">
                    <p className="text-white font-bold">
                      {submitMessage}
                    </p>
                  </div>
                </div>
              )}
            </form>
            </div>

            {/* Right Column - Canvas */}
            <div className="glass rounded-2xl md:rounded-3xl p-6 md:p-8 fade-in shadow-2xl neon-hover">
              <div className="text-center mb-8">
                <div className="inline-flex items-center gap-3 neon-button rounded-full px-6 py-3 mb-4">
                  <span className="text-white font-bold text-lg tracking-wide">Digital Signature</span>
                </div>
                <div className="w-16 h-1 bg-gradient-to-r from-cyan-500 to-blue-500 mx-auto rounded-full neon-pulse"></div>
              </div>

              <div className="space-y-6">
                <div className="text-center">
                  <p className="text-white text-lg font-medium mb-6">
                    Create your unique signature below
                  </p>
                </div>

                <div className="flex justify-center">
                  <div className="relative w-full max-w-lg">
                    <div className="absolute -inset-3 bg-gradient-to-r from-purple-500/30 to-pink-500/30 rounded-3xl blur-xl neon-pulse"></div>
                    <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-2xl blur-lg"></div>
                    <div className="relative bg-white/95 rounded-2xl p-5 shadow-2xl border-2 border-purple-500/20">
                      <ResponsiveSignatureCanvas
                        ref={canvasRef}
                        onSignatureChange={handleSignatureChange}
                      />
                    </div>
                  </div>
                </div>

                <div className="text-center">
                  <p className="text-purple-300/80 text-sm font-medium">
                    ✨ Write signature in canvas ✨
                  </p>
                </div>


              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  )
}

export default SignatureFormPage
