import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

function SleepPage() {
  const [isWakingUp, setIsWakingUp] = useState(false)
  const navigate = useNavigate()

  const handleWakeUp = () => {
    setIsWakingUp(true)
    
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
        
        {/* Floating elements for youth memories */}
        <div className="absolute top-1/4 left-1/3 text-white/20 text-5xl animate-bounce delay-500">🌸</div>
        <div className="absolute top-1/3 right-1/4 text-white/15 text-4xl animate-bounce delay-1000">📚</div>
        <div className="absolute bottom-1/3 left-1/5 text-white/10 text-5xl animate-bounce delay-1500">🎓</div>
        <div className="absolute top-1/2 right-1/5 text-white/15 text-3xl animate-bounce delay-2000">💭</div>
      </div>

      <div className="container mx-auto px-4 py-8 relative z-10 flex items-center justify-center min-h-screen">
        <div className="max-w-2xl mx-auto text-center">
          
          {/* Main Content */}
          <div className="glass rounded-3xl p-8 md:p-12 shadow-2xl neon-hover fade-in">
            
            {/* Sleep Icon - Removed */}

            {/* Main Message */}
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6 leading-relaxed">
              <span className="neon-pulse">Thanh xuân dưới mái trường</span>
              <br />
              <span className="text-purple-300">như giấc ngủ trưa thật thú vị</span>
            </h1>

            {/* Subtitle */}
            <p className="text-white/80 text-lg md:text-xl mb-8 leading-relaxed">
              Ba năm cấp 3 trôi qua như một giấc mơ đẹp, ngọt ngào và đáng nhớ...
            </p>

            {/* Decorative Line */}
            <div className="w-32 h-1 bg-gradient-to-r from-purple-500 to-pink-500 mx-auto rounded-full neon-pulse mb-8"></div>

            {/* Wake Up Button */}
            {!isWakingUp ? (
              <button
                onClick={handleWakeUp}
                className="group relative px-12 py-6 neon-button text-white font-bold text-xl rounded-3xl transition-all duration-300 transform hover:scale-105 shadow-2xl overflow-hidden"
                style={{ 
                  background: '#8b5cf6',
                  boxShadow: '0 0 30px rgba(139, 92, 246, 0.6)'
                }}
              >
                <span className="relative z-10 flex items-center justify-center">
                  <span className="font-bold tracking-wide">Tỉnh giấc</span>
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-purple-400/20 to-pink-400/20 rounded-3xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </button>
            ) : (
              <div className="space-y-4">
                <div className="text-6xl animate-bounce">
                  😊
                </div>
                <p className="text-white text-xl font-bold animate-pulse">
                  Đang tỉnh giấc từ những kỷ niệm đẹp...
                </p>
                <div className="flex justify-center">
                  <div className="w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
                </div>
              </div>
            )}

            {/* Memories */}
            <div className="mt-12 glass rounded-2xl p-6 border border-purple-500/30">
              <h3 className="text-white font-bold text-lg mb-4 flex items-center justify-center gap-2">
                <div className="w-2 h-2 bg-cyan-500 rounded-full neon-pulse"></div>
                Kỷ niệm thanh xuân
                <div className="w-2 h-2 bg-cyan-500 rounded-full neon-pulse"></div>
              </h3>
              <p className="text-cyan-200 text-sm leading-relaxed">
                Những năm tháng cấp 3 như giấc ngủ trưa ngọt ngào - đầy ắp tiếng cười,
                tình bạn chân thành và những ước mơ tuổi trẻ. Thời gian tuy ngắn nhưng để lại
                dấu ấn sâu đậm trong trái tim mỗi người! 🌸✨
              </p>
            </div>

          </div>
        </div>
      </div>
    </div>
  )
}

export default SleepPage
