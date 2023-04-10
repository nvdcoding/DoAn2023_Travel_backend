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
  // ORDER
  NUM_OF_MEMBER_INVALID: {
    message: 'Number of member is not valid',
    code: 'ERR_ORDER_001',
  },
  ORDER_NOT_FOUND: {
    message: 'Order not found',
    code: 'ERR_ORDER_002',
  },
};
