import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';
import { EventAggregatorModule } from './aggregator/event-aggregator.module';
import { DataServicesModule } from './framework/data-services/data-services.module';

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
    EventAggregatorModule,
    DataServicesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
