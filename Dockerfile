# Stage 1: Build
FROM node:20-alpine AS builder
WORKDIR /app

# 1. ติดตั้ง Dependencies สำหรับการ Build
COPY package*.json ./
COPY prisma ./prisma/ 
RUN npm install

# 2. Copy Source Code ทั้งหมด
COPY . .

# 3. Generate Prisma Client และ Build โปรเจกต์
RUN npx prisma generate
RUN npm run build

# Stage 2: Production Run
FROM node:20-alpine
WORKDIR /app

# ตั้งค่า Environment
ENV NODE_ENV=production

# 4. Copy เฉพาะไฟล์ที่จำเป็นมาจาก Stage Builder
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma
# Copy entrypoint script เข้ามาด้วย
COPY entrypoint.sh ./

# 5. เคลียร์ Dev-dependencies ออก และตั้งสิทธิ์การรัน Script
RUN npm prune --production && chmod +x entrypoint.sh

# 6. สร้างโฟลเดอร์สำหรับรับแรงกระแทก (กัน Error ENOENT)
RUN mkdir -p /app/data /app/uploads

EXPOSE 3000

# 7. ใช้ Entrypoint เพื่อรัน Migration ก่อนสตาร์ทแอป
ENTRYPOINT ["./entrypoint.sh"]