# 📤 HƯỚNG DẪN PUSH CODE LÊN GITHUB MAOHHUSTER

## ✅ Đã chuẩn bị:
- ✅ Đã commit tất cả thay đổi
- ✅ Đã đổi remote sang: `https://github.com/maohhuster/phonecom.git`
- ✅ `.gitignore` đã được cập nhật để bảo vệ file `.env`

---

## 🚀 CÁC BƯỚC THỰC HIỆN:

### Bước 1: Tạo Repository trên GitHub (nếu chưa có)

1. Truy cập: https://github.com/maohhuster
2. Click nút **"New"** (màu xanh lá) hoặc **"+"** → **"New repository"**
3. Đặt tên repository: `phonecom`
4. Chọn **Public** hoặc **Private** (tùy bạn)
5. **KHÔNG** tích vào "Initialize with README" (vì đã có code local)
6. Click **"Create repository"**

### Bước 2: Push code lên GitHub

Chạy lệnh sau trong terminal:

```bash
cd /Users/manhnguyenduc/Documents/GitHub/phonecom
git push -u origin main
```

**Lưu ý:** 
- Lần đầu push, Git sẽ yêu cầu xác thực
- Nếu repo chưa tồn tại, sẽ báo lỗi 404 → cần tạo repo trước (Bước 1)

### Bước 3: Xác thực GitHub (nếu cần)

**Cách 1: Dùng Personal Access Token (khuyến nghị)**
1. Tạo token: https://github.com/settings/tokens
2. Click **"Generate new token (classic)"**
3. Đặt tên token (ví dụ: "phonecom-deploy")
4. Chọn quyền: `repo` (full control)
5. Click **"Generate token"**
6. **Copy token ngay** (chỉ hiển thị 1 lần)
7. Khi push, nhập:
   - Username: `maohhuster`
   - Password: `[paste token của bạn]`

**Cách 2: Dùng SSH (nếu đã setup SSH key)**
```bash
# Đổi remote sang SSH
git remote set-url origin git@github.com:maohhuster/phonecom.git
git push -u origin main
```

---

## 🔍 KIỂM TRA SAU KHI PUSH:

1. Truy cập: https://github.com/maohhuster/phonecom
2. Kiểm tra:
   - ✅ Code đã được push thành công
   - ✅ File `.env` KHÔNG có trong repo (bảo mật)
   - ✅ Tất cả các file mới đã có trên GitHub
   - ✅ Commit message hiển thị đúng

---

## ⚠️ LƯU Ý QUAN TRỌNG:

### 1. KHÔNG commit file `.env`
File `.env` chứa thông tin nhạy cảm (DATABASE_URL, API keys). 
- ✅ Đã được thêm vào `.gitignore`
- ✅ Sẽ KHÔNG được commit

### 2. Nếu gặp lỗi "repository not found"
- Đảm bảo đã tạo repo `phonecom` trên GitHub của `maohhuster`
- Kiểm tra quyền truy cập (repo phải public hoặc bạn có quyền)

### 3. Nếu gặp lỗi xác thực
- Dùng Personal Access Token thay vì password
- Hoặc setup SSH key cho GitHub

---

## 🎯 SAU KHI PUSH THÀNH CÔNG:

Bạn có thể:
1. ✅ Deploy lên Render (backend) - connect với GitHub repo `maohhuster/phonecom`
2. ✅ Deploy lên Vercel (frontend) - connect với GitHub repo `maohhuster/phonecom`
3. ✅ Các service sẽ tự động pull code từ GitHub

---

## 📚 LỆNH TÓM TẮT:

```bash
# 1. Kiểm tra remote
git remote -v

# 2. Push lên GitHub
git push -u origin main

# 3. Nếu cần đổi lại remote
git remote set-url origin https://github.com/maohhuster/phonecom.git
```

---

## 🔄 Nếu muốn đổi lại remote:

```bash
# Xem remote hiện tại
git remote -v

# Đổi remote
git remote set-url origin https://github.com/maohhuster/phonecom.git

# Hoặc thêm remote mới (giữ cả 2)
git remote add maohhuster https://github.com/maohhuster/phonecom.git
```

---

**Chúc bạn thành công! 🚀**

