export type ShopMenuLabelType = {
  Id: string
  ShopMenuId: string
  MenuLabelCd: string
}

export type ShopMenuLabelResponseType = {
  result_code: number
  message: string
  shop_menu_label_proofreadings?: ShopMenuLabelResponseGetType[]
}

export type ShopMenuLabelResponseGetType = {
  id: string
  shop_menu_id: string
  menu_label_cd: number
}
