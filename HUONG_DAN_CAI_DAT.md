# Hướng dẫn cài đặt và chạy dự án PhoneCom

## 📋 Yêu cầu hệ thống

- **Node.js**: v18 trở lên
- **PostgreSQL**: Đang chạy trên máy local hoặc server
- **npm** hoặc **yarn**: Để cài đặt dependencies

## 🚀 Các bước cài đặt

### Bước 1: Cài đặt dependencies cho Backend

```bash
cd backend
npm install
```

### Bước 2: Thiết lập file môi trường (.env)

Tạo file `.env` trong thư mục `backend/` với nội dung sau:

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/phonecom?schema=public"

# Server
PORT=3001

# AI Service (Google Gemini)
GEMINI_API_KEY="your-gemini-api-key-here"
```

**Lưu ý:**
- Thay `username`, `password`, và `phonecom` bằng thông tin database PostgreSQL của bạn
- Lấy GEMINI_API_KEY từ [Google AI Studio](https://makersuite.google.com/app/apikey)
- Port được set là 3001 để khớp với frontend

### Bước 3: Khởi tạo Database

```bash
# Tạo Prisma Client
npm run db:generate

# Đẩy schema lên database
npm run db:push

# Nạp dữ liệu mẫu (seed data)
npm run db:seed
```

### Bước 4: Cài đặt dependencies cho Frontend

Mở terminal mới, quay lại thư mục gốc:

```bash
cd ..
npm install
```

## ▶️ Chạy ứng dụng

Bạn cần chạy **đồng thời** cả Backend và Frontend trong 2 terminal riêng biệt:

### Terminal 1 - Chạy Backend:

```bash
cd backend
npm run dev
```

Backend sẽ chạy tại: `http://localhost:3001`

### Terminal 2 - Chạy Frontend:

```bash
npm run dev
```

Frontend sẽ chạy tại: `http://localhost:3000`

## 🔑 Tài khoản Demo (sau khi chạy seed)

Sau khi chạy `npm run db:seed`, bạn có thể đăng nhập với các tài khoản sau:

| Vai trò | Email | Password |
|---------|-------|----------|
| **Admin** | `admin@demo.com` | (Trống) |
| **Staff** | `staff@demo.com` | (Trống) |
| **Customer** | `oo@demo.com` | (Trống) |

## 🛠️ Các lệnh hữu ích khác

### Xem dữ liệu database với Prisma Studio:

```bash
cd backend
npm run db:studio
```

### Build production:

**Backend:**
```bash
cd backend
npm run build
npm start
```

**Frontend:**
```bash
npm run build
npm run preview
```

## ⚠️ Xử lý lỗi thường gặp

1. **Lỗi kết nối database (Authentication failed):**
   - Xem hướng dẫn chi tiết: `backend/HUONG_DAN_SUA_LOI_DATABASE.md`
   - Kiểm tra PostgreSQL đang chạy: `brew services list | grep postgresql`
   - Kiểm tra DATABASE_URL trong file `.env` - đảm bảo username và password đúng
   - Thử kết nối thủ công: `psql -h localhost -p 5432 -U postgres -d phonecom_db`

2. **Lỗi port đã được sử dụng:**
   - Thay đổi PORT trong file `.env` của backend
   - Cập nhật API_URL trong `api.ts` của frontend

3. **Lỗi GEMINI_API_KEY:**
   - Đảm bảo đã thêm API key vào file `.env`
   - Tính năng AI Chat sẽ không hoạt động nếu thiếu key này

4. **Lỗi module not found:**
   - Chạy lại `npm install` trong cả frontend và backend

## 📁 Cấu trúc dự án

```
phonecom/
├── backend/          # Backend API (Express + Prisma)
│   ├── src/
│   │   ├── controllers/  # Logic xử lý nghiệp vụ
│   │   ├── routes/       # API endpoints
│   │   └── services/     # Dịch vụ (AI, Database)
│   └── prisma/       # Database schema & migrations
├── components/        # React components
├── context/          # State management
└── api.ts            # API client configuration
```

## 🎯 Kiểm tra ứng dụng đã chạy thành công

1. Backend: Truy cập `http://localhost:3001` - sẽ thấy message "PhoneCom Backend is running!"
2. Frontend: Truy cập `http://localhost:3000` - sẽ thấy giao diện trang chủ
3. Đăng nhập với một trong các tài khoản demo ở trên

