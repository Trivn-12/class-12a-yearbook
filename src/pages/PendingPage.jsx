import { Link } from 'react-router-dom'

function PendingPage() {
  return (
    <div className="min-h-screen bg-gradient-1 transition-all duration-500 relative">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 bg-white/5 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute top-40 right-20 w-24 h-24 bg-white/10 rounded-full blur-lg animate-bounce"></div>
        <div className="absolute bottom-32 left-1/4 w-40 h-40 bg-white/5 rounded-full blur-2xl animate-pulse delay-1000"></div>
        
        {/* Floating elements */}
        <div className="absolute top-1/4 left-1/3 text-white/20 text-4xl animate-bounce delay-500">⏳</div>
        <div className="absolute top-1/3 right-1/4 text-white/15 text-3xl animate-bounce delay-1000">📝</div>
      </div>

      <div className="container mx-auto px-4 py-8 relative z-10 flex items-center justify-center min-h-screen">
        <div className="max-w-2xl mx-auto text-center">
          
          {/* Main Content */}
          <div className="glass rounded-3xl p-8 md:p-12 shadow-2xl neon-hover fade-in">
            
            {/* Success Icon - Removed */}

            {/* Main Message */}
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6 leading-relaxed">
              <span className="neon-pulse">Đã gửi thành công!</span>
            </h1>

            {/* Subtitle */}
            <p className="text-white/80 text-lg md:text-xl mb-8 leading-relaxed">
              Cảm ơn bạn đã tham gia! Nội dung của bạn đang chờ admin duyệt.
            </p>

            {/* Status Card */}
            <div className="glass rounded-2xl p-6 border-2 border-yellow-500/30 mb-8">
              <div className="flex items-center justify-center gap-3 mb-4">
                <div className="w-3 h-3 bg-yellow-500 rounded-full neon-pulse"></div>
                <h3 className="text-yellow-300 font-bold text-xl">Trạng thái: Chờ duyệt</h3>
                <div className="w-3 h-3 bg-yellow-500 rounded-full neon-pulse"></div>
              </div>
              <p className="text-yellow-200 text-sm">
                Admin sẽ xem xét và duyệt nội dung của bạn trong thời gian sớm nhất.
              </p>
            </div>

            {/* Decorative Line */}
            <div className="w-32 h-1 bg-gradient-to-r from-purple-500 to-pink-500 mx-auto rounded-full neon-pulse mb-8"></div>

            {/* Action Buttons */}
            <div className="space-y-4">
              <Link
                to="/gallery"
                className="group relative inline-block px-8 py-4 neon-button text-white font-bold text-lg rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-2xl overflow-hidden"
                style={{ 
                  background: '#8b5cf6',
                  boxShadow: '0 0 30px rgba(139, 92, 246, 0.6)'
                }}
              >
                <span className="relative z-10 flex items-center justify-center gap-3">
                  <span className="text-xl">🖼️</span>
                  <span className="font-bold tracking-wide">Xem Gallery</span>
                </span>
              </Link>

              <div className="text-white/60 text-sm">hoặc</div>

              <Link
                to="/"
                className="group relative inline-block px-8 py-4 glass border-2 border-purple-500/30 text-white font-bold text-lg rounded-2xl transition-all duration-300 transform hover:scale-105 hover:bg-purple-500/20"
              >
                <span className="relative z-10 flex items-center justify-center gap-3">
                  <span className="text-xl">🏠</span>
                  <span className="font-bold tracking-wide">Về trang chủ</span>
                </span>
              </Link>
            </div>

            {/* Info Box */}
            <div className="mt-12 glass rounded-2xl p-6 border border-cyan-500/30">
              <h3 className="text-white font-bold text-lg mb-4 flex items-center justify-center gap-2">
                <div className="w-2 h-2 bg-cyan-500 rounded-full neon-pulse"></div>
                Thông tin thêm
                <div className="w-2 h-2 bg-cyan-500 rounded-full neon-pulse"></div>
              </h3>
              <div className="text-cyan-200 text-sm space-y-2">
                <p>• Bạn có thể xem trạng thái tại trang History</p>
                <p>• Nội dung sẽ xuất hiện trong Gallery sau khi được duyệt</p>
                <p>• Mỗi người có thể chia sẻ nhiều nội dung khác nhau</p>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  )
}

export default PendingPage
