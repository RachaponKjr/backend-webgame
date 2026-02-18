import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsString } from 'class-validator';

export class CreateBannerDto {
  @ApiProperty()
  @IsString()
  imageUrl: string;

  @ApiProperty()
  @IsBoolean()
  isActive: boolean;

  @ApiProperty()
  @IsString()
  title: string;

  @ApiProperty()
  @IsString()
  linkUrl: string;

  @ApiProperty()
  @IsString()
  description: string;
}
