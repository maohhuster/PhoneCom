# 📋 CHECKLIST TRIỂN KHAI PHONECOM LÊN CLOUD

**Mục tiêu:** Deploy PhoneCom e-commerce MVP lên Neon (PostgreSQL) + Render (Backend) + Vercel (Frontend)

---

## 🎯 TỔNG QUAN CÁC BƯỚC

1. ✅ Tạo Neon PostgreSQL database
2. ✅ Cấu hình DATABASE_URL cho Prisma
3. ✅ Chạy migration + seed lên cloud DB
4. ✅ Deploy backend lên Render
5. ✅ Deploy frontend lên Vercel

---

## 📝 CHI TIẾT TỪNG BƯỚC

### **BƯỚC 1: TẠO NEON POSTGRESQL DATABASE**

#### 1.1. Đăng ký/Đăng nhập Neon
- Truy cập: https://neon.tech
- Đăng ký tài khoản (miễn phí) hoặc đăng nhập
- Tạo project mới (ví dụ: `phonecom-prod`)

#### 1.2. Lấy DATABASE_URL
- Sau khi tạo project, Neon sẽ hiển thị connection string
- Format: `postgresql://user:password@host/database?sslmode=require`
- **QUAN TRỌNG:** Neon yêu cầu SSL, URL phải có `?sslmode=require`
- Copy DATABASE_URL này (sẽ dùng ở bước sau)

**Ví dụ DATABASE_URL:**
```
postgresql://user:password@ep-xxx-xxx.region.aws.neon.tech/neondb?sslmode=require
```

---

### **BƯỚC 2: CẤU HÌNH DATABASE_URL VÀ CHẠY MIGRATION**

#### 2.1. Cấu hình DATABASE_URL local (để test)
Tạo file `.env` trong thư mục `backend/` (nếu chưa có):

```bash
cd backend
```

Tạo file `.env`:
```env
DATABASE_URL="postgresql://user:password@ep-xxx-xxx.region.aws.neon.tech/neondb?sslmode=require"
NODE_ENV=production
PORT=3001
GEMINI_API_KEY="your-gemini-api-key-here"
FRONTEND_URL="https://your-frontend.vercel.app"
```

**Lưu ý:** 
- Thay `DATABASE_URL` bằng URL từ Neon
- Thay `GEMINI_API_KEY` bằng API key thật (lấy từ Google AI Studio)
- `FRONTEND_URL` sẽ cập nhật sau khi deploy frontend

#### 2.2. Generate Prisma Client
```bash
cd backend
npm run db:generate
```

#### 2.3. Chạy Migration lên Neon Database
```bash
npm run db:push
```

**Giải thích:** `db:push` sẽ tạo schema trực tiếp lên cloud DB (phù hợp cho MVP, không cần migration files phức tạp).

**Hoặc nếu muốn dùng migration:**
```bash
npm run db:migrate
```

#### 2.4. Seed data lên Cloud Database (CHỈ CHẠY 1 LẦN)
```bash
npm run db:seed:prod
```

**Giải thích:** 
- `seed:prod` là file idempotent (an toàn), chỉ tạo data nếu chưa có
- KHÔNG xóa data hiện có
- Có thể chạy lại nhiều lần mà không lo trùng lặp

**Kiểm tra kết quả:**
```bash
npm run db:studio
```
Mở browser tại `http://localhost:5555` để xem data đã được seed.

---

### **BƯỚC 3: DEPLOY BACKEND LÊN RENDER**

#### 3.1. Chuẩn bị Repository
- ✅ **Dùng GitHub cá nhân của bạn** (không phải GitHub của chủ project)
- Repository hiện tại: `https://github.com/maohhuster/phonecom.git`
- Đảm bảo code đã push lên GitHub (đã thực hiện ở bước trước)
- Repository phải **public** hoặc Render có quyền truy cập (nếu private, cần authorize Render)

**Lưu ý:** 
- Render sẽ connect với GitHub account của bạn (`maohhuster`)
- Bạn cần đăng nhập Render bằng GitHub account của bạn
- Repository `phonecom` sẽ hiển thị trong danh sách khi connect
- **Nếu repo chưa tồn tại trên GitHub**, cần tạo repo mới trước khi push

#### 3.2. Tạo Web Service trên Render
1. Truy cập: https://render.com
2. Đăng ký/Đăng nhập bằng **GitHub account của bạn** (`nnkhanhduy`)
3. Click **"New +"** → **"Web Service"**
4. Connect repository GitHub của bạn (nếu chưa connect, Render sẽ yêu cầu authorize)
5. Chọn repository `phonecom` từ danh sách

#### 3.3. Cấu hình Build Settings

**Name:** `phonecom-backend` (hoặc tên bạn muốn)

**Region:** Chọn gần nhất (ví dụ: Singapore)

