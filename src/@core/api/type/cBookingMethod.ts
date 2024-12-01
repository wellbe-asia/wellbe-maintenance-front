export type BookingMethodType = {
  booking_method_cd: number
  language_cd: number
  booking_method_name: string
}

export type BookingMethodResponseType = {
  result_code: number
  message: string
  c_booking_methods?: BookingMethodType[]
}
