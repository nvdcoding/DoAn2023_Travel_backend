export const zaloConfig = {
  APP_ID: +process.env.ZALO_PAY_APPID,
  ZALO_PAY_KEY1: process.env.ZALO_PAY_KEY1,
  ZALO_PAY_KEY2: process.env.ZALO_PAY_KEY2,
  ZALO_PAY_URL: process.env.ZALO_PAY_URL,
};

export const vnPayConfig = {
  TMN_CODE: process.env.VNPAY_TMN_CODE,
  HASH_SECRET: process.env.VNPAY_HASH_SECRET,
  URL: process.env.VNPAY_URL,
  RETURN_URL_MOBILE: process.env.VNPAY_RETURN_URL,
  RETURN_URL_WEB: process.env.VNPAY_WEB_RETURN_URL,
};
