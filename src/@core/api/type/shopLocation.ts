export type ShopLocationType = {
  Id: string
  ShopId: string
  CountryCd: string
  StateCd: string
  Address1: string
  Address2: string
  Address3: string
  Latitude: string
  Longitude: string
  MapUrl: string
}

export type ShopLocationResponseType = {
  result_code: number
  message: string
  shop_location_proofreading?: ShopLocationResponseGetType
  shop_location_proofreadings?: ShopLocationResponseGetType[]
}

export type ShopLocationResponseGetType = {
  id: string
  shop_id: string
  country_cd: number
  state_cd: number
  address1: string
  address2: string
  address3: string
  latitude: number
  longitude: number
  map_url: string
}
