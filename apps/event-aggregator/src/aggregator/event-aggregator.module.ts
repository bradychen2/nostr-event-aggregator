import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { UseCaseModule } from 'apps/event-aggregator/src/use-cases/use-cases.module';
import { EventAggregator } from './event-aggregator';
import { EventPresenter } from 'apps/event-aggregator/src/interface/presenter/event-presenter';

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
