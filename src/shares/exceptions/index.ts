import { emailConfig } from 'src/configs/email.config';

export const httpErrors = {
  UNAUTHORIZED: {
    message: 'Tài khoản không hợp lệ',
    code: 'ERR_AUTH_001',
  },
  // User
  USER_EXIST: {
    message: 'Người dùng đã tồn tại',
    code: 'ERR_USER_001',
  },
  USER_NOT_FOUND: {
    message: 'Người dùng không tồn tại',
    code: 'ERR_USER_002',
  },
  USER_NOT_ACTIVE: {
    message: 'Người dùng chưa được kích hoạt',
    code: 'ERR_USER_003',
  },
  USER_LOGIN_FAIL: {
    message: 'Email hoặc mật khẩu không khớp',
    code: 'ERR_USER_004',
  },
  USER_INSUFFICIENT_BALANCE: {
    message: 'Số dư không đủ!',
    code: 'ERR_USER_005',
  },
  // Admin
  ADMIN_EXIST: {
    message: 'Quản trị viên đã tồn tại',
    code: 'ERR_ADMIN_001',
  },
  ADMIN_NOT_FOUND: {
    message: 'Quản trị viên không tồn tại',
    code: 'ERR_ADMIN_002',
  },
  // Email
  WAIT_TO_RESEND: {
    message: `Vui lòng đợi ${emailConfig.registerTTL} giây để gửi lại`,
    code: `ERR_EMAIL_001`,
  },
  //REGISTER
  REGISTER_TOKEN_NOT_FOUND: {
    message: `Không tìm thấy mã token đăng ký`,
    code: `ERR_REGISTER_001`,
  },
  REGISTER_TOKEN_NOT_MATCH: {
    message: `Mã token đăng ký không khớp`,
    code: `ERR_REGISTER_002`,
  },
  //FORGOT PASSWORD
  FORGOT_PASSWORD_DIFFERENCE_PASSWORD: {
    message: 'Mật khẩu mới phải khác mật khẩu cũ',
    code: 'ERR_FORGOT_PASSWORD_001',
  },
  FORGOT_PASSWORD_OTP_NOT_MATCH: {
    message: 'OTP không khớp',
    code: 'ERR_FORGOT_PASSWORD_002',
  },
  // PROVINCE
  PROVINCE_NOT_FOUND: {
    message: 'Tỉnh/Thành phố không tồn tại',
    code: 'ERR_PROVINCE_001',
  },
  //TOUR
  TOUR_EXIST: {
    message: 'Tour đã tồn tại',
    code: 'ERR_TOUR_001',
  },
  TOUR_NOT_FOUND: {
    message: 'Tour không tồn tại',
    code: 'ERR_TOUR_002',
  },
  //TOUR GUIDE
  TOUR_GUIDE_NOT_FOUND: {
    message: 'Hướng dẫn viên không tồn tại',
    code: 'ERR_TOUR_GUIDE_001',
  },
  TOUR_GUIDE_NOT_ACTIVE: {
    message: 'Hướng dẫn viên chưa kích hoạt',
    code: 'ERR_TOUR_GUIDE_002',
  },
  TOUR_GUIDE_EXIST: {
    message: 'Hướng dẫn viên đã tồn tại',
    code: 'ERR_TOUR_GUIDE_003',
  },
  INTERVIEW_DATE_NOT_VALID: {
    message: 'Ngày phỏng vấn không hợp lệ',
    code: 'ERR_TOUR_GUIDE_004',
  },
  INVALID_STATUS: {
    message: 'Status change is not valid',
    code: 'ERR_TOUR_GUIDE_005',
  },
  TOURGUIDE_HAS_ORDER: {
    message: 'Cant process because tourguide have open order',
    code: 'ERR_TOUR_GUIDE_006',
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
    message: 'Bạn không đủ KCoin để đổi voucher này',
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
  // PSOT
  POST_EXISTED: {
    message: 'Post existed',
    code: 'ERR_POST_001',
  },
  POST_NOT_FOUND: {
    message: 'Post not found',
    code: 'ERR_POST_002',
  },

  // PẨM_
  INVALID_PARAMS: {
    message: 'Invalid params',
    code: 'ERR_PARAM_001',
  },
  // REQUEST
  REQUEST_NOT_FOUND: {
    message: 'Request not found',
    code: 'ERR_REQUEST_001',
  },
  //REPORT
  REPORT_NOT_FOUND: {
    message: 'Report not found',
    code: 'ERR_REPORT_001',
  },
};
