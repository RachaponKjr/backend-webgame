import { PartialType } from '@nestjs/swagger';
import { CreateBlogDto } from './create-blog.dto';
import { IsDate, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateBlogDto extends PartialType(CreateBlogDto) {
  @ApiProperty()
  @IsDate()
  @IsOptional()
  updatedAt?: Date;
}
