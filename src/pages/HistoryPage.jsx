import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { DataManager } from '../utils/dataManager'

const HistoryPage = () => {
  const [allSignatures, setAllSignatures] = useState([])
  const [filteredSignatures, setFilteredSignatures] = useState([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({
    status: 'all', // 'all', 'approved', 'pending', 'rejected'
    type: 'all', // 'all', 'student', 'teacher'
    search: ''
  })

  useEffect(() => {
    loadAllSignatures()
  }, [])

  useEffect(() => {
    applyFilters()
  }, [allSignatures, filters])

  const loadAllSignatures = async () => {
    try {
      const data = await DataManager.loadData()
      
      // Kết hợp tất cả chữ ký từ các nguồn khác nhau
      const approved = (data.signatures || []).map(s => ({ ...s, status: 'approved' }))
      const pending = (data.pendingSignatures || []).map(s => ({ ...s, status: 'pending' }))
      
      // Lấy từ localStorage các chữ ký đã bị từ chối (nếu có)
      const rejectedData = localStorage.getItem('rejectedSignatures')
      const rejected = rejectedData ? JSON.parse(rejectedData) : []
      
      const combined = [...approved, ...pending, ...rejected]
      
      // Sắp xếp theo thời gian (mới nhất trước)
      combined.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
      
      setAllSignatures(combined)
    } catch (error) {
      console.error('Lỗi khi tải lịch sử:', error)
    } finally {
      setLoading(false)
    }
  }

  const applyFilters = () => {
    let filtered = [...allSignatures]

    // Lọc theo trạng thái
    if (filters.status !== 'all') {
      filtered = filtered.filter(s => s.status === filters.status)
    }

    // Lọc theo loại người ký
    if (filters.type !== 'all') {
      filtered = filtered.filter(s => s.type === filters.type)
    }

    // Tìm kiếm theo tên
    if (filters.search.trim()) {
      filtered = filtered.filter(s => 
        s.name.toLowerCase().includes(filters.search.toLowerCase())
      )
    }

    setFilteredSignatures(filtered)
  }

  const getSignatureImage = (signatureId) => {
    return DataManager.getSignatureImage(signatureId)
  }

  const getStatusInfo = (status) => {
    switch (status) {
      case 'approved':
        return { text: 'Đã duyệt', color: 'bg-green-500/20 text-green-300', icon: '✅' }
      case 'pending':
        return { text: 'Chờ duyệt', color: 'bg-yellow-500/20 text-yellow-300', icon: '⏳' }
      case 'rejected':
        return { text: 'Từ chối', color: 'bg-red-500/20 text-red-300', icon: '❌' }
      default:
        return { text: 'Không xác định', color: 'bg-gray-500/20 text-gray-300', icon: '❓' }
    }
  }

  const getTypeInfo = (type) => {
    return type === 'student' 
      ? { text: 'Học sinh', icon: '🎓', color: 'text-blue-300' }
      : { text: 'Giáo viên', icon: '👨‍🏫', color: 'text-red-300' }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 to-purple-900 flex items-center justify-center">
        <div className="text-white text-xl">⏳ Đang tải...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 to-purple-900 relative">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 bg-purple-500/10 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute top-40 right-20 w-24 h-24 bg-indigo-500/10 rounded-full blur-lg animate-bounce"></div>
        <div className="absolute bottom-32 left-1/4 w-40 h-40 bg-purple-500/5 rounded-full blur-2xl animate-pulse delay-1000"></div>
      </div>

      <div className="container mx-auto px-4 py-8 relative z-10">
        {/* Header với animation */}
        <div className="text-center mb-8 fade-in">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-4" style={{ fontFamily: 'serif', textShadow: '0 0 20px rgba(255,255,255,0.3)' }}>
            12A
          </h1>
          <p className="text-white/80 text-lg">Signature History</p>
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
            <Link
              to="/gallery"
              className="group flex items-center gap-3 px-6 py-3 rounded-xl font-medium text-white hover:bg-white/20 transition-all duration-300 hover:scale-105"
            >
              <span>Gallery</span>
            </Link>
            <div className="flex items-center gap-3 px-6 py-3 rounded-xl font-medium bg-white text-gray-800 shadow-lg transform scale-105">
              <span>History</span>
            </div>
          </div>
        </nav>

        {/* Header Section */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-3 bg-purple-500/20 border border-purple-400/30 rounded-2xl px-8 py-4 backdrop-blur-sm">
            <div>
              <h2 className="text-2xl font-bold text-white">Signature History</h2>
              <p className="text-purple-200">Track all signature activities</p>
            </div>
          </div>
        </div>



        {/* Content Layout */}
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">

            {/* Left Sidebar - Enhanced Filters */}
            <div className="lg:col-span-1">
              <div className="glass rounded-2xl p-6 shadow-2xl neon-hover mb-6">
                <h3 className="text-white font-bold text-lg mb-4 flex items-center gap-2">
                  <div className="w-2 h-2 bg-purple-500 rounded-full neon-pulse"></div>
                  Advanced Filters
                </h3>

                <div className="space-y-4">
                  <div>
                    <label className="block text-white text-sm font-medium mb-2">Search Name:</label>
                    <input
                      type="text"
                      value={filters.search}
                      onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                      className="w-full px-3 py-2 bg-black/20 border border-purple-500/30 rounded-lg text-white placeholder-purple-300/70 focus:border-purple-400 focus:outline-none"
                      placeholder="Enter name..."
                    />
                  </div>

                  <div>
                    <label className="block text-white text-sm font-medium mb-2">Status:</label>
                    <select
                      value={filters.status}
                      onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
                      className="w-full px-3 py-2 bg-black/20 border border-purple-500/30 rounded-lg text-white focus:border-purple-400 focus:outline-none"
                    >
                      <option value="all">All Status</option>
                      <option value="approved">Approved</option>
                      <option value="pending">Pending</option>
                      <option value="rejected">Rejected</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-white text-sm font-medium mb-2">Type:</label>
                    <select
                      value={filters.type}
                      onChange={(e) => setFilters(prev => ({ ...prev, type: e.target.value }))}
                      className="w-full px-3 py-2 bg-black/20 border border-purple-500/30 rounded-lg text-white focus:border-purple-400 focus:outline-none"
                    >
                      <option value="all">All Types</option>
                      <option value="student">Students</option>
                      <option value="teacher">Teachers</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Summary Stats */}
              <div className="glass rounded-2xl p-6 shadow-2xl neon-hover">
                <h3 className="text-white font-bold text-lg mb-4 flex items-center gap-2">
                  <div className="w-2 h-2 bg-cyan-500 rounded-full neon-pulse"></div>
                  Results Summary
                </h3>

                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-purple-300">Showing:</span>
                    <span className="text-white font-bold">{filteredSignatures.length}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Total:</span>
                    <span className="text-white font-bold">{allSignatures.length}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Main Content Area */}
            <div className="lg:col-span-3">
              <div className="glass rounded-2xl p-6 shadow-2xl neon-hover">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-white font-bold text-xl flex items-center gap-2">
                    <div className="w-2 h-2 bg-pink-500 rounded-full neon-pulse"></div>
                    Activity Timeline
                  </h3>

                  {/* View Options */}
                  <div className="flex items-center gap-3">
                    <button className="px-4 py-2 neon-button rounded-lg text-white text-sm font-bold">
                      Timeline View
                    </button>
                    <button className="px-4 py-2 glass border border-purple-500/30 rounded-lg text-white text-sm font-bold hover:bg-purple-500/20 transition-all">
                      Table View
                    </button>
                  </div>
                </div>

                {filteredSignatures.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-purple-300 text-lg font-medium">
                      {allSignatures.length === 0
                        ? 'No activity recorded yet!'
                        : 'No results match your filters!'
                      }
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4 max-h-[600px] overflow-y-auto">
                    {filteredSignatures.map((signature, index) => {
                      const statusInfo = getStatusInfo(signature.status)
                      const typeInfo = getTypeInfo(signature.type)

                      return (
                        <div
                          key={signature.id}
                          className={`
                            relative p-6 rounded-xl border-2 transition-all duration-200 neon-hover
                            ${signature.status === 'approved'
                              ? 'border-green-400/50 bg-green-500/10'
                              : signature.status === 'rejected'
                              ? 'border-red-400/50 bg-red-500/10'
                              : 'border-yellow-400/50 bg-yellow-500/10'
                            }
                          `}
                        >
                          {/* Timeline connector */}
                          {index < filteredSignatures.length - 1 && (
                            <div className="absolute left-8 top-20 w-0.5 h-8 bg-purple-500/30"></div>
                          )}

                          <div className="flex items-center gap-6">
                            {/* Status Icon */}
                            <div className={`
                              w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold
                              ${signature.status === 'approved'
                                ? 'bg-green-500/20 text-green-300'
                                : signature.status === 'rejected'
                                ? 'bg-red-500/20 text-red-300'
                                : 'bg-yellow-500/20 text-yellow-300'
                              }
                            `}>
                              {statusInfo.icon}
                            </div>

                            {/* Signature Preview */}
                            <div className="w-24 h-14 bg-white/90 rounded-lg border-2 border-purple-500/30 flex items-center justify-center">
                              {getSignatureImage(signature.id) ? (
                                <img
                                  src={getSignatureImage(signature.id)}
                                  alt={`Signature of ${signature.name}`}
                                  className="max-w-full max-h-full object-contain"
                                />
                              ) : (
                                <span className="text-xs text-gray-400">No img</span>
                              )}
                            </div>

                            {/* Details */}
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                <h3 className="text-white font-bold text-lg">{signature.name}</h3>
                                <span className={`px-3 py-1 rounded-full text-xs font-bold ${typeInfo.color}`}>
                                  {typeInfo.text}
                                </span>
                              </div>
                              <p className="text-gray-300 text-sm">
                                Submitted on {new Date(signature.timestamp).toLocaleDateString('en-US', {
                                  year: 'numeric',
                                  month: 'long',
                                  day: 'numeric',
                                  hour: '2-digit',
                                  minute: '2-digit'
                                })}
                              </p>
                            </div>

                            {/* Status Badge */}
                            <div className={`px-4 py-2 rounded-xl text-sm font-bold ${statusInfo.color}`}>
                              {statusInfo.text}
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  )
}

export default HistoryPage
