import { Module } from '@nestjs/common';
import { EventConsumerController } from './event-consumer.controller';
import { EventConsumerService } from './event-consumer.service';

@Module({
  imports: [],
  controllers: [EventConsumerController],
  providers: [EventConsumerService],
})
export class EventConsumerModule {}
