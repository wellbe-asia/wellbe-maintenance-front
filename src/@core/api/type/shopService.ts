export type ShopServiceType = {
  Id: string
  ShopId: string
  ServiceCd: string
}

export type ShopServiceResponseType = {
  result_code: number
  message: string
  shop_service_proofreading?: ShopServiceResponseGetType
  shop_service_proofreadings?: ShopServiceResponseGetType[]
}

export type ShopServiceResponseGetType = {
  id: string
  shop_id: string
  service_cd: number
}
