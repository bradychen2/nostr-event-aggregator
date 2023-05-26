import { Module } from '@nestjs/common';
import { DataServicesModule } from 'apps/event-aggregator/src/framework/data-services/data-services.module';
import { EventUseCase } from './event-use-case';

@Module({
  imports: [DataServicesModule],
  controllers: [],
  providers: [EventUseCase],
  exports: [EventUseCase],
})
export class UseCaseModule {}
