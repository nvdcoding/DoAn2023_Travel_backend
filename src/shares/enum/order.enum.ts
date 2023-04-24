export enum OrderStatus {
  WAITING_TOUR_GUIDE = '0',
  WAITING_PURCHASE = '1',
  WAITING_START = '2',
  PROCESSING = '3',
  DONE = '4',
  REJECTED = '5',
}

export enum GetTourOptions {
  ALL = 'all',
  WAITING = 'waiting',
  PROCESSING = 'processing',
  END = 'end',
}

export enum ActionApproveOrder {
  ACCEPT = 'accept',
  REJECT = 'reject',
}
