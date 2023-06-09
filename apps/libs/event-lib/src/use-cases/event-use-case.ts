import { Injectable } from '@nestjs/common';
import { Event } from '../domain/Event';
import { IDataServices } from '../framework/data-services/abstract/data-services.abstract';

@Injectable()
export class EventUseCase {
  constructor(private dataServices: IDataServices) {}

  public async getLatestEvents(limit: number): Promise<Event[]> {
    try {
      const events = await this.dataServices.event.getLatest(limit);
      return events;
    } catch (error) {
      if (error instanceof Error) {
        console.log(error.message);
        throw error;
      }
      throw new Error(`Error getting latest events: ${error}`);
    }
  }

  public async createEvent(event: Event): Promise<Event> {
    try {
      await this.dataServices.event.create(event);
      return event;
    } catch (error) {
      if (error instanceof Error) {
        console.log(error.message);
        throw error;
      }
      throw new Error(`Error receiving event: ${error}`);
    }
  }
}