**Branch:** `main` (hoặc branch bạn muốn deploy)

**Root Directory:** `backend`

**Environment:** `Node`

**Build Command:**
```bash
npm install && npm run build && npm run db:generate
```

**⚠️ QUAN TRỌNG:** 
- Build command sẽ tự động chạy trong `backend/` vì Root Directory đã set là `backend`
- Nếu vẫn lỗi "Missing script", kiểm tra lại Root Directory = `backend`

**Start Command:**
```bash
npm start
```

#### 3.4. Cấu hình Environment Variables trên Render

Click **"Environment"** tab, thêm các biến sau:

| Key | Value | Ghi chú |
|-----|-------|---------|
| `DATABASE_URL` | `postgresql://...` | URL từ Neon (bước 1) |
| `NODE_ENV` | `production` | |
| `PORT` | `3001` | Render tự động set PORT, nhưng set để chắc chắn |
| `GEMINI_API_KEY` | `your-api-key` | API key từ Google AI Studio |
| `FRONTEND_URL` | `https://your-frontend.vercel.app` | Sẽ cập nhật sau khi deploy frontend |

**Lưu ý quan trọng:**
- `DATABASE_URL` phải có `?sslmode=require` ở cuối
- `FRONTEND_URL` ban đầu có thể để trống, cập nhật sau

#### 3.5. Deploy
- Click **"Create Web Service"**
- Render sẽ tự động build và deploy
- Đợi build hoàn tất (thường 3-5 phút)
- Lấy URL backend (ví dụ: `https://phonecom-backend.onrender.com`)

#### 3.6. Kiểm tra Backend
- Truy cập: `https://your-backend.onrender.com/health`
- Nếu thấy `{"status":"ok",...}` → Backend đã chạy thành công
- Truy cập: `https://your-backend.onrender.com/api/products`
- Nếu thấy danh sách sản phẩm → Database đã kết nối OK

---

### **BƯỚC 4: DEPLOY FRONTEND LÊN VERCEL**

#### 4.1. Chuẩn bị
- ✅ **Dùng GitHub cá nhân của bạn** (cùng repo với backend)
- Repository: `https://github.com/maohhuster/phonecom.git`
- Đảm bảo code fro  ntend đã push lên GitHub (đã thực hiện ở bước trước)

#### 4.2. Tạo Project trên Vercel
1. Truy cập: https://vercel.com
2. Đăng ký/Đăng nhập bằng **GitHub account của bạn** (`maohhuster`)
3. Click **"Add New..."** → **"Project"**
4. Import repository `phonecom` từ GitHub của bạn
5. Chọn repository `phonecom` (sẽ hiển thị trong danh sách)

#### 4.3. Cấu hình Build Settings

**Framework Preset:** `Vite`

**Root Directory:** `.` (root của repo, không phải `backend`)

**Build Command:** (Vercel tự detect, không cần set)
```bash
npm run build
```

**Output Directory:** `dist`

**Install Command:** (Vercel tự detect)
```bash
npm install
```

#### 4.4. Cấu hình Environment Variables trên Vercel

Click **"Environment Variables"**, thêm:

| Key | Value | Ghi chú |
|-----|-------|---------|
| `VITE_API_BASE_URL` | `https://your-backend.onrender.com/api` | URL backend từ Render (BƯỚC 3) |

**Lưu ý:**
- Vite yêu cầu prefix `VITE_` cho env variables
- URL phải có `/api` ở cuối (không có trailing slash)

#### 4.5. Deploy
- Click **"Deploy"**
- Vercel sẽ tự động build và deploy
- Đợi build hoàn tất (thường 1-2 phút)
- Lấy URL frontend (ví dụ: `https://phonecom.vercel.app`)

#### 4.6. Cập nhật CORS trên Render
Sau khi có URL frontend từ Vercel:

1. Quay lại Render dashboard
2. Vào **Environment Variables** của backend service
3. Cập nhật `FRONTEND_URL` = URL frontend từ Vercel (ví dụ: `https://phonecom.vercel.app`)
4. Render sẽ tự động restart service

#### 4.7. Kiểm tra Frontend
- Truy cập URL frontend từ Vercel
- Kiểm tra:
  - ✅ Trang chủ hiển thị danh sách sản phẩm
  - ✅ Không có lỗi CORS trong console
  - ✅ API calls hoạt động (mở DevTools → Network)

---

## 🔧 CÁC LỆNH TERMINAL TÓM TẮT

### Local Setup (chạy 1 lần để test)
```bash
# 1. Cấu hình DATABASE_URL trong backend/.env
cd backend
npm install

# 2. Generate Prisma Client
npm run db:generate

# 3. Push schema lên Neon
npm run db:push

# 4. Seed data (idempotent, an toàn)
npm run db:seed:prod

# 5. Test local (optional)
npm run dev
```

