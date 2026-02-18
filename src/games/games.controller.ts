import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  DefaultValuePipe,
  ParseIntPipe,
  ConflictException,
} from '@nestjs/common';
import { GamesService } from './games.service';
import { CreateGameDto } from './dto/create-game.dto';
import { UpdateGameDto } from './dto/update-game.dto';
import { ApiQuery, ApiResponse } from '@nestjs/swagger';
import { Game } from './entities/game.entity';

type GameType = 'MOBILE' | 'PC' | 'CONSOLE' | 'OTHER';

@Controller(`games`)
export class GamesController {
  constructor(private readonly gamesService: GamesService) {}

  @Post()
  async create(@Body() createGameDto: CreateGameDto) {
    const existingGame = await this.gamesService.findUnique(createGameDto.name);
    if (existingGame) {
      throw new ConflictException('ชื่อเกมนี้มีอยู่ในระบบแล้ว');
    }
    return this.gamesService.create(createGameDto);
  }

  @Get()
  @ApiResponse({ status: 200, type: [Game] })
  @ApiQuery({ name: 'limit', type: Number, required: false })
  @ApiQuery({ name: 'page', type: Number, required: false })
  async findAll(
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
  ) {
    return this.gamesService.findAll(limit, page);
  }

  @Get('game')
  @ApiResponse({ status: 200, type: [Game] })
  @ApiQuery({ name: 'limit', type: Number, required: false })
  @ApiQuery({ name: 'page', type: Number, required: false })
  findGameAndPackage(
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit?: number,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page?: number,
  ) {
    return this.gamesService.findGameAndPackage(limit, page);
  }

  @Get('all')
  @ApiResponse({ status: 200, type: [Game] })
  async findGameAll(
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit?: number,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page?: number,
  ) {
    return this.gamesService.findGameAll(limit, page);
  }

  @Get('search')
  @ApiResponse({ status: 200, type: [Game] })
  @ApiQuery({ name: 'q', type: String })
  @ApiQuery({ name: 'limit', type: Number, required: false })
  @ApiQuery({ name: 'page', type: Number, required: false })
  async search(
    @Query('q') q: string = '',
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
  ) {
    return this.gamesService.search(q, limit, page);
  }

  @Get('type')
  @ApiResponse({ status: 200, type: [Game] })
  @ApiQuery({ name: 'type', enum: ['MOBILE', 'PC', 'CONSOLE', 'OTHER'] })
  findByType(@Query('type') type: GameType) {
    return this.gamesService.findByType(type);
  }

  @Get(':id')
  @ApiResponse({ status: 200, type: Game })
  findOne(@Param('id') id: string) {
    return this.gamesService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateGameDto: UpdateGameDto) {
    return this.gamesService.update(id, updateGameDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.gamesService.remove(id);
  }
}
