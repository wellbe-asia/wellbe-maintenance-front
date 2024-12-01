export type ShopTransitionResponseType = {
  result_code: number
  message: string
  transitions: ShopTransitionResponseGetType[]
}

export type ShopTransitionResponseGetType = {
  shop_id: string
  shop_name: string
  transitions: ShopTransitionValueResponseGetType[]
}

export type ShopTransitionValueResponseGetType = {
  label: string
  value: string
}
