import { NestFactory } from '@nestjs/core';
import { Transport } from '@nestjs/microservices';
import { EventConsumerModule } from './event-consumer.module';

async function bootstrap() {
  const app = await NestFactory.createMicroservice(EventConsumerModule, {
    transport: Transport.KAFKA,
    options: {
      client: {
        brokers: ['localhost:9092'],
      },
      consumer: {
        groupId: 'event-consumer',
      },
    },
  });
  await app.listen();
}
bootstrap();
