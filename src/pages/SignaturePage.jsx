import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import BackgroundSelector from '../components/BackgroundSelector'

const SignaturePage = () => {
  const [backgroundTheme, setBackgroundTheme] = useState('bg-gradient-1')
  const [showMainContent, setShowMainContent] = useState(false)
  const [scrollY, setScrollY] = useState(0)

  useEffect(() => {
    // Load background theme từ localStorage
    const savedTheme = localStorage.getItem('backgroundTheme')
    if (savedTheme) {
      setBackgroundTheme(savedTheme)
    }

    // Scroll listener - Cải tiến
    const handleScroll = () => {
      const currentScrollY = window.scrollY
      setScrollY(currentScrollY)

      // Hiển thị nội dung chính khi scroll xuống 100px để animation mượt mà hơn
      if (currentScrollY > 100) {
        setShowMainContent(true)
      } else {
        setShowMainContent(false)
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleThemeChange = (newTheme) => {
    setBackgroundTheme(newTheme)
    localStorage.setItem('backgroundTheme', newTheme)
  }



  return (
    <div className={`min-h-screen ${backgroundTheme} transition-all duration-500 relative overflow-x-hidden`}>
      {/* Hero Section với AK25 */}
      <div className="min-h-screen flex items-center justify-center relative">
        <div className="text-center">
          {/* Logo AK25 với animation cải tiến */}
          <div
            className={`text-8xl md:text-9xl font-bold text-white mb-8 transition-all duration-1500 ease-in-out ${
              showMainContent
                ? 'transform -translate-y-32 scale-50 opacity-30 blur-sm'
                : 'transform translate-y-0 scale-100 opacity-100 blur-0'
            }`}
            style={{
              textShadow: showMainContent
                ? '0 0 50px rgba(255,255,255,0.3)'
                : '0 0 40px rgba(255,255,255,0.8), 0 0 80px rgba(255,255,255,0.4)',
              fontFamily: 'serif',
              letterSpacing: showMainContent ? '0.2em' : '0.1em'
            }}
          >
            AK25
          </div>

          {/* Subtitle animation */}
          <div
            className={`text-lg md:text-xl text-white/80 transition-all duration-1000 delay-200 ${
              showMainContent ? 'opacity-0 transform translate-y-10' : 'opacity-100 transform translate-y-0'
            }`}
          >
            Yearbook Signature Collection
          </div>

          {/* Scroll hint */}
          <div
            className={`mt-12 transition-all duration-1000 delay-500 ${
              showMainContent ? 'opacity-0 transform translate-y-10' : 'opacity-100 transform translate-y-0'
            }`}
          >
            <div className="text-white/60 text-sm mb-4">Scroll down to explore</div>
            <div className="w-6 h-10 border-2 border-white/40 rounded-full mx-auto relative">
              <div className="w-1 h-3 bg-white/60 rounded-full absolute top-2 left-1/2 transform -translate-x-1/2 animate-bounce"></div>
            </div>
          </div>


        </div>

        {/* Animated content khi scroll - Cải tiến */}
        <div className={`
          fixed inset-0 flex items-center justify-center transition-all duration-1200 z-10
          ${showMainContent ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'}
        `}>

          {/* Overlay background */}
          <div className={`
            absolute inset-0 bg-black/40 backdrop-blur-md transition-opacity duration-1000
            ${showMainContent ? 'opacity-100' : 'opacity-0'}
          `}></div>

          {/* Left panel - Submit Signature */}
          <div className={`
            absolute left-0 top-0 w-1/2 h-full bg-gradient-to-r from-purple-600/30 to-purple-800/20 backdrop-blur-lg border-r border-white/20
            transition-all duration-1200 ease-out
            ${showMainContent ? 'transform translate-x-0' : 'transform -translate-x-full'}
          `}>
            <div className="h-full flex items-center justify-center relative overflow-hidden">
              {/* Decorative elements */}
              <div className="absolute top-20 left-10 w-32 h-32 bg-white/5 rounded-full blur-xl animate-pulse"></div>
              <div className="absolute bottom-32 right-10 w-24 h-24 bg-purple-500/10 rounded-full blur-lg animate-bounce"></div>

              <div className={`text-center p-8 relative z-10 transition-all duration-1000 delay-300 ${
                showMainContent ? 'transform translate-y-0 opacity-100' : 'transform translate-y-10 opacity-0'
              }`}>
                <div className="mb-6">
                  <div className="text-6xl mb-4">✍️</div>
                  <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">Gửi Chữ Ký</h2>
                  <p className="text-white/70 text-lg">Để lại dấu ấn của bạn</p>
                </div>
                <Link
                  to="/signature-form"
                  onClick={() => setShowMainContent(false)}
                  className="group relative inline-block px-10 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold rounded-2xl hover:from-purple-600 hover:to-pink-600 transition-all duration-300 text-lg shadow-2xl transform hover:scale-105"
                >
                  <span className="relative z-10">Bấm vào đây</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-400/20 to-pink-400/20 rounded-2xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </Link>
              </div>
            </div>
          </div>

          {/* Right panel - View Gallery */}
          <div className={`
            absolute right-0 top-0 w-1/2 h-full bg-gradient-to-l from-blue-600/30 to-blue-800/20 backdrop-blur-lg border-l border-white/20
            transition-all duration-1200 ease-out
            ${showMainContent ? 'transform translate-x-0' : 'transform translate-x-full'}
          `}>
            <div className="h-full flex items-center justify-center relative overflow-hidden">
              {/* Decorative elements */}
              <div className="absolute top-32 right-10 w-28 h-28 bg-white/5 rounded-full blur-xl animate-pulse delay-500"></div>
              <div className="absolute bottom-20 left-10 w-36 h-36 bg-blue-500/10 rounded-full blur-lg animate-bounce delay-1000"></div>

              <div className={`text-center p-8 relative z-10 transition-all duration-1000 delay-500 ${
                showMainContent ? 'transform translate-y-0 opacity-100' : 'transform translate-y-10 opacity-0'
              }`}>
                <div className="mb-6">
                  <div className="text-6xl mb-4">🖼️</div>
                  <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">Xem Bảng Ký</h2>
                  <p className="text-white/70 text-lg">Khám phá chữ ký & kỷ niệm</p>
                </div>
                <div className="space-y-3">
                  <Link
                    to="/gallery"
                    onClick={() => setShowMainContent(false)}
                    className="group relative block px-10 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-bold rounded-2xl hover:from-blue-600 hover:to-cyan-600 transition-all duration-300 text-lg shadow-2xl transform hover:scale-105"
                  >
                    <span className="relative z-10">📋 Xem Gallery</span>
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-cyan-400/20 rounded-2xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </Link>
                  <Link
                    to="/memory-form"
                    onClick={() => setShowMainContent(false)}
                    className="group relative block px-10 py-3 bg-gradient-to-r from-pink-500 to-purple-500 text-white font-bold rounded-2xl hover:from-pink-600 hover:to-purple-600 transition-all duration-300 text-lg shadow-2xl transform hover:scale-105"
                  >
                    <span className="relative z-10">📸 Chia sẻ kỷ niệm</span>
                    <div className="absolute inset-0 bg-gradient-to-r from-pink-400/20 to-purple-400/20 rounded-2xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Close button - Cải tiến */}
          <button
            onClick={() => setShowMainContent(false)}
            className={`absolute top-8 right-8 w-14 h-14 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white text-2xl transition-all duration-300 backdrop-blur-sm border border-white/20 hover:scale-110 ${
              showMainContent ? 'transform rotate-0 opacity-100' : 'transform rotate-180 opacity-0'
            }`}
          >
            ×
          </button>

          {/* Center divider line */}
          <div className={`
            absolute left-1/2 top-1/4 bottom-1/4 w-px bg-gradient-to-b from-transparent via-white/30 to-transparent transform -translate-x-1/2
            transition-all duration-1000 delay-700
            ${showMainContent ? 'opacity-100 scale-y-100' : 'opacity-0 scale-y-0'}
          `}></div>
        </div>
      </div>

      {/* Spacer để tạo scroll */}
      <div className="h-screen bg-transparent"></div>

      {/* Background Selector - Fixed position */}
      <div className="fixed bottom-4 left-4 z-20">
        <BackgroundSelector
          currentTheme={backgroundTheme}
          onThemeChange={handleThemeChange}
        />
      </div>
    </div>
  )
}

export default SignaturePage
