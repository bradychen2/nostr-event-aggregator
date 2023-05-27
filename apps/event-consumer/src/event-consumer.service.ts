import { EventPresenter, ReceivedEventDto } from '@app/event-lib/interface';
import { EventUseCase } from '@app/event-lib/use-cases';
import { Injectable } from '@nestjs/common';

@Injectable()
export class EventConsumerService {
  constructor(
    private readonly eventUseCase: EventUseCase,
    private readonly eventPresenter: EventPresenter,
  ) {}

  async processEvent(event: ReceivedEventDto): Promise<void> {
    console.log(`received event: ${JSON.stringify(event)}`);
    const eventEntity = this.eventPresenter.dtoToEntity(event);
    await this.eventUseCase.createEvent(eventEntity);
    console.log(`stored event to db`);
  }
}
