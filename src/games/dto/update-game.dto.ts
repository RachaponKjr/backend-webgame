import { PartialType } from '@nestjs/mapped-types';
import { CreateGameDto } from './create-game.dto';
import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { MinLength } from 'class-validator';
import { IsOptional } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean } from 'class-validator';

export class UpdateGameDto extends PartialType(CreateGameDto) {
  @IsString()
  @ApiProperty()
  @IsOptional()
  @MinLength(3)
  name?: string;

  @IsString()
  @IsOptional()
  @ApiProperty()
  category?: 'MOBILE' | 'PC' | 'CONSOLE' | 'OTHER';

  @IsString()
  @IsOptional()
  @ApiPropertyOptional()
  videoUrl?: string;

  @IsString()
  @IsOptional()
  @ApiProperty()
  imageUrl?: string;

  @IsOptional()
  @ApiPropertyOptional()
  config?: any;

  @IsBoolean()
  @IsOptional()
  @ApiProperty()
  isActive?: boolean;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional()
  imageBannerUrl?: string;
}
