import { emailConfig } from 'src/configs/email.config';

export const httpErrors = {
  //AUTH
  UNAUTHORIZED: {
    message: 'Unauthorized',
    code: 'ERR_AUTH_001',
  },
  // User
  USER_EXIST: {
    message: 'User exist',
    code: 'ERR_USER_001',
  },
  USER_NOT_FOUND: {
    message: 'User not found',
    code: 'ERR_USER_002',
  },
  USER_NOT_ACTIVE: {
    message: 'User is not active',
    code: 'ERR_USER_003',
  },
  USER_LOGIN_FAIL: {
    message: 'Email or password not match',
    code: 'ERR_USER_004',
  },
  USER_INSUFFICIENT_BALANCE: {
    message: 'Insufficient balance !',
    code: 'ERR_USER_005',
  },
  // Admin
  ADMIN_EXIST: {
    message: 'Admin existed',
    code: 'ERR_ADMIN_001',
  },
  ADMIN_NOT_FOUND: {
    message: 'Admin not found',
    code: 'ERR_ADMIN_002',
  },
  // Email
  WAIT_TO_RESEND: {
    message: `Please wait for ${emailConfig.registerTTL} seconds to resend`,
    code: `ERR_EMAIL_001`,
  },
  //REGISTER
  REGISTER_TOKEN_NOT_FOUND: {
    message: `Register token not found`,
    code: `ERR_REGISTER_001`,
  },
  REGISTER_TOKEN_NOT_MATCH: {
    message: `Register token not match`,
    code: `ERR_REGISTER_002`,
  },
  //FORGOT PASSWORD
  FORGOT_PASSWORD_DIFFERENCE_PASSWORD: {
    message: 'New password must difference password',
    code: 'ERR_FORGOT_PASSWORD_001',
  },
  FORGOT_PASSWORD_OTP_NOT_MATCH: {
    message: 'Otp not match',
    code: 'ERR_FORGOT_PASSWORD_002',
  },
  // PROVINCE
  PROVINCE_NOT_FOUND: {
    message: 'Province not found',
    code: 'ERR_PROVINCE_001',
  },
  //TOUR
  TOUR_EXIST: {
    message: 'Tour existed',
    code: 'ERR_TOUR_001',
  },
  TOUR_NOT_FOUND: {
    message: 'Tour not found',
    code: 'ERR_TOUR_002',
  },
  //TOUR GUIDE
  TOUR_GUIDE_NOT_FOUND: {
    message: 'Tour guide not found',
    code: 'ERR_TOUR_GUIDE_001',
  },
  TOUR_GUIDE_NOT_ACTIVE: {
    message: 'Tour guide not active',
    code: 'ERR_TOUR_GUIDE_002',
  },
  TOUR_GUIDE_EXIST: {
    message: 'Tour guide existed',
    code: 'ERR_TOUR_GUIDE_003',
  },
  INTERVIEW_DATE_NOT_VALID: {
    message: 'Interview date is not valid',
    code: 'ERR_TOUR_GUIDE_004',
  },
  INVALID_STATUS: {
    message: 'Status change is not valid',
    code: 'ERR_TOUR_GUIDE_005',
  },
  // ORDER
  NUM_OF_MEMBER_INVALID: {
    message: 'Number of member is not valid',
    code: 'ERR_ORDER_001',
  },
  ORDER_NOT_FOUND: {
    message: 'Order not found',
    code: 'ERR_ORDER_002',
  },
  ORDER_PAID_NOT_VALID: {
    message: 'Order paid is not valid',
    code: 'ERR_ORDER_003',
  },
  ORDER_DATE_NOT_VALID: {
    message: 'Order date is not valid',
    code: 'ERR_ORDER_004',
  },
  ORDER_PREPAID_NOT_VALID: {
    message: 'Order prepaid not valid',
    code: 'ERR_ORDER_005',
  },
  // VOUCHER
  VOUCHER_EXIST: {
    message: 'Voucher exist',
    code: 'ERR_VOUCHER_001',
  },
  VOUCHER_NOT_FOUND: {
    message: 'Voucher not found',
    code: 'ERR_VOUCHER_002',
  },
  VOUCHER_QUANTITY_NOT_VALID: {
    message: 'Its all been taken',
    code: 'ERR_VOUCHER_003',
  },
  VOUCHER_EXPIRED: {
    message: 'Voucher has expired',
    code: 'ERR_VOUCHER_004',
  },
  NOT_ENOUGHT_VOUCHER_POINT: {
    message: 'Not have enough point to claim',
    code: 'ERR_VOUCHER_005',
  },
  VOUCHER_NOT_ENOUGH: {
    message: 'Quantity voucher not enough',
    code: 'ERR_VOUCHER_006',
  },
  VOUCHER_ALREADY_CLAIM: {
    message: 'Voucher already claimed',
    code: 'ERR_VOUCHER_007',
  },

  //RATE
  RATE_EXISTED: {
    message: 'Rate existed',
    code: 'ERR_RATE_001',
  },
};
