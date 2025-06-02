import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

function ThankYouPage() {
  const [isConfirming, setIsConfirming] = useState(false)
  const navigate = useNavigate()

  const handleConfirm = () => {
    setIsConfirming(true)
    
    // Sau 2 giây sẽ chuyển đến trang chờ duyệt
    setTimeout(() => {
      navigate('/pending')
    }, 2000)
  }

  return (
    <div className="min-h-screen bg-gradient-1 transition-all duration-500 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 bg-white/5 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute top-40 right-20 w-24 h-24 bg-white/10 rounded-full blur-lg animate-bounce"></div>
        <div className="absolute bottom-32 left-1/4 w-40 h-40 bg-white/5 rounded-full blur-2xl animate-pulse delay-1000"></div>
        
        {/* Floating hearts for gratitude */}
        <div className="absolute top-1/4 left-1/3 text-white/20 text-5xl animate-bounce delay-500">💖</div>
        <div className="absolute top-1/3 right-1/4 text-white/15 text-4xl animate-bounce delay-1000">🌟</div>
        <div className="absolute bottom-1/3 left-1/5 text-white/10 text-5xl animate-bounce delay-1500">🙏</div>
        <div className="absolute top-1/2 right-1/3 text-white/20 text-3xl animate-bounce delay-2000">📚</div>
      </div>

      <div className="container mx-auto px-4 py-8 relative z-10 flex items-center justify-center min-h-screen">
        <div className="max-w-3xl mx-auto text-center">
          
          {/* Main Content */}
          <div className="glass rounded-3xl p-8 md:p-12 shadow-2xl neon-hover fade-in">
            


            {/* Main Message */}
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-8 leading-relaxed">
              <span className="neon-pulse text-pink-300">Cảm ơn thầy/cô rất nhiều</span>
              <br />
              <span className="text-white">vì đã giúp em/chúng em</span>
              <br />
              <span className="text-purple-300">học tốt</span>
            </h1>

            {/* Subtitle */}
            <p className="text-white/80 text-lg md:text-xl mb-8 leading-relaxed">
              Sự tận tâm và kiến thức quý báu của thầy/cô đã giúp chúng em trưởng thành
            </p>

            {/* Decorative Line */}
            <div className="w-32 h-1 bg-gradient-to-r from-pink-500 to-purple-500 mx-auto rounded-full neon-pulse mb-8"></div>

            {/* Confirm Button */}
            {!isConfirming ? (
              <button
                onClick={handleConfirm}
                className="group relative px-12 py-6 neon-button text-white font-bold text-xl rounded-3xl transition-all duration-300 transform hover:scale-105 shadow-2xl overflow-hidden"
                style={{ 
                  background: '#ec4899',
                  boxShadow: '0 0 30px rgba(236, 72, 153, 0.6)'
                }}
              >
                <span className="relative z-10 flex items-center justify-center gap-4">
                  <span className="text-2xl">✅</span>
                  <span className="font-bold tracking-wide">Xác nhận</span>
                  <span className="text-2xl">✅</span>
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-pink-400/20 to-purple-400/20 rounded-3xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </button>
            ) : (
              <div className="space-y-4">
                <div className="text-6xl animate-bounce">
                  💝
                </div>
                <p className="text-white text-xl font-bold animate-pulse">
                  Đang xử lý...
                </p>
                <div className="flex justify-center">
                  <div className="w-8 h-8 border-4 border-pink-500 border-t-transparent rounded-full animate-spin"></div>
                </div>
              </div>
            )}

            {/* Appreciation Cards */}
            <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="glass rounded-2xl p-6 border border-pink-500/30">
                <div className="text-4xl mb-3">📖</div>
                <h3 className="text-white font-bold mb-2">Kiến thức</h3>
                <p className="text-pink-200 text-sm">
                  Cảm ơn thầy/cô đã truyền đạt kiến thức quý báu
                </p>
              </div>
              
              <div className="glass rounded-2xl p-6 border border-purple-500/30">
                <div className="text-4xl mb-3">💡</div>
                <h3 className="text-white font-bold mb-2">Trí tuệ</h3>
                <p className="text-purple-200 text-sm">
                  Cảm ơn thầy/cô đã mở mang tầm nhìn cho chúng em
                </p>
              </div>
              
              <div className="glass rounded-2xl p-6 border border-cyan-500/30">
                <div className="text-4xl mb-3">❤️</div>
                <h3 className="text-white font-bold mb-2">Tình thương</h3>
                <p className="text-cyan-200 text-sm">
                  Cảm ơn thầy/cô đã quan tâm và yêu thương học trò
                </p>
              </div>
            </div>

            {/* Quote */}
            <div className="mt-12 glass rounded-2xl p-6 border border-yellow-500/30">
              <div className="text-4xl mb-4">✨</div>
              <p className="text-yellow-200 text-lg italic leading-relaxed">
                "Một người thầy tốt có thể thay đổi cuộc đời của một học sinh"
              </p>
              <p className="text-yellow-300/70 text-sm mt-2">
                - Lời tri ân từ học trò
              </p>
            </div>

          </div>
        </div>
      </div>
    </div>
  )
}

export default ThankYouPage
