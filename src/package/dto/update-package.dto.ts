import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreatePackageDto } from './create-package.dto';
import { IsNumber, IsString } from 'class-validator';

export class UpdatePackageDto extends PartialType(CreatePackageDto) {
  @IsString()
  @ApiProperty()
  name: string;

  @IsString()
  @ApiProperty()
  amount: number;

  @IsString()
  @ApiProperty()
  price: number;

  @IsString()
  @ApiProperty()
  discount?: number;

  @IsString()
  @ApiProperty()
  cost: number;

  @IsString()
  @ApiProperty()
  icon_base64: string;

  @IsNumber()
  @ApiProperty()
  bonus?: number;

  @IsString()
  @ApiProperty()
  gameId: string;

  @IsString()
  @ApiProperty()
  recommend: boolean;

  @IsString()
  @ApiProperty()
  isActive: boolean;
}
