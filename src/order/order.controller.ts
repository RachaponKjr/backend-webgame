import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  DefaultValuePipe,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { ApiQuery, ApiResponse } from '@nestjs/swagger';

@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  create(@Body() createOrderDto: CreateOrderDto) {
    return this.orderService.create(createOrderDto);
  }

  // --- กลุ่ม Static Routes (ย้ายขึ้นมาไว้ก่อน) ---

  @Get()
  findAll() {
    return this.orderService.findAll();
  }

  @Get('popular')
  findPopular() {
    return this.orderService.findPopular();
  }

  @Get('waiting')
  @ApiResponse({ status: 200, description: 'Get all orders' })
  @ApiQuery({ name: 'limit', type: Number, required: false })
  @ApiQuery({ name: 'page', type: Number, required: false })
  findPandding(
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
  ) {
    return this.orderService.findPandding(limit, page);
  }

  // --- กลุ่ม Dynamic Routes (ย้ายลงมาข้างล่าง) ---
  @Get('magin-money-today')
  @ApiResponse({ status: 200, description: 'Get all orders' })
  findMaginMoneyToday() {
    return this.orderService.findMaginMoney();
  }

  @Get('magin-money-month')
  @ApiResponse({ status: 200, description: 'Get all orders' })
  findMaginMoneyMonth() {
    return this.orderService.findMaginMoneyMonth();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.orderService.findOne(id);
  }

  @Patch(':id/complete')
  updateStatus(@Param('id') id: string) {
    return this.orderService.updateStatus(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateOrderDto: UpdateOrderDto) {
    return this.orderService.update(id, updateOrderDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.orderService.remove(id);
  }
}
