export type ShopBussinessHourType = {
  Id: string
  ShopId: string
  WeekdayCd: string
  IsHoliday: boolean
  BussinessHoursStart: string
  BussinessHoursEnd: string
  WeekdayName: string
  WeekdayAbbreviation: string
}

export type ShopBussinessHourResponseType = {
  result_code: number
  message: string
  shop_bussiness_hour?: ShopBussinessHourResponseGetType
  shop_bussiness_hours?: ShopBussinessHourResponseGetType[]
}

export type ShopBussinessHourResponseGetType = {
  id: string
  shop_id: string
  weekday_cd: number
  is_holiday: boolean
  bussiness_hours_start: string
  bussiness_hours_end: string
  weekday_name: string
  weekday_abbreviation: string
}
