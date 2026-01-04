#!/bin/bash

# Script kiểm tra kết nối database
# Sử dụng: ./test-db-connection.sh

echo "🔍 Kiểm tra kết nối database..."
echo ""

# Load .env file
if [ -f .env ]; then
    export $(cat .env | grep -v '^#' | xargs)
    echo "✅ Đã load file .env"
else
    echo "❌ Không tìm thấy file .env"
    exit 1
fi

# Extract thông tin từ DATABASE_URL
if [ -z "$DATABASE_URL" ]; then
    echo "❌ DATABASE_URL không được định nghĩa trong .env"
    exit 1
fi

echo "📋 DATABASE_URL: $DATABASE_URL"
echo ""

# Parse DATABASE_URL
# Format: postgresql://username:password@host:port/database?schema=public
DB_URL=${DATABASE_URL#postgresql://}
DB_CRED=${DB_URL%%@*}
DB_HOST_PORT=${DB_URL#*@}
DB_HOST_PORT=${DB_HOST_PORT%%/*}
DB_NAME=${DB_URL#*/}
DB_NAME=${DB_NAME%%\?*}

if [[ $DB_CRED == *":"* ]]; then
    DB_USER=${DB_CRED%%:*}
    DB_PASS=${DB_CRED#*:}
else
    DB_USER=$DB_CRED
    DB_PASS=""
fi

if [[ $DB_HOST_PORT == *":"* ]]; then
    DB_HOST=${DB_HOST_PORT%%:*}
    DB_PORT=${DB_HOST_PORT#*:}
else
    DB_HOST=$DB_HOST_PORT
    DB_PORT=5432
fi

echo "📊 Thông tin kết nối:"
echo "   User: $DB_USER"
echo "   Host: $DB_HOST"
echo "   Port: $DB_PORT"
echo "   Database: $DB_NAME"
echo ""

# Test kết nối
echo "🧪 Đang test kết nối..."

if [ -z "$DB_PASS" ]; then
    PGPASSWORD="" psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" -c "SELECT version();" > /dev/null 2>&1
else
    PGPASSWORD="$DB_PASS" psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" -c "SELECT version();" > /dev/null 2>&1
fi

if [ $? -eq 0 ]; then
    echo "✅ Kết nối thành công!"
    echo ""
    echo "📝 Thông tin database:"
    if [ -z "$DB_PASS" ]; then
        psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" -c "\conninfo"
    else
        PGPASSWORD="$DB_PASS" psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" -c "\conninfo"
    fi
else
    echo "❌ Kết nối thất bại!"
    echo ""
    echo "💡 Hãy thử:"
    echo "   1. Kiểm tra PostgreSQL đang chạy: brew services list | grep postgresql"
    echo "   2. Kiểm tra username và password trong DATABASE_URL"
    echo "   3. Kiểm tra database '$DB_NAME' đã tồn tại chưa: psql -l"
    echo "   4. Xem hướng dẫn chi tiết: cat HUONG_DAN_SUA_LOI_DATABASE.md"
    exit 1
fi

