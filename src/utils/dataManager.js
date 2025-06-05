// Quản lý dữ liệu chữ ký với server API
export class DataManager {
  static getApiBase() {
    if (typeof window === 'undefined') return 'http://localhost:3001/api'

    const hostname = window.location.hostname
    const port = window.location.port
    const protocol = window.location.protocol

    // Nếu không phải localhost hoặc có port khác 3000/3001, thì là production
    const isProduction = (hostname !== 'localhost' && hostname !== '127.0.0.1') ||
                        (port && port !== '3000' && port !== '3001')

    console.log('Environment detection:', {
      hostname,
      port,
      protocol,
      isProduction,
      fullUrl: window.location.href
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

    const hostname = window.location.hostname
    const port = window.location.port

    // Nếu không phải localhost hoặc có port khác 3000/3001, thì là production
    const isProduction = (hostname !== 'localhost' && hostname !== '127.0.0.1') ||
                        (port && port !== '3000' && port !== '3001')
    const baseUrl = isProduction ? '' : 'http://localhost:3001'

    const imageUrl = `${baseUrl}/signatures/${signatureId}.png`
    console.log(`URL ảnh cho ID ${signatureId}:`, imageUrl)
    return imageUrl
  }

  static getImageDataFromCanvas(canvas) {
    // Chuyển canvas thành base64 data để gửi lên server
    return canvas.toDataURL('image/png')
  }
}
