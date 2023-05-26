import { Test, TestingModule } from '@nestjs/testing';
import { EventConsumerController } from './event-consumer.controller';
import { EventConsumerService } from './event-consumer.service';

describe('EventConsumerController', () => {
  let eventConsumerController: EventConsumerController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [EventConsumerController],
      providers: [EventConsumerService],
    }).compile();

    eventConsumerController = app.get<EventConsumerController>(EventConsumerController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(eventConsumerController.getHello()).toBe('Hello World!');
    });
  });
});
