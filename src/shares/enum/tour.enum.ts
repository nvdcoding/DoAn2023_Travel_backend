export enum TourStatus {
  WAITING = `2`,
  INACTIVE = `0`,
  ACTIVE = `1`,
  REJECTED = `3`,
}

export enum GetBy {
  PROVINCE = 'province',
  TOUR_GUIDE = 'tour_guide',
}

export enum AdminApproveAction {
  APPROVE = 'APPROVE',
  REJECT = 'REJECT',
}

export enum TourTypes {
  ECO_TOURISM = 'Ecotourism',
  CULTURAL = 'Cultural',
  RESORT = 'Resort',
  ENTERTAINMENT = 'Entertainment',
  SPORTS = 'Sports',
  DISCOVERY = 'Discovery',
  ADVENTURE = 'Adventure',
}
