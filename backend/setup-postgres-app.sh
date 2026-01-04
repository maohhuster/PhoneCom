#!/bin/bash

# Script tự động setup cho Postgres.app
# Sử dụng: ./setup-postgres-app.sh

echo "🚀 Thiết lập PostgreSQL cho Postgres.app"
echo ""

# Lấy username của macOS
MACOS_USER=$(whoami)
echo "📋 Username của macOS: $MACOS_USER"
echo ""

# Kiểm tra PostgreSQL đang chạy
echo "🔍 Kiểm tra PostgreSQL đang chạy..."
if pg_isready -h localhost -p 5432 > /dev/null 2>&1; then
    echo "✅ PostgreSQL đang chạy"
else
    echo "❌ PostgreSQL chưa chạy!"
    echo "💡 Hãy mở Postgres.app và đảm bảo nó đang chạy (icon màu xanh)"
    exit 1
fi
echo ""

# Kiểm tra database đã tồn tại chưa
echo "🔍 Kiểm tra database phonecom_db..."
if psql -h localhost -p 5432 -U "$MACOS_USER" -d phonecom_db -c "SELECT 1;" > /dev/null 2>&1; then
    echo "✅ Database phonecom_db đã tồn tại"
else
    echo "📝 Tạo database phonecom_db..."
    if psql -h localhost -p 5432 -U "$MACOS_USER" -d postgres -c "CREATE DATABASE phonecom_db;" > /dev/null 2>&1; then
        echo "✅ Đã tạo database phonecom_db"
    else
        echo "❌ Không thể tạo database. Hãy tạo thủ công:"
        echo "   psql -d postgres -c \"CREATE DATABASE phonecom_db;\""
        exit 1
    fi
fi
echo ""

# Tạo hoặc cập nhật file .env
echo "📝 Cập nhật file .env..."

if [ ! -f .env ]; then
    echo "📄 Tạo file .env mới..."
    cat > .env << EOF
# Database - Postgres.app
DATABASE_URL="postgresql://$MACOS_USER@localhost:5432/phonecom_db?schema=public"

# Server Port
PORT=3001

# AI Service (Google Gemini)
GEMINI_API_KEY="your-gemini-api-key-here"
EOF
    echo "✅ Đã tạo file .env"
else
    echo "📄 File .env đã tồn tại, cập nhật DATABASE_URL..."
    
    # Backup file .env cũ
    cp .env .env.backup
    echo "💾 Đã backup file .env thành .env.backup"
    
    # Cập nhật DATABASE_URL
    if grep -q "DATABASE_URL=" .env; then
        # Thay thế dòng DATABASE_URL hiện tại
        sed -i.bak "s|DATABASE_URL=.*|DATABASE_URL=\"postgresql://$MACOS_USER@localhost:5432/phonecom_db?schema=public\"|" .env
        rm .env.bak 2>/dev/null
        echo "✅ Đã cập nhật DATABASE_URL"
    else
        # Thêm DATABASE_URL mới
        echo "" >> .env
        echo "# Database - Postgres.app" >> .env
        echo "DATABASE_URL=\"postgresql://$MACOS_USER@localhost:5432/phonecom_db?schema=public\"" >> .env
        echo "✅ Đã thêm DATABASE_URL"
    fi
fi
echo ""

# Test kết nối
echo "🧪 Test kết nối database..."
if psql -h localhost -p 5432 -U "$MACOS_USER" -d phonecom_db -c "SELECT version();" > /dev/null 2>&1; then
    echo "✅ Kết nối thành công!"
    echo ""
    echo "📊 Thông tin kết nối:"
    psql -h localhost -p 5432 -U "$MACOS_USER" -d phonecom_db -c "\conninfo"
    echo ""
    echo "🎉 Thiết lập hoàn tất!"
    echo ""
    echo "📝 Bước tiếp theo:"
    echo "   1. Kiểm tra và cập nhật GEMINI_API_KEY trong file .env (nếu cần)"
    echo "   2. Chạy: npm run db:generate"
    echo "   3. Chạy: npm run db:push"
    echo "   4. Chạy: npm run db:seed"
else
    echo "❌ Kết nối thất bại!"
    echo ""
    echo "💡 Hãy thử:"
    echo "   1. Kiểm tra Postgres.app đang chạy"
    echo "   2. Kiểm tra username: $MACOS_USER"
    echo "   3. Thử kết nối thủ công: psql -h localhost -p 5432 -U $MACOS_USER -d phonecom_db"
    exit 1
fi

