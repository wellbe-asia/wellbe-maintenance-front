export type ShopContentType = {
  Id: string
  ShopId: string
  ContentCategory: string
  LanguageCd: string
  ContentTitle: string
  ContentBody: string
  SortOrder: string
}

export type ShopContentResponseType = {
  result_code: number
  message: string
  shop_content?: ShopContentResponseGetType
  shop_content_proofreading?: ShopContentResponseGetType
  shop_content_proofreadings?: ShopContentResponseGetType[]
}

export type ShopContentResponseGetType = {
  id: string
  shop_id: string
  content_category: string
  language_cd: number
  content_title: string
  content_body: string
  sort_order: number
}
