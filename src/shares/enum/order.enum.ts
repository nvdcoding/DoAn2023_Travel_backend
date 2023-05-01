export enum OrderStatus {
  WAITING_TOUR_GUIDE = '0',
  WAITING_PREPAID = '1',
  WAITING_PURCHASE = '2',
  WAITING_START = '3',
  PROCESSING = '4',
  DONE = '5',
  REJECTED = '6',
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

export enum Direction {
  ASC = 'ASC',
  DESC = 'DESC',
}
