import React from 'react'
import { Link, useLocation } from 'react-router-dom'

const Navigation = ({ showAdminLink = false }) => {
  const location = useLocation()
  
  const navItems = [
    { path: '/', label: 'Ký tên', icon: '✍️' },
    { path: '/gallery', label: 'Bảng chữ ký', icon: '🖼️' },
    { path: '/history', label: 'Lịch sử', icon: '📋' },
  ]

  // Chỉ hiển thị link admin nếu được yêu cầu (ẩn mặc định)
  if (showAdminLink) {
    navItems.push({ path: '/admin', label: 'Admin', icon: '⚙️' })
  }

  return (
    <nav className="glass rounded-2xl p-4 mb-6">
      <div className="flex flex-wrap justify-center gap-4">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`
              flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all duration-300
              ${location.pathname === item.path
                ? 'bg-white text-gray-800 shadow-lg transform scale-105'
                : 'text-white hover:bg-white/20 hover:scale-105'
              }
            `}
          >
            <span className="text-lg">{item.icon}</span>
            <span>{item.label}</span>
          </Link>
        ))}
      </div>
    </nav>
  )
}

export default Navigation
