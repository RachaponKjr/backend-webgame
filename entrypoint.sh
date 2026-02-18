#!/bin/sh

# 1. รันการ Update Database ตารางต่างๆ
echo "Running database migrations..."
npx prisma db push --accept-data-loss

# 2. เริ่มต้นรันแอปพลิเคชัน
echo "Starting application..."
node dist/src/main