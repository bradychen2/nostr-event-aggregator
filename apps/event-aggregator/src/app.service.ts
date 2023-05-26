import { Injectable } from '@nestjs/common';
import { EventAggregator } from './aggregator/event-aggregator';

@Injectable()
export class AppService {
  constructor(private readonly eventAggregator: EventAggregator) {}

  async startEventAggregator(): Promise<void> {
    await this.eventAggregator.onAggregatorInit();
  }
}
