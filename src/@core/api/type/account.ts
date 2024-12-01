export type SignupInfo = {
  ShopName: string
  Email: string
  IdentifyNumber: string
  TellCountryNoCd: string
  TellNo: string
  BasicalCurrencyCd: string
  PaymentCurrencyCd: string
  BookingMethodCd: string
  BasicalLanguageCd: string
  ShopAdminPicName: string
  ShopAdminPicTellCountryCd: string
  ShopAdminPicTellNo: string
  ShopAdminPicEmailAddress: string
  CountryCd: string
  StateCd: string
  Address1: string
  Address2: string
  Address3: string
  Latitude: string
  Longitude: string
  MapUrl: string
  ShopUrl: string
  Password: string
  ConfirmPassword: string
}

export type ConfirmInfo = {
  emailAddress: string
  confirmationCode: string
}

export type SignupTypeResponseType = {
  result_code: number
  message: string
  shop?: SignupTypeResponseShopType
}

export type VerifyAccountResponseType = {
  result_code: number
  message: string
  maintenance_account_token?: VerifyAccountResponseGetType
}

export type VerifyAccountResponseGetType = {
  maintenance_account_id: string
  access_token: string
  id_token: string
  refresh_token: string
}

export type SignupTypeResponseShopType = {
  id: string
  shop_no: string
  shop_name: string
  shop_identify_number: string
  shop_admin_tell_no: string
  shop_admin_tell_country_no: string
  shop_admin_email_address: string
}

export type MaintenanceAccountType = {
  id: string
}
