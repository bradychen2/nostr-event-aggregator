import { Controller } from '@nestjs/common';
import { EventConsumerService } from './event-consumer.service';
import { EventPattern, Payload } from '@nestjs/microservices';
import { ReceivedEventDto } from '@app/event-lib/interface';
@Controller()
export class EventConsumerController {
  constructor(private readonly eventConsumerService: EventConsumerService) {}

  @EventPattern('received_event')
  async handleEvent(@Payload() data: ReceivedEventDto): Promise<void> {
    await this.eventConsumerService.processEvent(data);
  }
}
