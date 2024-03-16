import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, MoreThan, Repository } from 'typeorm';
import { CreateEventDto } from './create-event.dto';
import { Event } from './event.entity';
import { UpdateEventDto } from './update-event.dto';

@Controller('/events')
export class EventsController {
  constructor(
    @InjectRepository(Event)
    private readonly repository: Repository<Event>,
  ) {}

  @Get()
  async findAll(@Query('search') search = '') {
    return await this.repository.find({
      where: {
        name: Like(`%${search}%`),
      },
    });
  }

  @Get('/practice')
  async practice(@Query('search') search: string) {
    return await this.repository.find({
      where: [
        // filtering
        {
          id: MoreThan(3),
          when: MoreThan(new Date('2021-02-12T13:00:00')),
        },
        {
          name: Like(`%${search}%`),
        },
      ],
      select: ['id', 'name', 'description', 'when'], // field limiting
      take: 2, // pagination
      skip: 0,
      order: {
        // sorting
        id: 'DESC',
      },
    });
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id) {
    return await this.repository.findOneBy({ id });
  }

  @Post()
  async create(@Body() input: CreateEventDto) {
    return await this.repository.save({
      ...input,
      when: new Date(input.when),
    });
  }

  @Patch(':id')
  async update(@Param('id', ParseIntPipe) id, @Body() input: UpdateEventDto) {
    const event = await this.repository.findOneBy({ id });

    return await this.repository.save({
      ...event,
      ...input,
      when: input.when ? new Date(input.when) : event.when,
    });
  }

  @Delete(':id')
  @HttpCode(204)
  async remove(@Param('id', ParseIntPipe) id) {
    const event = await this.repository.findOneBy({ id });
    await this.repository.remove(event);
  }
}
