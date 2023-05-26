import { Event } from 'apps/event-aggregator/src/domain/Event';
import { IRepository } from './repository.abstract';

export abstract class IDataServices {
  event!: IRepository<Event>;
}
