export type ContentsLabelType = {
  contents_label_cd: number
  language_cd: number
  contents_category_cd: number
  contents_label_name: string
}

export type ContentsLabelTypeResponseType = {
  result_code: number
  message: string
  c_contents_label?: ContentsLabelType
  c_contents_labels?: ContentsLabelType[]
}
