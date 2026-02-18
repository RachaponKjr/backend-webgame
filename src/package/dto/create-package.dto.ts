import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNumber, IsOptional, MinLength } from 'class-validator';
import { IsString } from 'class-validator';

export class CreatePackageDto {
  @ApiProperty()
  @MinLength(3)
  @IsString()
  name: string;

  @ApiProperty()
  @IsNumber()
  amount: number;

  @ApiProperty()
  @IsNumber()
  price: number;

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  discount: number;

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  cost: number;

  @ApiProperty()
  @IsOptional()
  @MinLength(3)
  @IsString()
  icon_base64: string;

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  bonus: number;

  @ApiProperty()
  @MinLength(3)
  @IsString()
  gameId: string;

  @ApiProperty()
  @IsBoolean()
  recommend: boolean;

  @ApiProperty()
  @IsBoolean()
  isActive: boolean;
}
