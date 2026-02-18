import { Injectable } from '@nestjs/common';
import { CreateBlogDto } from './dto/create-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { PostStatus } from 'src/generated/prisma/enums';

@Injectable()
export class BlogsService {
  constructor(private readonly prisma: PrismaService) {}

  create(createBlogDto: CreateBlogDto) {
    return this.prisma.post.create({
      data: {
        ...createBlogDto,
        status: (createBlogDto.status as PostStatus) || PostStatus.DRAFT,
        viewCount: createBlogDto.viewCount || 0,
      },
    });
  }

  async findAll(limit: number, page: number) {
    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      this.prisma.post.findMany({
        take: limit,
        skip,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.post.count(),
    ]);
    return { data, total, page, limit };
  }

  findOne(id: string) {
    return this.prisma.post.findUnique({
      where: { id },
    });
  }

  update(id: string, updateBlogDto: UpdateBlogDto) {
    return this.prisma.post.update({
      where: { id },
      data: {
        ...updateBlogDto,
        status: (updateBlogDto.status as PostStatus) || PostStatus.DRAFT,
        viewCount: updateBlogDto.viewCount || 0,
        updatedAt: new Date(),
      },
    });
  }

  updateView(id: string) {
    return this.prisma.post.update({
      where: { id },
      data: {
        viewCount: { increment: 1 },
      },
    });
  }

  remove(id: string) {
    return this.prisma.post.delete({
      where: { id },
    });
  }
}
