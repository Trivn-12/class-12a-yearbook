// Quản lý dữ liệu chữ ký với server API
export class DataManager {
  static getApiBase() {
    if (typeof window === 'undefined') return 'http://localhost:3001/api'

    const hostname = window.location.hostname
    const port = window.location.port
    const protocol = window.location.protocol

    // TEMPORARY FIX: Force production mode để test trên Railway
    // Uncomment dòng dưới để force production mode:
    return '/api'

    // Nếu không phải localhost hoặc có port khác 3000/3001, thì là production
    const isProduction = (hostname !== 'localhost' && hostname !== '127.0.0.1') ||
                        (port && port !== '3000' && port !== '3001')

    console.log('Environment detection:', {
      hostname,
      port,
      protocol,
      isProduction,
      fullUrl: window.location.href,
      willUse: isProduction ? '/api' : 'http://localhost:3001/api'
    })

    return isProduction ? '/api' : 'http://localhost:3001/api'
  }

  static get API_BASE() {
    return this.getApiBase()
  }

  static async loadData() {
    try {
      const response = await fetch(`${this.API_BASE}/data`)
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const data = await response.json()
      console.log('Đã tải dữ liệu từ server:', data)
      return data
    } catch (error) {
      console.error('Lỗi khi tải dữ liệu từ server:', error)
      // Fallback data nếu server không hoạt động
      return {
        signatures: [],
        pendingSignatures: [],
        settings: {
          backgroundTheme: 'bg-gradient-1',
          gridSize: { rows: 6, cols: 8 }
        }
      }
    }
  }

  static async addSignature(signatureData) {
    try {
      const apiUrl = `${this.API_BASE}/signatures`
      console.log('API URL:', apiUrl)
      console.log('Đang gửi chữ ký lên server:', {
        name: signatureData.name,
        type: signatureData.type,
        imageDataLength: signatureData.imageData?.length || 0
      })

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: signatureData.name,
          type: signatureData.type,
          imageData: signatureData.imageData
        })
      })

      console.log('Response status:', response.status)
      console.log('Response ok:', response.ok)

      if (!response.ok) {
        const errorText = await response.text()
        console.error('Server error response:', errorText)
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`)
      }

      const result = await response.json()
      console.log('Server response:', result)
      return result.signature
    } catch (error) {
      console.error('Lỗi khi gửi chữ ký lên server:', error)
      throw error
    }
  }

  static async approveSignature(signatureId, position = null) {
    try {
      const response = await fetch(`${this.API_BASE}/signatures/${signatureId}/approve`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ position })
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const result = await response.json()
      return result.success
    } catch (error) {
      console.error('Lỗi khi duyệt chữ ký:', error)
      return false
    }
  }

  static async rejectSignature(signatureId) {
    try {
      const response = await fetch(`${this.API_BASE}/signatures/${signatureId}/reject`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        }
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const result = await response.json()
      return result.success
    } catch (error) {
      console.error('Lỗi khi từ chối chữ ký:', error)
      return false
    }
  }

  static async updateSignaturePosition(signatureId, newPosition) {
    try {
      const response = await fetch(`${this.API_BASE}/signatures/${signatureId}/position`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ position: newPosition })
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const result = await response.json()
      return result.success
    } catch (error) {
      console.error('Lỗi khi cập nhật vị trí:', error)
      return false
    }
  }

  static getSignatureImage(signatureId) {
    // Trả về URL ảnh từ server
    if (typeof window === 'undefined') return `http://localhost:3001/signatures/${signatureId}.png`

    // TEMPORARY FIX: Force production mode
    const baseUrl = ''

    const imageUrl = `${baseUrl}/signatures/${signatureId}.png`
    console.log(`URL ảnh cho ID ${signatureId}:`, imageUrl)
    return imageUrl
  }

  static getImageDataFromCanvas(canvas) {
    // Chuyển canvas thành base64 data để gửi lên server
    return canvas.toDataURL('image/png')
  }

  static async deleteSignature(signatureId) {
    try {
      const response = await fetch(`${this.API_BASE}/signatures/${signatureId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        }
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const result = await response.json()
      return result.success
    } catch (error) {
      console.error('Lỗi khi xóa chữ ký:', error)
      return false
    }
  }

  static async updateSignature(signatureId, updateData) {
    try {
      const response = await fetch(`${this.API_BASE}/signatures/${signatureId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData)
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const result = await response.json()
      return result.signature
    } catch (error) {
      console.error('Lỗi khi cập nhật chữ ký:', error)
      return false
    }
  }

  static async addMemory(memoryData) {
    try {
      const apiUrl = `${this.API_BASE}/memories`
      console.log('API URL:', apiUrl)
      console.log('Đang gửi ảnh kỷ niệm lên server:', {
        name: memoryData.name,
        description: memoryData.description,
        imageDataLength: memoryData.imageData?.length || 0
      })

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: memoryData.name,
          description: memoryData.description,
          imageData: memoryData.imageData
        })
      })

      console.log('Response status:', response.status)
      console.log('Response ok:', response.ok)

      if (!response.ok) {
        const errorText = await response.text()
        console.error('Server error response:', errorText)
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`)
      }

      const result = await response.json()
      console.log('Server response:', result)
      return result.memory
    } catch (error) {
      console.error('Lỗi khi gửi ảnh kỷ niệm lên server:', error)
      throw error
    }
  }

  static async approveMemory(memoryId, position = null) {
    try {
      const response = await fetch(`${this.API_BASE}/memories/${memoryId}/approve`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ position })
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const result = await response.json()
      return result.success
    } catch (error) {
      console.error('Lỗi khi duyệt ảnh kỷ niệm:', error)
      return false
    }
  }

  static async rejectMemory(memoryId) {
    try {
      const response = await fetch(`${this.API_BASE}/memories/${memoryId}/reject`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        }
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const result = await response.json()
      return result.success
    } catch (error) {
      console.error('Lỗi khi từ chối ảnh kỷ niệm:', error)
      return false
    }
  }

  static getMemoryImage(memoryId) {
    // Trả về URL ảnh kỷ niệm từ server
    if (typeof window === 'undefined') return `http://localhost:3001/memories/${memoryId}.png`

    const hostname = window.location.hostname
    const port = window.location.port

    // Nếu không phải localhost hoặc có port khác 3000/3001, thì là production
    const isProduction = (hostname !== 'localhost' && hostname !== '127.0.0.1') ||
                        (port && port !== '3000' && port !== '3001')
    const baseUrl = isProduction ? '' : 'http://localhost:3001'

    const imageUrl = `${baseUrl}/memories/${memoryId}.png`
    console.log(`URL ảnh kỷ niệm cho ID ${memoryId}:`, imageUrl)
    return imageUrl
  }
}
