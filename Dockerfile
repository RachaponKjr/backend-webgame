# Stage 1: Build
FROM node:20-alpine AS builder
WORKDIR /app

# Copy ไฟล์ตั้งต้นเพื่อลง dependencies
COPY package*.json ./
COPY prisma ./prisma/ 

# ลง dependencies ทั้งหมดเพื่อใช้ในการ Build
RUN npm install

# Copy source code ทั้งหมด
COPY . .

# 1. ต้อง Generate Prisma Client ก่อน Build
RUN npx prisma generate

# 2. สั่ง Build โปรเจกต์
RUN npm run build

# Stage 2: Run (Production)
FROM node:20-alpine
WORKDIR /app

# ตั้งค่า Environment เป็น production
ENV NODE_ENV=production

# Copy เฉพาะไฟล์ที่จำเป็นมาจาก builder stage
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma

# ติดตั้งเฉพาะ production dependencies (ลดขนาด image)
RUN npm prune --production

EXPOSE 3000

# แก้ไข Path ตามที่คุณเช็คใน ls -R คือ dist/src/main
CMD ["node", "dist/src/main"]