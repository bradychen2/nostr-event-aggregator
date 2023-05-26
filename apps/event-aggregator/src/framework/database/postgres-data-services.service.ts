import { Injectable, OnModuleInit } from '@nestjs/common';
import { IDataServices } from '../data-services/abstract/data-services.abstract';
import { InjectRepository } from '@nestjs/typeorm';
import { EventModel } from 'apps/event-aggregator/src/framework/database/models/Event.model';
import { Repository } from 'typeorm';
import { PostgresGenericRepository } from './postgres-generic-repository';
import { Event } from 'apps/event-aggregator/src/domain/Event';
import { EventDataModel } from 'apps/event-aggregator/src/interface/data-model/event-data-model';

@Injectable()
export class PostgresDataServices implements IDataServices, OnModuleInit {
  event!: PostgresGenericRepository<EventModel, Event>;

  constructor(
    @InjectRepository(EventModel)
    private eventRepository: Repository<EventModel>,
  ) {}

  onModuleInit() {
    this.event = new PostgresGenericRepository<EventModel, Event>(
      this.eventRepository,
      new EventDataModel(),
    );
  }
}
