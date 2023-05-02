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
  ECO_TOURISM = 'Ecotourism', // Du lịch sinh thái
  CULTURAL = 'Cultural', // du lịch văn hóa
  RESORT = 'Resort', // du lịch nghĩ dưỡng
  ENTERTAINMENT = 'Entertainment', // du lịch giải trí
  SPORTS = 'Sports', // du lịch thể thao
  DISCOVERY = 'Discovery', // du lịch khám phá
  ADVENTURE = 'Adventure', // du lịch phiêu lưu
}
