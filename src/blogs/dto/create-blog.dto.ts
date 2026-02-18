import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsEnum,
  IsNumber,
} from 'class-validator';

export class CreateBlogDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  tag?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  metaTitle?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  metaDescription?: string;

  @ApiProperty()
  @IsEnum(['DRAFT', 'PUBLISHED'])
  @IsOptional()
  status?: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  content: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  imageUrl?: string;

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  viewCount?: number;
}
