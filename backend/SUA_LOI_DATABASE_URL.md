# 🔧 SỬA LỖI DATABASE_URL

## ❌ Lỗi hiện tại:
```
Error: the URL must start with the protocol `postgresql://` or `postgres://`.
```

## ✅ Cách sửa:

### Bước 1: Mở file `.env`
```bash
cd backend
nano .env
# hoặc dùng editor khác: code .env, vim .env, etc.
```

### Bước 2: Kiểm tra và sửa DATABASE_URL

**Format ĐÚNG:**
```env
DATABASE_URL="postgresql://user:password@ep-xxx-xxx.region.aws.neon.tech/neondb?sslmode=require"
```

**Các lỗi thường gặp:**

❌ **SAI - Thiếu protocol:**
```env
DATABASE_URL="ep-xxx-xxx.region.aws.neon.tech/neondb"
```

❌ **SAI - Thiếu sslmode:**
```env
DATABASE_URL="postgresql://user:password@ep-xxx-xxx.region.aws.neon.tech/neondb"
```

❌ **SAI - Có khoảng trắng:**
```env
DATABASE_URL = "postgresql://..."
```

❌ **SAI - Commented out:**
```env
# DATABASE_URL="postgresql://..."
```

✅ **ĐÚNG:**
```env
DATABASE_URL="postgresql://user:password@ep-xxx-xxx.region.aws.neon.tech/neondb?sslmode=require"
```

### Bước 3: Nếu chưa có Neon Database

1. Truy cập: https://neon.tech
2. Đăng nhập/Đăng ký
3. Tạo project mới
4. Copy connection string từ Neon dashboard
5. Paste vào file `.env` với format:
   ```env
   DATABASE_URL="postgresql://user:password@host/database?sslmode=require"
   ```

### Bước 4: Test lại

```bash
# Kiểm tra Prisma có đọc được DATABASE_URL không
npm run db:push
```

Nếu vẫn lỗi, kiểm tra:
- File `.env` có nằm đúng trong thư mục `backend/` không?
- DATABASE_URL có dấu ngoặc kép đúng không?
- Có ký tự đặc biệt trong password cần URL encode không?

### Bước 5: Nếu password có ký tự đặc biệt

Nếu password có ký tự như `@`, `#`, `%`, cần URL encode:
- `@` → `%40`
- `#` → `%23`
- `%` → `%25`
- `&` → `%26`

Ví dụ:
```env
# Password gốc: p@ss#word
# URL encode: p%40ss%23word
DATABASE_URL="postgresql://user:p%40ss%23word@host/db?sslmode=require"
```

---

## 🧪 Test nhanh

Chạy lệnh này để kiểm tra Prisma có đọc được DATABASE_URL:
```bash
cd backend
npx prisma db push --skip-generate
```

Nếu thành công, bạn sẽ thấy:
```
✅ Your database is now in sync with your Prisma schema.
```

