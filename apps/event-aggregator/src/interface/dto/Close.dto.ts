import { MsgType } from 'apps/event-aggregator/src/domain/constant';

export type CloseDto = [MsgType.CLOSE, string];
