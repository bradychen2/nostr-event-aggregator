import { Event } from '@app/event-lib/domain/Event';
import { IRepository } from './repository.abstract';

export abstract class IDataServices {
  event!: IRepository<Event>;
}
