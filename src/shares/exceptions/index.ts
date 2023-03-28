import { emailConfig } from 'src/configs/email.config';

export const httpErrors = {
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
};
