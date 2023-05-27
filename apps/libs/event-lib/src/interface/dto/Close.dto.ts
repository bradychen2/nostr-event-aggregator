import { MsgType } from '@app/event-lib/domain/constant';

export type CloseDto = [MsgType.CLOSE, string];
