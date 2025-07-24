export type ShopType = {
  Id: string
  ShopNo: string
  ShopName: string
  ShopIdentifyNumber: string
  ShopAdminTellCountryNoCd: string
  ShopAdminTellNo: string
  ShopAdminEmailAddress: string
  ShopStatusCd: string
  ShopBasicalCurrencyCd: string
  ShopPaymentCurrencyCd: string
  BookingMethodCd: string
  CheckoutTimingCd: string
  ShopCountryCd: string
  ShopBasicalLanguageCd: string
  ShopUrl: string
  IconImagePath?: string
  ShopAdminPicName: string
  ShopAdminPicTellCountryCd: string
  ShopAdminPicTellNo: string
  ShopAdminPicEmailAddress: string
  Rank: string
  WellbeFee: string
}

export type ShopResponseType = {
  result_code: number
  message: string
  shop?: ShopResponseGetType
  shop_admin_pic_name?: ShopAdminPicResponseGetType
  shop_booking_fee?: ShopBookingFeeResponseGetType
  shops?: ShopResponseGetType[]
}

export type ShopResponseGetType = {
  id: string
  shop_no: string
  shop_name: string
  shop_identify_number: string
  shop_admin_tell_country_no_cd: number
  shop_admin_tell_no: string
  shop_admin_email_address: string
  shop_status_cd: number
  shop_basical_currency_cd: number
  shop_payment_currency_cd: number
  booking_method_cd: number
  checkout_timing_cd: number
  shop_country_cd: number
  shop_basical_language_cd: number
  shop_url: string
  country_no: string
  shop_status_name: string
  basical_currency_cd_iso: string
  payment_currency_cd_iso: string
  booking_method_name: string
  country_name: string
  language_name: string
  rank: number
  transition_all: number
  transition_last_month: number
  reservation_limit_total_day: number
}

export type ShopAdminPicResponseGetType = {
  shop_id: string
  shop_admin_pic_name: string
  shop_admin_pic_tell_country_cd: number
  shop_admin_pic_tell_no: string
  shop_admin_pic_email_address: string
}

export type ShopBookingFeeResponseGetType = {
  shop_id: string
  fee_rate: number
}

export type ShopPaymentResponseType = {
  result_code: number
  message: string
  shops?: ShopPaymentResponseGetType[]
}

export type ShopPaymentResponseGetType = {
  id: string
  shop_no: string
  shop_name: string
  shop_status_cd: number
  shop_status_name: string
  checkout_count: number
  checkout_amount: number
  currency_cd: number
  currency_cd_iso: string
}
