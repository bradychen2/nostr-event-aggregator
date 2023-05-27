import { MsgType } from '../../domain/constant';

class EventDetail {
  id!: string;
  pubkey!: string;
  created_at!: number;
  kind!: number;
  tags: string[][] = [];
  content!: string;
  sig!: string;
}

export type ReceivedEventDto = [MsgType.EVENT, string, EventDetail];
