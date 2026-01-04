# 📤 HƯỚNG DẪN PUSH CODE LÊN GITHUB

## ✅ Đã chuẩn bị:
- ✅ Git repo đã được setup
- ✅ Remote đã được cấu hình: `https://github.com/nnkhanhduy/phonecom.git`
- ✅ `.gitignore` đã được cập nhật để bảo vệ file `.env`

## 📝 Các file cần commit:

### Files đã thay đổi (Modified):
- `.gitignore` - Đã thêm ignore cho .env files
- `api.ts` - Đã cập nhật để dùng env variable cho API URL
- `backend/package.json` - Đã thêm script `db:seed:prod`
- `backend/src/index.ts` - Đã cập nhật CORS cho production
- `backend/package-lock.json` - Dependencies update
- `package-lock.json` - Dependencies update
- Các file khác đã được modify

### Files mới (Untracked):
- `CHECKLIST_TRIEN_KHAI.md` - Checklist triển khai chi tiết
- `backend/prisma/seed.prod.ts` - Seed file an toàn cho production
- `backend/SUA_LOI_DATABASE_URL.md` - Hướng dẫn sửa lỗi DATABASE_URL
- Các file documentation khác

---

## 🚀 CÁC BƯỚC THỰC HIỆN:

### Bước 1: Kiểm tra trạng thái
```bash
cd /Users/manhnguyenduc/Documents/GitHub/phonecom
git status
```

### Bước 2: Thêm các file (trừ .env)
```bash
# Thêm tất cả các file
git add .

# Nếu có lỗi với backend/.env.example, có thể bỏ qua file đó:
# git add . --ignore-errors
# hoặc add từng file cụ thể
```

### Bước 3: Kiểm tra lại các file sẽ được commit
```bash
git status
```

**⚠️ QUAN TRỌNG:** Đảm bảo KHÔNG có file `.env` trong danh sách commit!

### Bước 4: Commit với message rõ ràng
```bash
git commit -m "feat: Prepare for production deployment

- Add production seed file (idempotent)
- Update API URL to use environment variable
- Configure CORS for production
- Add deployment checklist
- Update .gitignore to protect .env files
- Add production seed script"
```

### Bước 5: Push lên GitHub
```bash
git push origin main
```

Nếu branch của bạn không phải `main`, thay bằng tên branch của bạn:
```bash
git push origin <your-branch-name>
```

---

## 🔍 KIỂM TRA SAU KHI PUSH:

1. Truy cập: https://github.com/nnkhanhduy/phonecom
2. Kiểm tra:
   - ✅ Code đã được push thành công
   - ✅ File `.env` KHÔNG có trong repo (bảo mật)
   - ✅ Tất cả các file mới đã có trên GitHub

---

## ⚠️ LƯU Ý QUAN TRỌNG:

### 1. KHÔNG commit file `.env`
File `.env` chứa thông tin nhạy cảm (DATABASE_URL, API keys). 
- ✅ Đã được thêm vào `.gitignore`
- ✅ Sẽ KHÔNG được commit

### 2. Nếu đã vô tình commit `.env`:
```bash
# Xóa file khỏi git history (nhưng giữ lại local)
git rm --cached backend/.env
git commit -m "Remove .env from repository"
git push origin main
```

### 3. File `.env.example` là OK
File `.env.example` chỉ chứa template, không có thông tin thật, nên có thể commit.

---

## 🎯 SAU KHI PUSH THÀNH CÔNG:

Bạn có thể:
1. ✅ Deploy lên Render (backend) - connect với GitHub repo
2. ✅ Deploy lên Vercel (frontend) - connect với GitHub repo
3. ✅ Các service sẽ tự động pull code từ GitHub

---

## 📚 LỆNH TÓM TẮT:

```bash
# 1. Kiểm tra status
git status

# 2. Thêm files
git add .

# 3. Commit
git commit -m "feat: Prepare for production deployment"

# 4. Push
git push origin main
```

---

**Chúc bạn thành công! 🚀**

