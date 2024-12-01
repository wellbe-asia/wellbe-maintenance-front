export type ShopDescriptionType = {
  Id: string
  ShopId: string
  LanguageCd: string
  ShopName: string
}

export type ShopDescriptionResponseType = {
  result_code: number
  message: string
  shop_description_proofreading?: ShopDescriptionResponseGetType
  shop_description_proofreadings?: ShopDescriptionResponseGetType[]
}

export type ShopDescriptionResponseGetType = {
  id: string
  shop_id: string
  language_cd: number
  shop_name: string
}
