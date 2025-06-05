import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { DataManager } from '../utils/dataManager'

const AdminPage = () => {
  const [pendingSignatures, setPendingSignatures] = useState([])
  const [pendingMemories, setPendingMemories] = useState([])
  const [approvedSignatures, setApprovedSignatures] = useState([])
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState('')
  const [activeTab, setActiveTab] = useState('pending-signatures')
  const [editingSignature, setEditingSignature] = useState(null)
  const [editForm, setEditForm] = useState({ name: '', type: 'student' })

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setLoading(true)
      console.log('Admin: Đang tải dữ liệu...')
      const data = await DataManager.loadData()
      console.log('Admin: Dữ liệu đã tải:', data)
      setPendingSignatures(data.pendingSignatures || [])
      setPendingMemories(data.pendingMemories || [])
      setApprovedSignatures(data.signatures || [])
    } catch (error) {
      console.error('Lỗi khi tải dữ liệu:', error)
      setMessage('❌ Không thể tải dữ liệu')
    } finally {
      setLoading(false)
    }
  }

  const handleApprove = async (signatureId) => {
    try {
      const success = await DataManager.approveSignature(signatureId)
      if (success) {
        setMessage('✅ Đã duyệt chữ ký thành công!')
        loadData()
      } else {
        setMessage('❌ Không thể duyệt chữ ký')
      }
    } catch (error) {
      console.error('Lỗi khi duyệt chữ ký:', error)
      setMessage('❌ Có lỗi xảy ra khi duyệt chữ ký')
    }
  }

  const handleReject = async (signatureId) => {
    try {
      const success = await DataManager.rejectSignature(signatureId)
      if (success) {
        setMessage('✅ Đã từ chối chữ ký!')
        loadData()
      } else {
        setMessage('❌ Không thể từ chối chữ ký')
      }
    } catch (error) {
      console.error('Lỗi khi từ chối chữ ký:', error)
      setMessage('❌ Có lỗi xảy ra khi từ chối chữ ký')
    }
  }

  const handleDelete = async (signatureId) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa chữ ký này?')) {
      return
    }

    try {
      const success = await DataManager.deleteSignature(signatureId)
      if (success) {
        setMessage('✅ Đã xóa chữ ký thành công!')
        loadData()
      } else {
        setMessage('❌ Không thể xóa chữ ký')
      }
    } catch (error) {
      console.error('Lỗi khi xóa chữ ký:', error)
      setMessage('❌ Có lỗi xảy ra khi xóa chữ ký')
    }
  }

  const handleEdit = (signature) => {
    setEditingSignature(signature.id)
    setEditForm({ name: signature.name, type: signature.type })
  }

  const handleSaveEdit = async () => {
    try {
      const success = await DataManager.updateSignature(editingSignature, editForm)
      if (success) {
        setMessage('✅ Đã cập nhật chữ ký thành công!')
        setEditingSignature(null)
        loadData()
      } else {
        setMessage('❌ Không thể cập nhật chữ ký')
      }
    } catch (error) {
      console.error('Lỗi khi cập nhật chữ ký:', error)
      setMessage('❌ Có lỗi xảy ra khi cập nhật chữ ký')
    }
  }

  const handleCancelEdit = () => {
    setEditingSignature(null)
    setEditForm({ name: '', type: 'student' })
  }

  const handleApproveMemory = async (memoryId) => {
    try {
      const success = await DataManager.approveMemory(memoryId)
      if (success) {
        setMessage('✅ Đã duyệt ảnh kỷ niệm thành công!')
        loadData()
      } else {
        setMessage('❌ Không thể duyệt ảnh kỷ niệm')
      }
    } catch (error) {
      console.error('Lỗi khi duyệt ảnh kỷ niệm:', error)
      setMessage('❌ Có lỗi xảy ra khi duyệt ảnh kỷ niệm')
    }
  }

  const handleRejectMemory = async (memoryId) => {
    try {
      const success = await DataManager.rejectMemory(memoryId)
      if (success) {
        setMessage('✅ Đã từ chối ảnh kỷ niệm!')
        loadData()
      } else {
        setMessage('❌ Không thể từ chối ảnh kỷ niệm')
      }
    } catch (error) {
      console.error('Lỗi khi từ chối ảnh kỷ niệm:', error)
      setMessage('❌ Có lỗi xảy ra khi từ chối ảnh kỷ niệm')
    }
  }

  const getSignatureImage = (signatureId) => {
    return DataManager.getSignatureImage(signatureId)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-700 flex items-center justify-center">
        <div className="text-white text-xl">⏳ Đang tải...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-700 relative">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 bg-red-500/10 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute top-40 right-20 w-24 h-24 bg-orange-500/10 rounded-full blur-lg animate-bounce"></div>
        <div className="absolute bottom-32 left-1/4 w-40 h-40 bg-red-500/5 rounded-full blur-2xl animate-pulse delay-1000"></div>
      </div>

      <div className="container mx-auto px-4 py-8 relative z-10">
        {/* Header với animation */}
        <div className="text-center mb-8 fade-in">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-4" style={{ fontFamily: 'serif', textShadow: '0 0 20px rgba(255,255,255,0.3)' }}>
            AK25
          </h1>
          <p className="text-white/80 text-lg">Signature Administration</p>
        </div>

        {/* Navigation */}
        <nav className="glass-dark rounded-2xl p-6 mb-8 slide-in">
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
            <Link
              to="/history"
              className="group flex items-center gap-3 px-6 py-3 rounded-xl font-medium text-white hover:bg-white/20 transition-all duration-300 hover:scale-105"
            >
              <span>History</span>
            </Link>
            <div className="flex items-center gap-3 px-6 py-3 rounded-xl font-medium bg-red-600 text-white shadow-lg transform scale-105">
              <span>Admin</span>
            </div>
          </div>
        </nav>

        {/* Admin Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-3 bg-red-500/20 border border-red-400/30 rounded-2xl px-8 py-4 backdrop-blur-sm mb-6">
            <div>
              <h2 className="text-2xl font-bold text-white">Administration Panel</h2>
              <p className="text-red-200">Review pending signatures</p>
            </div>
          </div>
          <button
            onClick={loadData}
            className="group px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-all duration-300 hover:scale-105 shadow-lg"
          >
            <span className="flex items-center gap-2">
              🔄 Reload Data
            </span>
          </button>
        </div>

        {/* Message */}
        {message && (
          <div className="max-w-2xl mx-auto mb-6">
            <div className="glass-dark rounded-xl p-4 text-center">
              <p className="text-white font-medium">{message}</p>
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="max-w-6xl mx-auto mb-8">
          <div className="flex justify-center">
            <div className="glass-dark rounded-2xl p-2 inline-flex flex-wrap gap-1">
              <button
                onClick={() => setActiveTab('pending-signatures')}
                className={`px-4 py-3 rounded-xl font-medium transition-all duration-300 text-sm ${
                  activeTab === 'pending-signatures'
                    ? 'bg-yellow-600 text-white shadow-lg'
                    : 'text-white hover:bg-white/10'
                }`}
              >
                ✍️ Chữ ký ({pendingSignatures.length})
              </button>
              <button
                onClick={() => setActiveTab('pending-memories')}
                className={`px-4 py-3 rounded-xl font-medium transition-all duration-300 text-sm ${
                  activeTab === 'pending-memories'
                    ? 'bg-orange-600 text-white shadow-lg'
                    : 'text-white hover:bg-white/10'
                }`}
              >
                Kỷ niệm ({pendingMemories.length})
              </button>
              <button
                onClick={() => setActiveTab('approved')}
                className={`px-4 py-3 rounded-xl font-medium transition-all duration-300 text-sm ${
                  activeTab === 'approved'
                    ? 'bg-green-600 text-white shadow-lg'
                    : 'text-white hover:bg-white/10'
                }`}
              >
                ✅ Đã duyệt ({approvedSignatures.length})
              </button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-6xl mx-auto">
          {activeTab === 'pending-signatures' ? (
            <div className="glass-dark rounded-2xl p-6">
              <h2 className="text-2xl font-bold text-white mb-6 text-center">
                ✍️ Chữ ký chờ duyệt ({pendingSignatures.length})
              </h2>

            {pendingSignatures.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-300 text-lg">
                  🎉 Không có chữ ký nào chờ duyệt!
                </p>
              </div>
            ) : (
              <div className="grid gap-6">
                {pendingSignatures.map((signature) => (
                  <div
                    key={signature.id}
                    className="bg-white/10 rounded-xl p-6 border border-white/20"
                  >
                    <div className="flex flex-col md:flex-row gap-6 items-center">
                      {/* Thông tin */}
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-white mb-2">
                          {signature.name}
                        </h3>
                        <div className="flex items-center gap-4 text-gray-300">
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                            signature.type === 'student' 
                              ? 'bg-blue-500/20 text-blue-300' 
                              : 'bg-red-500/20 text-red-300'
                          }`}>
                            {signature.type === 'student' ? '🎓 Học sinh' : '👨‍🏫 Giáo viên'}
                          </span>
                          <span className="text-sm">
                            📅 {new Date(signature.timestamp).toLocaleString('vi-VN')}
                          </span>
                        </div>
                      </div>

                      {/* Chữ ký */}
                      <div className="flex-shrink-0">
                        {(() => {
                          const imageData = getSignatureImage(signature.id)
                          console.log(`Admin: Hiển thị ảnh cho ${signature.name} (ID: ${signature.id}):`, !!imageData)

                          return imageData ? (
                            <img
                              src={imageData}
                              alt={`Chữ ký của ${signature.name}`}
                              className="w-48 h-24 object-contain bg-white rounded-lg border-2 border-gray-300"
                              onError={(e) => {
                                console.error('Admin: Lỗi load ảnh:', e)
                                e.target.style.display = 'none'
                              }}
                            />
                          ) : (
                            <div className="w-48 h-24 bg-gray-200 rounded-lg flex items-center justify-center">
                              <span className="text-gray-500">Không có ảnh (ID: {signature.id})</span>
                            </div>
                          )
                        })()}
                      </div>

                      {/* Actions */}
                      <div className="flex flex-col gap-2">
                        <button
                          onClick={() => handleApprove(signature.id)}
                          className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
                        >
                          ✅ Duyệt
                        </button>
                        <button
                          onClick={() => handleReject(signature.id)}
                          className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
                        >
                          ❌ Từ chối
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
            </div>
          ) : activeTab === 'pending-memories' ? (
            <div className="glass-dark rounded-2xl p-6">
              <h2 className="text-2xl font-bold text-white mb-6 text-center">
                Ảnh kỷ niệm chờ duyệt ({pendingMemories.length})
              </h2>

              {pendingMemories.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-300 text-lg">
                    Chưa có ảnh kỷ niệm nào chờ duyệt!
                  </p>
                </div>
              ) : (
                <div className="grid gap-6">
                  {pendingMemories.map((memory) => (
                    <div
                      key={memory.id}
                      className="bg-white/10 rounded-xl p-6 border border-white/20"
                    >
                      <div className="flex flex-col md:flex-row gap-6 items-center">
                        {/* Thông tin */}
                        <div className="flex-1">
                          <h3 className="text-xl font-bold text-white mb-2">
                            {memory.name}
                          </h3>
                          {memory.description && (
                            <p className="text-gray-300 mb-3 italic">
                              "{memory.description}"
                            </p>
                          )}
                          <div className="flex items-center gap-4 text-gray-300">
                            <span className="px-3 py-1 rounded-full text-sm font-medium bg-pink-500/20 text-pink-300">
                              Kỷ niệm
                            </span>
                            <span className="text-sm">
                              📅 {new Date(memory.timestamp).toLocaleString('vi-VN')}
                            </span>
                          </div>
                        </div>

                        {/* Ảnh kỷ niệm */}
                        <div className="flex-shrink-0">
                          <img
                            src={DataManager.getMemoryImage(memory.id)}
                            alt={`Kỷ niệm của ${memory.name}`}
                            className="w-48 h-48 object-cover rounded-lg border-2 border-gray-300"
                            onError={(e) => {
                              console.error('Admin: Lỗi load ảnh kỷ niệm:', e)
                              e.target.style.display = 'none'
                            }}
                          />
                        </div>

                        {/* Actions */}
                        <div className="flex flex-col gap-2">
                          <button
                            onClick={() => handleApproveMemory(memory.id)}
                            className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
                          >
                            ✅ Duyệt
                          </button>
                          <button
                            onClick={() => handleRejectMemory(memory.id)}
                            className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
                          >
                            ❌ Từ chối
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="glass-dark rounded-2xl p-6">
              <h2 className="text-2xl font-bold text-white mb-6 text-center">
                ✅ Chữ ký đã duyệt ({approvedSignatures.length})
              </h2>

              {approvedSignatures.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-300 text-lg">
                    📝 Chưa có chữ ký nào được duyệt!
                  </p>
                </div>
              ) : (
                <div className="grid gap-6">
                  {approvedSignatures.map((signature) => (
                    <div
                      key={signature.id}
                      className="bg-white/10 rounded-xl p-6 border border-white/20"
                    >
                      <div className="flex flex-col md:flex-row gap-6 items-center">
                        {/* Thông tin */}
                        <div className="flex-1">
                          {editingSignature === signature.id ? (
                            <div className="space-y-4">
                              <div>
                                <label className="block text-white text-sm font-medium mb-2">Tên:</label>
                                <input
                                  type="text"
                                  value={editForm.name}
                                  onChange={(e) => setEditForm(prev => ({ ...prev, name: e.target.value }))}
                                  className="w-full px-3 py-2 bg-black/20 border border-white/30 rounded-lg text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none"
                                  placeholder="Nhập tên..."
                                />
                              </div>
                              <div>
                                <label className="block text-white text-sm font-medium mb-2">Loại:</label>
                                <select
                                  value={editForm.type}
                                  onChange={(e) => setEditForm(prev => ({ ...prev, type: e.target.value }))}
                                  className="w-full px-3 py-2 bg-black/20 border border-white/30 rounded-lg text-white focus:border-blue-500 focus:outline-none"
                                >
                                  <option value="student">🎓 Học sinh</option>
                                  <option value="teacher">👨‍🏫 Giáo viên</option>
                                </select>
                              </div>
                            </div>
                          ) : (
                            <>
                              <h3 className="text-xl font-bold text-white mb-2">
                                {signature.name}
                              </h3>
                              <div className="flex items-center gap-4 text-gray-300">
                                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                                  signature.type === 'student'
                                    ? 'bg-blue-500/20 text-blue-300'
                                    : 'bg-red-500/20 text-red-300'
                                }`}>
                                  {signature.type === 'student' ? '🎓 Học sinh' : '👨‍🏫 Giáo viên'}
                                </span>
                                <span className="text-sm">
                                  📅 {new Date(signature.timestamp).toLocaleString('vi-VN')}
                                </span>
                              </div>
                            </>
                          )}
                        </div>

                        {/* Chữ ký */}
                        <div className="flex-shrink-0">
                          {(() => {
                            const imageData = getSignatureImage(signature.id)
                            return imageData ? (
                              <img
                                src={imageData}
                                alt={`Chữ ký của ${signature.name}`}
                                className="w-48 h-24 object-contain bg-white rounded-lg border-2 border-gray-300"
                                onError={(e) => {
                                  console.error('Admin: Lỗi load ảnh:', e)
                                  e.target.style.display = 'none'
                                }}
                              />
                            ) : (
                              <div className="w-48 h-24 bg-gray-200 rounded-lg flex items-center justify-center">
                                <span className="text-gray-500">Không có ảnh (ID: {signature.id})</span>
                              </div>
                            )
                          })()}
                        </div>

                        {/* Actions */}
                        <div className="flex flex-col gap-2">
                          {editingSignature === signature.id ? (
                            <>
                              <button
                                onClick={handleSaveEdit}
                                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                              >
                                💾 Lưu
                              </button>
                              <button
                                onClick={handleCancelEdit}
                                className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors font-medium"
                              >
                                ❌ Hủy
                              </button>
                            </>
                          ) : (
                            <>
                              <button
                                onClick={() => handleEdit(signature)}
                                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                              >
                                ✏️ Sửa
                              </button>
                              <button
                                onClick={() => handleDelete(signature.id)}
                                className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
                              >
                                🗑️ Xóa
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default AdminPage
