export enum TransactionStatus {
  SUCCESS = '1',
  FAILED = '0',
  PENDING = '2',
}

export enum TransactionType {
  DEPOSIT = 'DEPOSIT',
  WITHDRAW = 'WITHDRAW',
  USER_PAY_ORDER = 'PAY_ORDER',
  TOURGUIDE_ORDER = 'TOURGUIDE_ORDER',
  SYSTEM_USER_PAYORDER = 'SYSTEM_PAY_ORDER',
}
