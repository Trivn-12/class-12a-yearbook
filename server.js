import express from 'express'
import cors from 'cors'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()
const PORT = process.env.PORT || 3001

// Middleware
app.use(cors())
app.use(express.json({ limit: '10mb' }))
app.use(express.static('public'))

// Tạo thư mục signatures nếu chưa có
const signaturesDir = path.join(__dirname, 'public', 'signatures')
if (!fs.existsSync(signaturesDir)) {
  fs.mkdirSync(signaturesDir, { recursive: true })
}

// Đường dẫn file dữ liệu
const dataFile = path.join(__dirname, 'public', 'signatures.json')

// Hàm đọc dữ liệu
function loadData() {
  try {
    if (fs.existsSync(dataFile)) {
      const data = fs.readFileSync(dataFile, 'utf8')
      return JSON.parse(data)
    }
  } catch (error) {
    console.error('Lỗi đọc dữ liệu:', error)
  }
  
  return {
    signatures: [],
    pendingSignatures: [],
    settings: {
      backgroundTheme: 'bg-gradient-1',
      gridSize: { rows: 6, cols: 8 }
    }
  }
}

// Hàm lưu dữ liệu
function saveData(data) {
  try {
    fs.writeFileSync(dataFile, JSON.stringify(data, null, 2))
    return true
  } catch (error) {
    console.error('Lỗi lưu dữ liệu:', error)
    return false
  }
}

// API: Lấy dữ liệu
app.get('/api/data', (req, res) => {
  const data = loadData()
  res.json(data)
})

// API: Lưu chữ ký mới
app.post('/api/signatures', (req, res) => {
  try {
    const { name, type, imageData } = req.body
    
    if (!name || !type || !imageData) {
      return res.status(400).json({ error: 'Thiếu thông tin bắt buộc' })
    }

    // Tạo ID cho chữ ký
    const signatureId = Date.now().toString()
    
    // Lưu ảnh vào file
    const base64Data = imageData.replace(/^data:image\/png;base64,/, '')
    const imagePath = path.join(signaturesDir, `${signatureId}.png`)
    fs.writeFileSync(imagePath, base64Data, 'base64')
    
    // Tạo object chữ ký
    const newSignature = {
      id: signatureId,
      name: name.trim(),
      type,
      imagePath: `signatures/${signatureId}.png`,
      timestamp: new Date().toISOString(),
      status: 'pending',
      position: {
        x: Math.random() * 800,
        y: Math.random() * 500
      }
    }

    // Lưu vào dữ liệu
    const data = loadData()
    data.pendingSignatures.push(newSignature)
    saveData(data)

    console.log(`Đã lưu chữ ký: ${name} (${type}) - ID: ${signatureId}`)
    res.json({ success: true, signature: newSignature })
    
  } catch (error) {
    console.error('Lỗi lưu chữ ký:', error)
    res.status(500).json({ error: 'Lỗi server khi lưu chữ ký' })
  }
})

// API: Duyệt chữ ký
app.post('/api/signatures/:id/approve', (req, res) => {
  try {
    const { id } = req.params
    const { position } = req.body
    
    const data = loadData()
    const pendingIndex = data.pendingSignatures.findIndex(s => s.id === id)
    
    if (pendingIndex === -1) {
      return res.status(404).json({ error: 'Không tìm thấy chữ ký' })
    }

    const signature = data.pendingSignatures[pendingIndex]
    signature.status = 'approved'
    if (position) {
      signature.position = position
    }
    
    data.signatures.push(signature)
    data.pendingSignatures.splice(pendingIndex, 1)
    
    saveData(data)
    console.log(`Đã duyệt chữ ký: ${signature.name}`)
    res.json({ success: true })
    
  } catch (error) {
    console.error('Lỗi duyệt chữ ký:', error)
    res.status(500).json({ error: 'Lỗi server khi duyệt chữ ký' })
  }
})

// API: Từ chối chữ ký
app.post('/api/signatures/:id/reject', (req, res) => {
  try {
    const { id } = req.params
    
    const data = loadData()
    const pendingIndex = data.pendingSignatures.findIndex(s => s.id === id)
    
    if (pendingIndex === -1) {
      return res.status(404).json({ error: 'Không tìm thấy chữ ký' })
    }

    const signature = data.pendingSignatures[pendingIndex]
    
    // Xóa file ảnh
    const imagePath = path.join(__dirname, 'public', signature.imagePath)
    if (fs.existsSync(imagePath)) {
      fs.unlinkSync(imagePath)
    }
    
    data.pendingSignatures.splice(pendingIndex, 1)
    saveData(data)
    
    console.log(`Đã từ chối chữ ký: ${signature.name}`)
    res.json({ success: true })
    
  } catch (error) {
    console.error('Lỗi từ chối chữ ký:', error)
    res.status(500).json({ error: 'Lỗi server khi từ chối chữ ký' })
  }
})

// API: Cập nhật vị trí chữ ký
app.put('/api/signatures/:id/position', (req, res) => {
  try {
    const { id } = req.params
    const { position } = req.body
    
    const data = loadData()
    const signature = data.signatures.find(s => s.id === id)
    
    if (!signature) {
      return res.status(404).json({ error: 'Không tìm thấy chữ ký' })
    }

    signature.position = position
    saveData(data)
    
    res.json({ success: true })
    
  } catch (error) {
    console.error('Lỗi cập nhật vị trí:', error)
    res.status(500).json({ error: 'Lỗi server khi cập nhật vị trí' })
  }
})

app.listen(PORT, () => {
  console.log(`🚀 Server đang chạy tại http://localhost:${PORT}`)
  console.log(`📁 Ảnh chữ ký được lưu tại: ${signaturesDir}`)
})
