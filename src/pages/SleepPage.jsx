import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

function SleepPage() {
  const [isWakingUp, setIsWakingUp] = useState(false)
  const [currentQuote, setCurrentQuote] = useState('')
  const [quoteVisible, setQuoteVisible] = useState(true)
  const navigate = useNavigate()

  // Danh sách các câu kỷ niệm thanh xuân
  const youthQuotes = [
    "Tuổi học trò là những trang sách đẹp nhất trong cuốn nhật ký cuộc đời.",
    "Những giấc mơ tuổi 17 luôn trong trẻo và đầy hy vọng.",
    "Thời gian cấp 3 là khi chúng ta tin rằng mình có thể chinh phục cả thế giới.",
    "Những buổi chiều tan học, áo trắng bay trong gió, là ký ức đẹp nhất.",
    "Tuổi trẻ là khi ta dám mơ những giấc mơ lớn nhất.",
    "Lớp 12A - nơi những tình bạn đẹp nhất được viết nên.",
    "Những giờ học cuối cùng, những kỷ niệm không bao giờ phai mờ.",
    "Tuổi học sinh là khi ta tin vào phép màu của những ước mơ.",
    "Thanh xuân là những ngày ta cười nhiều hơn khóc.",
    "Thời gian cấp 3 ngắn ngủi nhưng để lại dấu ấn cả đời.",
    "Những buổi sáng đến trường với nụ cười tươi nhất.",
    "Tuổi 17 - khi mọi thứ đều có thể và không gì là không thể.",
    "Lớp học là nơi ta học cách yêu thương và chia sẻ.",
    "Những giấc ngủ trưa ngọt ngào nhất của tuổi học trò.",
    "Thanh xuân là khi ta dám tin vào tình bạn vĩnh cửu.",
    "Thời gian cấp 3 - khi ta viết những câu thơ đầu đời.",
    "Tuổi học sinh là khi ta tin rằng tình yêu sẽ mãi mãi.",
    "Những buổi chiều học bài cùng bạn bè thân thiết.",
    "Lớp 12A - nơi những ký ức đẹp nhất được lưu giữ.",
    "Tuổi trẻ là khi ta dám ước mơ về một tương lai rực rỡ.",
    "Ba năm cấp 3 như một cuốn phim đẹp, mỗi khung hình đều đáng nhớ.",
    "Những tiếng cười trong giờ ra chơi vang mãi trong tim.",
    "Tuổi học trò - khi ta tin rằng mình sẽ thay đổi thế giới.",
    "Những buổi tối làm bài tập cùng nhau qua điện thoại.",
    "Lớp 12A - nơi những câu chuyện đẹp nhất bắt đầu."
  ]

  // Chọn câu ngẫu nhiên khi component mount và mỗi 5 giây
  useEffect(() => {
    const getRandomQuote = () => {
      const randomIndex = Math.floor(Math.random() * youthQuotes.length)
      return youthQuotes[randomIndex]
    }

    // Chọn câu đầu tiên
    setCurrentQuote(getRandomQuote())

    // Thay đổi câu mỗi 5 giây với hiệu ứng fade
    const interval = setInterval(() => {
      setQuoteVisible(false) // Fade out

      setTimeout(() => {
        setCurrentQuote(getRandomQuote()) // Đổi câu
        setQuoteVisible(true) // Fade in
      }, 500) // Đợi 0.5s để fade out hoàn thành
    }, 5000)

    return () => clearInterval(interval)
  }, [])

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
                  <span className="font-bold tracking-wide">Tiếp tục</span>
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-purple-400/20 to-pink-400/20 rounded-3xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </button>
            ) : (
              <div className="flex justify-center">
                <div className="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
              </div>
            )}

            {/* Memories */}
            <div className="mt-12 glass rounded-2xl p-6 border border-purple-500/30">
              <h3 className="text-white font-bold text-lg mb-4 flex items-center justify-center gap-2">
                <div className="w-2 h-2 bg-cyan-500 rounded-full neon-pulse"></div>
                Kỷ niệm thanh xuân
                <div className="w-2 h-2 bg-cyan-500 rounded-full neon-pulse"></div>
              </h3>
              <div className="relative min-h-[80px] flex items-center justify-center">
                <p className={`text-cyan-200 text-base leading-relaxed text-center italic transition-all duration-500 ease-in-out transform ${
                  quoteVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
                }`}>
                  "{currentQuote}"
                </p>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  )
}

export default SleepPage
