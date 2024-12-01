export type ShopBookingResponseType = {
  result_code: number
  message: string
  shop_bookings?: ShopBookingResponseGetType[]
}

export type ShopBookingResponseGetType = {
  id: string
  shop_id: string
  booking_id: string
  booking_no: string
  date_of_booking: string
  time_of_booking: string
  end_date: string
  end_time: string
  booking_status_cd: number
  booking_status_name: string
  booking_chanel_cd: number
  booking_chanel_name: string
  request: string
  cancel_datetime: string
  booking_amount_basical_currency_base: number
  basical_currency_cd: number
  basical_currency_name: string
  basical_currency_cd_iso: string
  booking_amount_payment_currency_base: number
  payment_currency_cd: number
  payment_currency_name: string
  payment_currency_cd_iso: string
  cancel_penalty_amount: number
  shop_booking_memo: string
  customer_no: string
  customer_name: string
  customer_tell_country_no_cd: number
  tell_country_no: string
  customer_tell_no: string
  global_tell_country_no: string
  customer_email_address: string
  customer_gender_cd: number
  gender_name: string
  customer_birth_date: string
  customer_local_country_cd: number
  country_name: string
  customer_account_id: string
  customer_memo: string
  shop_booking_menus: ShopBookingMenuResponseGetType[]
}

export type ShopBookingMenuResponseGetType = {
  id: string
  shop_booking_id: string
  gender_cd: number
  treatment_time: number
  required_time: number
  start_time: string
  end_time: string
  currency_cd: number
  amount: number
  shop_staff_id: string
  shop_booking_menu_details: ShopBookingMenuDetailResponseGetType[]
}

export type ShopBookingMenuDetailResponseGetType = {
  id: string
  shop_booking_menu_id: string
  shop_menu_id: string
  menu_name: string
  menu_description: string
}
