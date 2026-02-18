import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsEnum,
  IsNumber,
  IsOptional,
  IsObject,
} from 'class-validator';

export class CreateOrderDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  gameAccount: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  gameId: string;

  @ApiProperty({ enum: ['PENDING', 'PROCESSING', 'COMPLETED', 'CANCEL'] })
  @IsEnum(['PENDING', 'PROCESSING', 'COMPLETED', 'CANCEL'])
  @IsOptional()
  status?: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'CANCEL';

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  packageId: string;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  totalPrice: number;

  @ApiProperty({ type: Object, required: false })
  @IsObject()
  @IsOptional()
  meta?: Record<string, any>;

  @ApiProperty()
  @IsString()
  @IsOptional()
  userId?: string;
}
