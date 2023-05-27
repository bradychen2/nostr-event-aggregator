import { Injectable, OnModuleInit } from '@nestjs/common';
import { IDataServices } from '../data-services/abstract/data-services.abstract';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PostgresGenericRepository } from './postgres-generic-repository';
import { Event } from '../../domain/Event';
import { EventModel } from './models';
import { EventDataModel } from '../../interface';

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
