export type ShopRecommendLabelType = {
  Id: string
  ShopRecommendId: string
  RecommendLabelCd: string
}

export type ShopRecommendLabelResponseType = {
  result_code: number
  message: string
  shop_recommend_label_proofreadings?: ShopRecommendLabelResponseGetType[]
}

export type ShopRecommendLabelResponseGetType = {
  id: string
  shop_recommend_id: string
  recommend_label_cd: number
}
