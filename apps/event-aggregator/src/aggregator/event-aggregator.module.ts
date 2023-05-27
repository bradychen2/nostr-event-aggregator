import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { EventAggregator } from './event-aggregator';
import { UseCaseModule } from '@app/event-lib/use-cases';
import { EventPresenter } from '@app/event-lib/interface';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'EVENT_AGGREGATOR_SERVICE',
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: 'event-aggregator',
            brokers: ['localhost:9092'],
          },
          producerOnlyMode: true,
          consumer: {
            groupId: 'event-consumer',
          },
        },
      },
    ]),
    UseCaseModule,
  ],
  providers: [EventAggregator, EventPresenter],
  exports: [EventAggregator],
})
export class EventAggregatorModule {}
