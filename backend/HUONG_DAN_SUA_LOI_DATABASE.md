# Hướng dẫn sửa lỗi Database Authentication

## 🔍 Vấn đề
Lỗi: `Authentication failed against database server at localhost, the provided database credentials for username are not valid.`

## 📱 Nếu bạn dùng Postgres.app

### Bước 1: Kiểm tra Postgres.app đang chạy

1. Mở ứng dụng **Postgres.app** trên macOS
2. Kiểm tra icon trong menu bar (phía trên bên phải) - phải có màu xanh (đang chạy)
3. Nếu chưa chạy, click vào icon và chọn "Start"

### Bước 2: Lấy thông tin kết nối từ Postgres.app

1. Mở Postgres.app
2. Click vào database mặc định (thường là `postgres`)
3. Xem thông tin kết nối:
   - **Host**: `localhost`
   - **Port**: `5432` (mặc định)
   - **User**: Thường là **username của macOS** (tên user trên máy bạn)
   - **Password**: Thường **không có** hoặc là username của bạn

### Bước 3: Tạo database qua Postgres.app

**Cách 1: Qua GUI (Dễ nhất)**
1. Mở Postgres.app
2. Click vào database `postgres`
3. Trong SQL Editor, chạy lệnh:
```sql
CREATE DATABASE phonecom_db;
```

**Cách 2: Qua Terminal**
```bash
# Lấy username của macOS
whoami

# Kết nối vào PostgreSQL (thay YOUR_USERNAME bằng username của bạn)
psql -d postgres

# Tạo database
CREATE DATABASE phonecom_db;
\q
```

### Bước 4: Cập nhật file `.env` cho Postgres.app

Mở file `backend/.env` và cập nhật `DATABASE_URL`:

**Option 1: Không có password (phổ biến nhất với Postgres.app)**
```env
DATABASE_URL="postgresql://$(whoami)@localhost:5432/phonecom_db?schema=public"
```

Hoặc thay `$(whoami)` bằng username thực tế của bạn:
```env
DATABASE_URL="postgresql://your_macos_username@localhost:5432/phonecom_db?schema=public"
```

**Option 2: Nếu có password**
```env
DATABASE_URL="postgresql://your_macos_username:your_password@localhost:5432/phonecom_db?schema=public"
```

**Option 3: Dùng user `postgres` (nếu có)**
```env
DATABASE_URL="postgresql://postgres@localhost:5432/phonecom_db?schema=public"
```

### Bước 5: Test kết nối với Postgres.app

```bash
cd backend

# Test bằng script
./test-db-connection.sh

# Hoặc test thủ công (thay YOUR_USERNAME bằng username của bạn)
psql -h localhost -p 5432 -U $(whoami) -d phonecom_db
```

---

## ✅ Các bước kiểm tra và sửa (Cho PostgreSQL cài qua Homebrew)

### Bước 1: Kiểm tra PostgreSQL đang chạy

```bash
# Kiểm tra PostgreSQL service
brew services list | grep postgresql
# hoặc
pg_isready
```

Nếu PostgreSQL chưa chạy, khởi động nó:
```bash
brew services start postgresql
# hoặc
pg_ctl -D /usr/local/var/postgres start
```

### Bước 2: Kiểm tra thông tin đăng nhập PostgreSQL

Kết nối vào PostgreSQL để kiểm tra username và password:

```bash
psql postgres
# hoặc nếu có user cụ thể:
psql -U postgres
# hoặc
psql -U your_username
```

Nếu không biết password, thử các cách sau:
- Password mặc định thường là rỗng (không có password)
- Hoặc password là `postgres`
- Hoặc username của bạn trên macOS

### Bước 3: Tạo database (nếu chưa có)

Sau khi kết nối được vào PostgreSQL, tạo database:

```sql
CREATE DATABASE phonecom_db;
\q
```

### Bước 4: Cập nhật file `.env`

