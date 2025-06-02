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

    // Scroll listener
    const handleScroll = () => {
      const currentScrollY = window.scrollY
      console.log('Scroll Y:', currentScrollY) // Debug log
      setScrollY(currentScrollY)

      // Hiển thị nội dung chính khi scroll xuống 50px (giảm threshold)
      if (currentScrollY > 50) {
        console.log('Showing main content') // Debug log
        setShowMainContent(true)
      } else {
        console.log('Hiding main content') // Debug log
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
      {/* Hero Section với 12A */}
      <div className="min-h-screen flex items-center justify-center relative">
        <div className="text-center">
          {/* Logo 12A với animation */}
          <div
            className={`text-8xl md:text-9xl font-bold text-white mb-8 transition-all duration-1000 ${
              showMainContent ? 'transform -translate-y-20 scale-75 opacity-50' : 'transform translate-y-0 scale-100 opacity-100'
            }`}
            style={{
              textShadow: '0 0 30px rgba(255,255,255,0.5)',
              fontFamily: 'serif'
            }}
          >
            12A
          </div>


        </div>

        {/* Animated content khi scroll */}
        <div className={`
          fixed inset-0 flex items-center justify-center transition-all duration-1000 z-10
          ${showMainContent ? 'opacity-100 visible' : 'opacity-0 invisible'}
        `}>
          {/* Left panel */}
          <div className={`
            absolute left-0 top-0 w-1/2 h-full bg-black/20 backdrop-blur-sm
            transition-transform duration-1000 ease-out
            ${showMainContent ? 'transform translate-x-0' : 'transform -translate-x-full'}
          `}>
            <div className="h-full flex items-center justify-center">
              <div className="text-center p-8">
                <h2 className="text-3xl font-bold text-white mb-6">Submit Signature</h2>
                <Link
                  to="/signature-form"
                  onClick={() => setShowMainContent(false)}
                  className="inline-block px-8 py-4 bg-white text-gray-800 font-bold rounded-xl hover:bg-gray-100 transition-colors text-lg shadow-lg"
                >
                  Click Here
                </Link>
              </div>
            </div>
          </div>

          {/* Right panel */}
          <div className={`
            absolute right-0 top-0 w-1/2 h-full bg-black/20 backdrop-blur-sm
            transition-transform duration-1000 ease-out
            ${showMainContent ? 'transform translate-x-0' : 'transform translate-x-full'}
          `}>
            <div className="h-full flex items-center justify-center">
              <div className="text-center p-8">
                <h2 className="text-3xl font-bold text-white mb-6">View Signature Board</h2>
                <Link
                  to="/gallery"
                  className="inline-block px-8 py-4 bg-white text-gray-800 font-bold rounded-xl hover:bg-gray-100 transition-colors text-lg shadow-lg"
                >
                  Open Gallery
                </Link>
              </div>
            </div>
          </div>

          {/* Close button */}
          <button
            onClick={() => setShowMainContent(false)}
            className="absolute top-8 right-8 w-12 h-12 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center text-white text-xl transition-colors"
          >
            ×
          </button>
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
