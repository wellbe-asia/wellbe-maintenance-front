export type ShopBookingType = {
  shopId: string
  date: string
  startTime: string
  endTime: string
  numberOfAvailable: number
}

export type BookingType = {
  id: string
  bookingNo: string
  shopId: string
  accountId: string
  bookingStatusCd: string
  dateOfBooking: string
  timeOfBooking: string
  bookingDatetime: string
  bookingDatetimeUtc: string
  request: string
  cancelDatetime: string
  basicalCurrencyCd: string
  bookingAmountBasicalCurrencyBase: string
  adminFeeBasicalCurrencyBase: string
  paymentCurrencyCd: string
  bookingAmountPaymentCurrencyBase: string
  adminFeePaymentCurrencyBase: string
  checkoutDueDatetime: string
  checkoutDueDatetimeUtc: string
  shopName: string
  countryCd: string
  countryName: string
  stateCd: string
  stateName: string
  address1: string
  address2: string
  address3: string
  latitude: string
  longitude: string
  mapUrl: string
  bookingStatusName: string
  basicalCurrencyName: string
  basicalCurrencyCdIso: string
  paymentCurrencyName: string
  paymentCurrencyCdIso: string
  totalPerson: string
  numberOfFemale: string
  numberOfMale: string
  shopTellCountryNoCd: string
  tellCountryName: string
  tellCountryNo: string
  shopTellNo: string
  shopEmailAddress: string
  internationalTellNo: string
  shopImagePath: string
  shopImageAlt: string
  shopImageDescription: string
  totalAmountBasicalCurrencyBase: string
  totalAmountPaymentCurrencyBase: string
  checkoutStatusCd: string
  checkoutStatusName: string
  canCancel: boolean
  createDateTimeJst: string
  requestAproveDueDateTimeJst: string
  bookingDateTimeJst: string
  cancelDateTimeJst: string
  checkoutDueDateTimeJst: string
  bookingMenues: BookingMenuType[]
  bookingRequestCandidates: BookingRequestCandidate[]
  firstPriorityRequestCandidates: BookingRequestCandidate[]
  secondPriorityRequestCandidates: BookingRequestCandidate[]
  thirdPriorityRequestCandidates: BookingRequestCandidate[]
}

export type BookingRequestCandidate = {
  id: string
  bookingPriority: number
  priority: number
  bookingRequestDate: string
  bookingRequestTimeStart: string
  bookingRequestTimeEnd: string
}

export type BookingMenuType = {
  id: string
  bookingMenuId: string
  treatmentTime: string
  prepareTime: string
  currencyCd: string
  amount: string
  currencyName: string
  currencyCdIso: string
  menuName: string
  menuDescription: string
  numberOfFemale: string
  numberOfMale: string
}

export type AccountBookingFilterType = {
  languageCd: string
  accountId: string
  limit: number
  offset: number
}

export type ShopBookingResponseType = {
  result_code: number
  message: string
  availables?: ShopBookingResponseGetType[]
}

export type ShopBookingResponseGetType = {
  shop_id: string
  date: string
  start_time: string
  end_time: string
  number_of_available: number
}

export type BookingResponseType = {
  result_code: number
  message: string
  bookings?: BookingResponseGetType[]
  booking?: BookingResponseGetType
}

export type BookingCountResponseType = {
  result_code: number
  message: string
  count?: number
}

export type BookingResponseGetType = {
  id: string
  booking_no: string
  shop_id: string
  account_id: string
  booking_status_cd: number
  date_of_booking: string
  time_of_booking: string
  booking_datetime: string
  booking_datetime_utc: string
  request: string
  cancel_datetime: string
  basical_currency_cd: number
  booking_amount_basical_currency_base: number
  admin_fee_basical_currency_base: number
  payment_currency_cd: number
  booking_amount_payment_currency_base: number
  admin_fee_payment_currency_base: number
  checkout_due_datetime: string
  checkout_due_datetime_utc: string
  shop_name: string
  country_cd: number
  country_name: string
  state_cd: number
  state_name: string
  address1: string
  address2: string
  address3: string
  latitude: string
  longitude: string
  map_url: string
  booking_status_name: string
  basical_currency_name: string
  basical_currency_cd_iso: string
  payment_currency_name: string
  payment_currency_cd_iso: string
  total_person: number
  number_of_female: number
  number_of_male: number
  shop_tell_country_no_cd: number
  tell_country_name: string
  tell_country_no: string
  shop_tell_no: string
  shop_email_address: string
  international_tell_no: string
  shop_image_path: string
  shop_image_alt: string
  shop_image_description: string
  total_amount_basical_currency_base: number
  total_amount_payment_currency_base: number
  checkout_status_cd: number
  checkout_status_name: string
  can_cancel: boolean
  create_date_time_jst: string
  request_aprove_due_date_time_jst: string
  booking_date_time_jst: string
  cancel_date_time_jst: string
  checkout_due_date_time_jst: string
  booking_menues: BookingMenuResponseGetType[]
  booking_request_candidates?: BookingRequestCandidateResponseGetType[]
  first_priority_request_candidates?: BookingRequestCandidateResponseGetType[]
  second_priority_request_candidates?: BookingRequestCandidateResponseGetType[]
  third_priority_request_candidates?: BookingRequestCandidateResponseGetType[]
}

export type BookingRequestCandidateResponseGetType = {
  id: string
  booking_priority: number
  priority: number
  booking_request_date: string
  booking_request_time_start: string
  booking_request_time_end: string
}

export type BookingMenuResponseGetType = {
  id: string
  booking_menu_id: string
  treatment_time: number
  prepare_time: number
  currency_cd: number
  amount: number
  currency_name: string
  currency_cd_iso: string
  menu_name: string
  menu_description: string
  number_of_female: number
  number_of_male: number
}
