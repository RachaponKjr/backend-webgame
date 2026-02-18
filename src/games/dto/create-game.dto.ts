import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsOptional, IsString, MinLength } from 'class-validator';

export class CreateGameDto {
  @IsString()
  @ApiProperty()
  @MinLength(3)
  name: string;

  @IsString()
  @ApiProperty()
  category: 'MOBILE' | 'PC' | 'CONSOLE' | 'OTHER';

  @IsString()
  @IsOptional()
  @ApiPropertyOptional()
  videoUrl?: string;

  @IsString()
  @ApiProperty()
  imageUrl: string;

  @IsBoolean()
  @IsOptional()
  @ApiProperty()
  isActive?: boolean;

  @IsOptional()
  @ApiPropertyOptional()
  config?: string;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional()
  imageBannerUrl?: string;
}
