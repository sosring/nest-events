import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EventsController } from './events.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import 'dotenv/config';

import ormConfig from './config/orm.config';
import { Event } from './event.entity';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: ormConfig,
    }),
    TypeOrmModule.forFeature([Event]),
  ],
  providers: [AppService],
  controllers: [AppController, EventsController],
})
export class AppModule {}
