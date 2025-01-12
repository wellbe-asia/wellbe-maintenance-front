export type shopExternalConnectionSalonboardType = {
  Id: string
  ShopId: string
  UserId: string
  Password: string
  IsConfirmed?: boolean
  ExternalConnectSiteCd: string
  SalonboardType: string
  IsConnectShiftSetting: string
}

export type shopExternalConnectionSalonboardResponseType = {
  result_code: number
  message: string
  shop_external_connect_salonboards?: shopExternalConnectionSalonboardResponseGetType[]
}

export type shopExternalConnectionSalonboardResponseGetType = {
  id: string
  shop_id: string
  user_id: string
  password: string
  is_confirmed: boolean
  external_connect_site_cd: string
  salonboard_type: string
  is_connect_shift_setting: string
}
