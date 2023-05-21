import { Module } from '@nestjs/common';
import { UseCaseModule } from 'src/use-cases/use-cases.module';
import { EventAggregator } from './event-aggregator';
import { EventPresenter } from 'src/interface/presenter/event-presenter';

@Module({
  imports: [UseCaseModule],
  providers: [EventAggregator, EventPresenter],
  exports: [EventAggregator],
})
export class EventAggregatorModule {}
