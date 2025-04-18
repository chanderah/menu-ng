export interface WsMessage<T = any> {
  type: 'new_order';
  data: T;
  url?: string;
}
