import { Injectable } from '@nestjs/common';
import { CreateGameDto } from './dto/create-game.dto';
import { UpdateGameDto } from './dto/update-game.dto';
import { PrismaService } from 'src/prisma/prisma.service';

type GameType = 'MOBILE' | 'PC' | 'CONSOLE' | 'OTHER';

@Injectable()
export class GamesService {
  constructor(private prisma: PrismaService) {}

  async create(createGameDto: CreateGameDto) {
    const game = await this.prisma.game.create({
      data: createGameDto,
    });
    return {
      success: true,
      data: game,
    };
  }

  async findAll(limit: number = 10, page: number = 1) {
    const skip = (page - 1) * limit;
    const [total, data] = await this.prisma.$transaction([
      this.prisma.game.count({
        where: {
          isActive: true,
        },
      }),
      this.prisma.game.findMany({
        where: {
          isActive: true,
        },
        take: limit,
        skip: skip,
        orderBy: {
          createdAt: 'desc',
        },
        include: {
          _count: {
            select: { packages: true },
          },
        },
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

  async findGameAndPackage(limit: number = 10, page: number = 1) {
    const skip = (page - 1) * limit;
    const [total, data] = await this.prisma.$transaction([
      this.prisma.game.count(),
      this.prisma.game.findMany({
        take: limit,
        skip: skip,
        orderBy: {
          createdAt: 'desc',
        },
        include: {
          packages: true,
        },
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

  async findUnique(name: string) {
    return this.prisma.game.findUnique({
      where: { name },
    });
  }

  async findGameAll(limit: number = 10, page: number = 1) {
    const skip = (page - 1) * limit;
    const [total, data] = await this.prisma.$transaction([
      this.prisma.game.count(),
      this.prisma.game.findMany({
        take: limit,
        skip: skip,
        orderBy: {
          createdAt: 'desc',
        },
        include: {
          _count: {
            select: { packages: true },
          },
        },
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

  findOne(id: string) {
    return this.prisma.game.findUnique({
      where: { id },
      include: { packages: true },
    });
  }

  findByType(type: GameType) {
    return this.prisma.game.findMany({
      where: { category: type },
    });
  }

  async search(query: string, limit: number = 10, page: number = 1) {
    const skip = (page - 1) * limit;

    const [total, data] = await this.prisma.$transaction([
      this.prisma.game.count({
        where: {
          OR: [{ name: { contains: query } }],
          isActive: true,
        },
      }),
      this.prisma.game.findMany({
        where: {
          OR: [{ name: { contains: query } }],
          isActive: true,
        },
        take: limit,
        skip: skip,
        orderBy: {
          createdAt: 'desc',
        },
        include: {
          _count: {
            select: { packages: true },
          },
        },
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

  async update(id: string, updateGameDto: UpdateGameDto) {
    const game = await this.prisma.game.update({
      where: { id },
      data: {
        ...updateGameDto,
      },
    });
    return {
      success: true,
      data: game,
    };
  }

  remove(id: string) {
    return this.prisma.game.delete({
      where: { id },
    });
  }
}
