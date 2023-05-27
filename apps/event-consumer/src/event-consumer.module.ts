import { Module } from '@nestjs/common';
import { EventConsumerController } from './event-consumer.controller';
import { EventConsumerService } from './event-consumer.service';
import { UseCaseModule } from '@app/event-lib/use-cases';
import { EventPresenter } from '@app/event-lib/interface';
import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';

@Module({
  imports: [
    ConfigModule.forRoot({
      validationSchema: Joi.object({
        DB_HOST: Joi.string().required(),
        DB_PORT: Joi.number().required(),
        DB_USER: Joi.string().required(),
        DB_PASSWORD: Joi.string().required(),
        DB_NAME: Joi.string().required(),
        PORT: Joi.number(),
      }),
      isGlobal: true,
    }),
    UseCaseModule,
  ],
  controllers: [EventConsumerController],
  providers: [EventConsumerService, EventPresenter],
})
export class EventConsumerModule {}
