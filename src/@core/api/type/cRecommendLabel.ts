export type RecommendLabelType = {
  recommend_label_cd: number
  language_cd: number
  recommend_label_name: string
}

export type RecommendLabelTypeResponseType = {
  result_code: number
  message: string
  c_recommend_label?: RecommendLabelType
  c_recommend_labels?: RecommendLabelType[]
}