### Render (Backend) - Build & Start Commands
```bash
# Build Command
npm install && npm run build && npm run db:generate

# Start Command
npm start
```

### Vercel (Frontend) - Auto-detect
```bash
# Build Command (auto)
npm run build

# Output: dist/
```

---

## 📦 ENVIRONMENT VARIABLES TỔNG HỢP

### **Render (Backend)**
```env
DATABASE_URL=postgresql://user:password@ep-xxx.region.aws.neon.tech/neondb?sslmode=require
NODE_ENV=production
PORT=3001
GEMINI_API_KEY=your-gemini-api-key-here
FRONTEND_URL=https://your-frontend.vercel.app
```

### **Vercel (Frontend)**
```env
VITE_API_BASE_URL=https://your-backend.onrender.com/api
```

---

## ⚠️ CẢNH BÁO & LỖI THƯỜNG GẶP

### 1. **Prisma + Neon SSL Error**
**Lỗi:** `P1001: Can't reach database server`

**Nguyên nhân:** DATABASE_URL thiếu `?sslmode=require`

**Giải pháp:** Đảm bảo DATABASE_URL có dạng:
```
postgresql://...?sslmode=require
```

### 2. **CORS Error trên Frontend**
**Lỗi:** `Access to fetch at '...' from origin '...' has been blocked by CORS policy`

**Nguyên nhân:** 
- `FRONTEND_URL` trên Render chưa được set đúng
- Hoặc frontend URL thay đổi nhưng chưa cập nhật

**Giải pháp:**
- Kiểm tra `FRONTEND_URL` trên Render = đúng URL frontend từ Vercel
- Restart service trên Render sau khi cập nhật env

### 3. **Prisma Client Not Generated trên Render**
**Lỗi:** `Cannot find module '@prisma/client'`

**Nguyên nhân:** Build command thiếu `npm run db:generate`

**Giải pháp:** Đảm bảo Build Command có:
```bash
npm install && npm run build && npm run db:generate
```

### 4. **Database Connection Timeout**
**Lỗi:** Connection timeout khi deploy

**Nguyên nhân:** Neon database có thể bị sleep (free tier)

**Giải pháp:**
- Đợi vài giây, request lại
- Hoặc upgrade Neon plan (nếu cần)

### 5. **Seed Data Không Hiển Thị**
**Nguyên nhân:** 
- Seed chưa chạy
- Hoặc seed chạy trên local DB thay vì cloud DB

**Giải pháp:**
- Đảm bảo `DATABASE_URL` trong `.env` trỏ đúng Neon
- Chạy lại: `npm run db:seed:prod`

### 6. **API 404 trên Frontend**
**Lỗi:** `GET https://backend.onrender.com/api/products 404`

**Nguyên nhân:** 
- `VITE_API_BASE_URL` thiếu `/api` ở cuối
- Hoặc backend route không đúng

**Giải pháp:**
- Kiểm tra `VITE_API_BASE_URL` = `https://backend.onrender.com/api` (có `/api`)
- Kiểm tra backend route trong `backend/src/index.ts`

---

## ✅ CHECKLIST HOÀN THÀNH

Sau khi hoàn tất, kiểm tra:

- [ ] Neon database đã tạo và có DATABASE_URL
- [ ] Migration đã chạy thành công (`db:push`)
- [ ] Seed data đã chạy (`db:seed:prod`) và có data trong DB
- [ ] Backend deploy trên Render thành công
- [ ] Backend health check trả về `{"status":"ok"}`
- [ ] Backend API trả về data (ví dụ: `/api/products`)
- [ ] Frontend deploy trên Vercel thành công
- [ ] Frontend hiển thị danh sách sản phẩm
- [ ] Không có lỗi CORS trong browser console
- [ ] AI Chatbot hoạt động (nếu có GEMINI_API_KEY)

---

## 🎉 HOÀN TẤT

Nếu tất cả checklist đều ✅, dự án đã được deploy thành công!

**URLs cần lưu:**
- **Frontend:** `https://your-frontend.vercel.app`
- **Backend:** `https://your-backend.onrender.com`
- **Neon Dashboard:** https://console.neon.tech

---

## 📚 TÀI LIỆU THAM KHẢO

- Neon Docs: https://neon.tech/docs
- Render Docs: https://render.com/docs
- Vercel Docs: https://vercel.com/docs
- Prisma Docs: https://www.prisma.io/docs

---

**Lưu ý cuối:** 
- Free tier của Render có thể sleep service sau 15 phút không dùng → request đầu tiên sẽ chậm
- Free tier của Neon có thể sleep database → request đầu tiên sẽ chậm
- Để tránh sleep, có thể dùng service như UptimeRobot để ping định kỳ

