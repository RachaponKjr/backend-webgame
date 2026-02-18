import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class OrderService {
  constructor(private prisma: PrismaService) {}

  create(createOrderDto: CreateOrderDto) {
    return this.prisma.order.create({
      data: createOrderDto,
    });
  }

  findAll() {
    return this.prisma.order.findMany();
  }

  async findOne(id: string) {
    const order = await this.prisma.order.findUnique({
      where: { id }, // หรือถ้า ID เป็น Number ต้อง ParseInt(id) ก่อน
    });

    // ✨ จุดสำคัญ: ถ้าหาไม่เจอ ให้โยน Error ออกไป
    if (!order) {
      throw new NotFoundException(`ไม่พบออเดอร์รหัส ${id}`);
    }

    return order;
  }

  async findPandding(limit: number = 10, page: number = 1) {
    const skip = (page - 1) * limit;
    const [total, data] = await this.prisma.$transaction([
      this.prisma.order.count({
        where: { status: 'PROCESSING' },
      }),
      this.prisma.order.findMany({
        where: { status: 'PROCESSING' },
        take: limit,
        skip: skip,
        include: {
          game: true,
          package: true,
          user: true,
        },
        // เรียงตามที่มาก่อนนะ
        orderBy: { createdAt: 'desc' },
      }),
    ]);
    return {
      data,
      meta: {
        total,
        page,
        lastPage: Math.ceil(total / limit),
      },
    };
  }

  async findMaginMoney() {
    const now = new Date();

    // ตั้งค่าเวลาเป็น 00:00:00 ของวันนี้
    const startOfDay = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
    );

    // ตั้งค่าเวลาเป็น 23:59:59 ของวันนี้
    const endOfDay = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
      23,
      59,
      59,
    );

    // ดึงข้อมูลออเดอร์เฉพาะที่สำเร็จในวันนี้
    const ordersToday = await this.prisma.order.findMany({
      where: {
        status: 'COMPLETED',
        createdAt: {
          gte: startOfDay,
          lte: endOfDay,
        },
      },
      include: {
        package: true, // ดึงข้อมูลราคาต้นทุนและราคาขายจาก package
      },
    });

    // คำนวณยอดขายและกำไร
    const summary = ordersToday.reduce(
      (acc, order) => {
        const sales = order.package?.price || 0;
        const cost = order.package?.cost || 0;
        const profit = sales - cost;

        return {
          totalSales: acc.totalSales + sales,
          totalProfit: acc.totalProfit + profit,
          orderCount: acc.orderCount + 1,
        };
      },
      { totalSales: 0, totalProfit: 0, orderCount: 0 },
    );

    return {
      date: startOfDay.toISOString().split('T')[0],
      ...summary,
    };
  }

  async findMaginMoneyMonth() {
    const now = new Date();

    // ตั้งค่าเวลาเป็น 00:00:00 ของวันนี้
    const startOfDay = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
    );

    // ตั้งค่าเวลาเป็น 23:59:59 ของวันนี้
    const endOfDay = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
      23,
      59,
      59,
    );

    // ดึงข้อมูลออเดอร์เฉพาะที่สำเร็จในวันนี้
    const ordersToday = await this.prisma.order.findMany({
      where: {
        status: 'COMPLETED',
        createdAt: {
          gte: startOfDay,
          lte: endOfDay,
        },
      },
      include: {
        package: true, // ดึงข้อมูลราคาต้นทุนและราคาขายจาก package
      },
    });

    // คำนวณยอดขายและกำไร
    const summary = ordersToday.reduce(
      (acc, order) => {
        const sales = order.package?.price || 0;
        const cost = order.package?.cost || 0;
        const profit = sales - cost;

        return {
          totalSales: acc.totalSales + sales,
          totalProfit: acc.totalProfit + profit,
          orderCount: acc.orderCount + 1,
        };
      },
      { totalSales: 0, totalProfit: 0, orderCount: 0 },
    );

    return {
      date: startOfDay.toISOString().split('T')[0],
      ...summary,
    };
  }

  async findPopular() {
    // 1. ดึงข้อมูลออเดอร์ที่สำเร็จและ Group ตาม gameId
    const popularGames = await this.prisma.order.groupBy({
      by: ['gameId'],
      where: { status: 'COMPLETED' },
      _count: {
        gameId: true,
      },
      orderBy: {
        _count: {
          gameId: 'desc', // เรียงจากมากไปน้อย
        },
      },
      take: 5, // เอาแค่ Top 5 ยอดนิยม
    });

    // 2. ดึงรายละเอียดของ Game (ชื่อ) มาแปะเพิ่ม
    const results = await Promise.all(
      popularGames.map(async (item) => {
        const gameInfo = await this.prisma.game.findUnique({
          where: { id: item.gameId },
          select: { name: true },
        });
        return {
          name: gameInfo?.name || 'Unknown Game',
          orderCount: item._count.gameId,
        };
      }),
    );

    return results;
  }

  updateStatus(id: string) {
    return this.prisma.order.update({
      where: { id: id, status: 'PROCESSING' },
      data: { status: 'COMPLETED' },
    });
  }

  update(id: string, updateOrderDto: UpdateOrderDto) {
    return this.prisma.order.update({
      where: { id },
      data: updateOrderDto,
    });
  }

  remove(id: string) {
    return this.prisma.order.delete({
      where: { id },
    });
  }
}
