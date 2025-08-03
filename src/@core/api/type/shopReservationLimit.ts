export type ShopReservationLimitSummaryType = {
  limit_date: string
  weekday_cd: number
  week_day_name: string
  is_holiday: boolean
  bussiness_hours_start: string
  bussiness_hours_end: string
  shop_reservation_limit: ShopReservationLimitType[]
}

export type ShopReservationLimitType = {
  id: string
  shop_id: string
  limit_date: string
  limit_time_start: string
  limit_time_end: string
  reservation_limit: string
}

export type BulkShopReservationLimitType = {
  shopId: string
  startDate: Date
  endDate: Date
  limit: number
}

export type ShopReservationLimitResponseType = {
  result_code: number
  message: string
  shop_reservation_limit: ShopReservationLimitsResponseGetType
}

export type ShopReservationLimitsResponseGetType = {
  bussiness_hours_start: string
  bussiness_hours_end: string
  week_day: WeekDayResponseGetType[]
}

export type WeekDayResponseGetType = {
  shop_id: string
  limit_date: string
  weekday_cd: number
  week_day_name: string
  is_holiday: boolean
  bussiness_hours_start: string
  bussiness_hours_end: string
  shop_reservation_limits: ShopReservationLimitResponseGetType[]
}

export type ShopReservationLimitResponseGetType = {
  id: string
  limit_time_start: string
  limit_time_end: string
  reservation_limit: string
}
