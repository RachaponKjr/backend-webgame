/* eslint-disable @typescript-eslint/no-unsafe-return */
import { Injectable } from '@nestjs/common';
import { CreateBannerDto } from './dto/create-banner.dto';
import { UpdateBannerDto } from './dto/update-banner.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class BannerService {
  constructor(private prisma: PrismaService) {}

  create(createBannerDto: CreateBannerDto) {
    return this.prisma.banner.create({
      data: createBannerDto,
    });
  }

  findAll() {
    return this.prisma.banner.findMany();
  }

  findOne(id: string) {
    return this.prisma.banner.findUnique({
      where: { id },
    });
  }

  update(id: string, updateBannerDto: UpdateBannerDto) {
    return this.prisma.banner.update({
      where: { id },
      data: updateBannerDto,
    });
  }

  remove(id: string) {
    return this.prisma.banner.delete({
      where: { id },
    });
  }
}
