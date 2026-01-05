# 🔧 SỬA LỖI RENDER BUILD: Missing script "db:generate"

## ❌ Lỗi hiện tại:
```
npm error Missing script: "db:generate"
Build failed 😞
```

## 🔍 Nguyên nhân:
Render đang chạy build command từ thư mục sai (root thay vì `backend/`)

---

## ✅ CÁCH SỬA:

### Bước 1: Kiểm tra Root Directory trên Render

1. Vào Render Dashboard
2. Chọn service `phonecom-backend`
3. Vào tab **"Settings"**
4. Scroll xuống phần **"Build & Deploy"**
5. Kiểm tra **"Root Directory"** phải là: `backend`

**Nếu chưa đúng:**
- Sửa thành: `backend`
- Click **"Save Changes"**

### Bước 2: Kiểm tra Build Command

Trong cùng tab **"Settings"** → **"Build & Deploy"**:

**Build Command phải là:**
```bash
npm install && npm run build && npm run db:generate
```

**Start Command phải là:**
```bash
npm start
```

### Bước 3: Kiểm tra lại cấu hình

Đảm bảo các settings sau:

| Setting | Value |
|---------|-------|
| **Root Directory** | `backend` |
| **Environment** | `Node` |
| **Build Command** | `npm install && npm run build && npm run db:generate` |
| **Start Command** | `npm start` |

### Bước 4: Redeploy

Sau khi sửa:
1. Click **"Manual Deploy"** → **"Deploy latest commit"**
2. Hoặc push commit mới lên GitHub (Render sẽ auto-deploy)

---

## 🔍 KIỂM TRA THÊM:

### Nếu vẫn lỗi sau khi sửa Root Directory:

**Cách 1: Sửa Build Command (explicit path)**
```bash
cd backend && npm install && npm run build && npm run db:generate
```

**Cách 2: Kiểm tra package.json**
- Đảm bảo file `backend/package.json` có script `db:generate`
- Script phải là: `"db:generate": "prisma generate"`

### Kiểm tra logs trên Render:

1. Vào tab **"Logs"** trên Render Dashboard
2. Xem phần **"Build Logs"**
3. Tìm dòng báo lỗi để xác định chính xác vấn đề

---

## 📋 CHECKLIST SỬA LỖI:

- [ ] Root Directory = `backend`
- [ ] Build Command = `npm install && npm run build && npm run db:generate`
- [ ] Start Command = `npm start`
- [ ] File `backend/package.json` có script `db:generate`
- [ ] Đã click "Save Changes"
- [ ] Đã trigger deploy lại

---

## 🎯 SAU KHI SỬA:

Build sẽ thành công và bạn sẽ thấy:
```
✓ built in X.XXs
✓ Prisma Client generated
✓ Build completed successfully
```

---

**Nếu vẫn gặp lỗi, kiểm tra logs chi tiết trên Render Dashboard!**

