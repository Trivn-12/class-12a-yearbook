// Quản lý dữ liệu chữ ký với server API
export class DataManager {
  static API_BASE = (typeof window !== 'undefined' && window.location.hostname !== 'localhost')
    ? '/api'  // Production: sử dụng relative URL
    : 'http://localhost:3001/api'  // Development: sử dụng localhost

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
      console.log('Đang gửi chữ ký lên server:', signatureData)

      const response = await fetch(`${this.API_BASE}/signatures`, {
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

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
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
    const baseUrl = (typeof window !== 'undefined' && window.location.hostname !== 'localhost')
      ? '' // Production: sử dụng relative URL
      : 'http://localhost:3001' // Development: sử dụng localhost
    const imageUrl = `${baseUrl}/signatures/${signatureId}.png`
    console.log(`URL ảnh cho ID ${signatureId}:`, imageUrl)
    return imageUrl
  }

  static getImageDataFromCanvas(canvas) {
    // Chuyển canvas thành base64 data để gửi lên server
    return canvas.toDataURL('image/png')
  }
}
