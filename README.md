# 📝 Signature Collection - Class AK25 Yearbook

Ứng dụng thu thập chữ ký kỷ yếu lớp AK25 với giao diện đẹp mắt và tính năng quản lý chữ ký.

## ✨ Tính năng

- 🎨 **Giao diện đẹp mắt** với hiệu ứng gradient và animation
- ✍️ **Thu thập chữ ký** từ học sinh và giáo viên
- 🔍 **Phân loại người dùng** (học sinh/giáo viên)
- ⏳ **Hệ thống duyệt chữ ký** với admin panel
- 🖼️ **Gallery hiển thị** tất cả chữ ký đã duyệt
- 📱 **Responsive design** cho mobile và desktop
- 💾 **Lưu trữ an toàn** trên server local

## 🚀 Cài đặt và chạy

### Yêu cầu
- Node.js (v16 trở lên)
- npm hoặc yarn

### Cài đặt
```bash
# Clone repository
git clone https://github.com/yourusername/signature-collection.git
cd signature-collection

# Cài đặt dependencies
npm install

# Chạy ứng dụng
npm start
```

### Scripts có sẵn
```bash
npm run dev          # Chạy frontend (Vite dev server)
npm run server       # Chạy backend (Express server)
npm start           # Chạy cả frontend và backend
npm run build       # Build production
npm run preview     # Preview build
```

## 🌐 Truy cập

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:3001
- **Admin Panel**: http://localhost:3000/admin

## 📁 Cấu trúc dự án

```
signature-collection/
├── src/                    # Frontend React code
│   ├── components/         # React components
│   ├── pages/             # Page components
│   ├── utils/             # Utilities và DataManager
│   └── styles/            # CSS styles
├── public/                # Static files
│   ├── signatures/        # Thư mục lưu ảnh chữ ký
│   └── signatures.json    # Database JSON
├── server.js              # Express backend server
├── package.json           # Dependencies
└── README.md             # Documentation
```

## 🎯 Tính năng chính

### 1. Thu thập chữ ký
- Form nhập tên và loại người dùng
- Canvas để viết chữ ký
- Lưu chữ ký dưới dạng ảnh PNG

### 2. Hệ thống duyệt
- Admin có thể duyệt/từ chối chữ ký
- Chữ ký chờ duyệt được lưu riêng
- Thông báo cho người dùng về trạng thái

### 3. Gallery
- Hiển thị tất cả chữ ký đã duyệt
- Layout dạng grid có thể tùy chỉnh
- Hover để xem tên người ký

### 4. Trang đặc biệt
- **Sleep Page**: Dành cho học sinh sau khi submit
- **Thank You Page**: Dành cho giáo viên
- **Pending Page**: Thông báo chờ duyệt
- **History Page**: Xem lịch sử chữ ký

## 🛠️ Công nghệ sử dụng

### Frontend
- **React 18** - UI framework
- **Vite** - Build tool
- **React Router** - Routing
- **Tailwind CSS** - Styling
- **Lucide React** - Icons

### Backend
- **Express.js** - Web framework
- **Node.js** - Runtime
- **File System** - Data storage
- **CORS** - Cross-origin requests

## 🎨 Thiết kế

- **Gradient backgrounds** với nhiều theme
- **Glass morphism** effects
- **Smooth animations** và transitions
- **Responsive design** cho mọi thiết bị
- **Vietnamese language** support

## 📝 API Endpoints

```
GET  /api/data                    # Lấy tất cả dữ liệu
POST /api/signatures              # Thêm chữ ký mới
POST /api/signatures/:id/approve  # Duyệt chữ ký
POST /api/signatures/:id/reject   # Từ chối chữ ký
PUT  /api/signatures/:id/position # Cập nhật vị trí chữ ký
```

## 🔒 Bảo mật

- Validation dữ liệu đầu vào
- Giới hạn kích thước file upload
- CORS protection
- Error handling

## 📱 Responsive

Ứng dụng được tối ưu cho:
- 📱 Mobile phones
- 📱 Tablets  
- 💻 Desktop computers
- 🖥️ Large screens

## 🤝 Đóng góp

1. Fork repository
2. Tạo feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Tạo Pull Request

## 📄 License

Dự án này được phát hành dưới MIT License.

## 👨‍💻 Tác giả

**Học sinh lớp AK25** - Dự án kỷ yếu lớp học

---

⭐ **Nếu bạn thích dự án này, hãy cho một star nhé!** ⭐
