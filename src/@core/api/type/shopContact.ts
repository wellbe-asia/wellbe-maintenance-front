export type ShopContactType = {
  Id: string
  ShopId: string
  ShopTellCountryNoCd: string
  ShopTellNo: string
  ShopEmailAddress: string
}

export type ShopContactResponseType = {
  result_code: number
  message: string
  shop_contact_proofreading?: ShopContactResponseGetType
  shop_contact_proofreadings?: ShopContactResponseGetType[]
}

export type ShopContactResponseGetType = {
  id: string
  shop_id: string
  shop_tell_country_no_cd: string
  shop_tell_no: string
  shop_email_address: string
}
