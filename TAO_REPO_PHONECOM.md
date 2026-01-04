# 📦 HƯỚNG DẪN TẠO REPO PHONECOM TRÊN GITHUB

## 🎯 Mục tiêu:
Tạo repository tên `phonecom` trên GitHub account `maohhuster`

---

## 📝 CÁC BƯỚC:

### Bước 1: Tạo Repository mới
1. Truy cập: https://github.com/new
   - Hoặc: https://github.com/maohhuster → Click nút **"New"** (màu xanh lá)

### Bước 2: Điền thông tin Repository
- **Repository name:** `phonecom` ⚠️ (QUAN TRỌNG: phải đúng tên này)
- **Description:** (tùy chọn) "PhoneCom E-commerce MVP"
- **Visibility:** 
  - ✅ **Public** (khuyến nghị - để Render/Vercel dễ connect)
  - Hoặc **Private** (nếu muốn bảo mật, cần authorize Render/Vercel)

### Bước 3: KHÔNG tích các tùy chọn
- ❌ **KHÔNG** tích "Add a README file"
- ❌ **KHÔNG** tích "Add .gitignore"
- ❌ **KHÔNG** tích "Choose a license"

**Lý do:** Code local đã có sẵn README, .gitignore, và các file khác.

### Bước 4: Tạo Repository
- Click nút **"Create repository"** (màu xanh lá)

---

## 🚀 SAU KHI TẠO REPO:

GitHub sẽ hiển thị trang setup. Bạn sẽ thấy phần:

### **"...or push an existing repository from the command line"**

Chạy các lệnh sau (đã được chuẩn bị sẵn):

```bash
cd /Users/manhnguyenduc/Documents/GitHub/phonecom

# Kiểm tra remote (phải là phonecom, không phải maohhuster)
git remote -v

# Nếu remote đúng, push luôn:
git push -u origin main
```

---

## ⚠️ LƯU Ý:

### Nếu bạn đã tạo nhầm repo tên `maohhuster`:
Có 2 lựa chọn:

**Lựa chọn 1: Tạo repo mới tên `phonecom` (khuyến nghị)**
- Tạo repo mới với tên `phonecom` như hướng dẫn trên
- Remote đã đúng, chỉ cần push

**Lựa chọn 2: Dùng repo `maohhuster` hiện tại**
- Đổi remote:
```bash
git remote set-url origin https://github.com/maohhuster/maohhuster.git
git push -u origin main
```

---

## ✅ KIỂM TRA:

Sau khi push thành công, truy cập:
- https://github.com/maohhuster/phonecom

Bạn sẽ thấy:
- ✅ Tất cả code đã được push
- ✅ File `.env` KHÔNG có trong repo (đã được ignore)
- ✅ Các file mới: CHECKLIST_TRIEN_KHAI.md, seed.prod.ts, etc.

---

**Chúc bạn thành công! 🚀**

