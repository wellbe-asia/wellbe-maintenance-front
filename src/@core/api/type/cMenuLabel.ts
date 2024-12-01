export type MenuLabelType = {
  menu_label_cd: number
  language_cd: number
  menu_label_name: string
}

export type MenuLabelTypeResponseType = {
  result_code: number
  message: string
  c_menu_label?: MenuLabelType
  c_menu_labels?: MenuLabelType[]
}