Mở file `backend/.env` và cập nhật `DATABASE_URL` với một trong các format sau:

#### Option 1: Nếu không có password (phổ biến trên macOS)
```env
DATABASE_URL="postgresql://postgres@localhost:5432/phonecom_db?schema=public"
```

#### Option 2: Nếu có password
```env
DATABASE_URL="postgresql://postgres:your_password@localhost:5432/phonecom_db?schema=public"
```

#### Option 3: Nếu dùng username của macOS
```env
DATABASE_URL="postgresql://your_macos_username@localhost:5432/phonecom_db?schema=public"
```

#### Option 4: Nếu dùng user khác
```env
DATABASE_URL="postgresql://username:password@localhost:5432/phonecom_db?schema=public"
```

### Bước 5: Test kết nối

Sau khi cập nhật `.env`, test kết nối:

```bash
cd backend
npm run db:push
```

Nếu vẫn lỗi, thử kết nối trực tiếp bằng psql với thông tin trong DATABASE_URL:

```bash
# Ví dụ với format: postgresql://postgres@localhost:5432/phonecom_db
psql -h localhost -p 5432 -U postgres -d phonecom_db
```

### Bước 6: Nếu vẫn không được - Tạo user mới

Nếu không thể kết nối, tạo user mới với quyền đầy đủ:

```bash
# Kết nối với quyền admin
psql postgres

# Tạo user mới
CREATE USER phonecom_user WITH PASSWORD 'your_secure_password';
CREATE DATABASE phonecom_db OWNER phonecom_user;
GRANT ALL PRIVILEGES ON DATABASE phonecom_db TO phonecom_user;
\q
```

Sau đó cập nhật `.env`:
```env
DATABASE_URL="postgresql://phonecom_user:your_secure_password@localhost:5432/phonecom_db?schema=public"
```

## 📝 Ví dụ file `.env` hoàn chỉnh

```env
# Database - Thay đổi theo thông tin PostgreSQL của bạn
DATABASE_URL="postgresql://postgres@localhost:5432/phonecom_db?schema=public"

# Server Port
PORT=3001

# AI Service (Google Gemini)
GEMINI_API_KEY="your-gemini-api-key-here"
```

## 🔧 Các lệnh hữu ích

### Xem danh sách database:
```bash
psql -l
```

### Xem danh sách user:
```bash
psql postgres -c "\du"
```

### Xóa và tạo lại database (nếu cần):
```bash
psql postgres -c "DROP DATABASE IF EXISTS phonecom_db;"
psql postgres -c "CREATE DATABASE phonecom_db;"
```

## ⚠️ Lưu ý

### Cho Postgres.app:
1. **User mặc định** thường là **username của macOS** (dùng lệnh `whoami` để xem)
2. **Password thường rỗng** - không cần password trong connection string
3. **Port mặc định** là 5432
4. **Database name** phải khớp với tên database bạn đã tạo
5. Đảm bảo Postgres.app đang chạy (icon màu xanh trong menu bar)

### Cho PostgreSQL cài qua Homebrew:
1. **Trên macOS**, thường PostgreSQL được cài qua Homebrew và user mặc định là username của macOS
2. **Password có thể rỗng** - thử bỏ password trong connection string
3. **Port mặc định** là 5432, nếu bạn đổi port thì cập nhật trong DATABASE_URL
4. **Database name** phải khớp với tên database bạn đã tạo

## 🎯 Cách nhanh nhất cho Postgres.app

1. Mở Postgres.app và đảm bảo nó đang chạy
2. Lấy username: chạy `whoami` trong terminal
3. Tạo database: `psql -d postgres -c "CREATE DATABASE phonecom_db;"`
4. Cập nhật `.env`:
   ```env
   DATABASE_URL="postgresql://$(whoami)@localhost:5432/phonecom_db?schema=public"
   ```
5. Test: `cd backend && npm run db:push`

