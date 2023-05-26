import { Event } from 'apps/event-aggregator/src/domain/Event';
import { DataModel } from 'apps/event-aggregator/src/framework/data-services/abstract/data-model.abstract';
import { EventModel } from 'apps/event-aggregator/src/framework/database/models/Event.model';

export class EventDataModel implements DataModel<Event, EventModel> {
  public domainToData(domain: Event): EventModel {
    const data = new EventModel();
    data.event_id = domain.id;
    data.pubkey = domain.pubkey;
    data.created_at = domain.created_at;
    data.kind = domain.kind;
    data.tags = JSON.stringify(domain.tags);
    data.content = domain.content;
    data.sig = domain.sig;
    return data;
  }

  public dataToDomain(data: EventModel): Event {
    const domain = new Event({
      id: data.event_id,
      pubkey: data.pubkey,
      created_at: data.created_at,
      kind: data.kind,
      tags: JSON.parse(data.tags),
      content: data.content,
      sig: data.sig,
    });
    return domain;
  }
}
