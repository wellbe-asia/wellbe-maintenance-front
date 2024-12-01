export type ShopMenuType = {
  Id: string
  ShopId: string
  TreatmentTime: string
  RequiredTime: string
  IsCoupon: boolean
  Amount: string
  AmountBeforeDiscount: string
  CurrencyCdIso: string
  SortOrder: string
  CanMale: boolean
  CanFemale: boolean
  DeleteFlg: boolean
  ShopMenuLabelCds: string[]
  ShopRecommendLabelCds: string[]
  ShopMenuNames: ShopMenuNameType[]
}

export type ShopMenuNameType = {
  ShopMenuId: string
  LanguageCd: string
  MenuName: string
  MenuDescription: string
}

export type ShopMenuNameRequestType = {
  language_cd: string
  menu_name: string
  menu_description: string
}

export type ShopMenuResponseType = {
  result_code: number
  message: string
  shop_menu_proofreadings?: ShopMenuResponseAggregate[]
}

export type ShopMenuResponseAggregate = {
  ShopMenuProofreading: ShopMenuResponseGetType
  ShopMenuNameProofreadings: ShopMenuNameResponseGetType[]
  basical_currency_cd_iso: string
  payment_currency_cd_iso: string
}
export type ShopMenuResponseGetType = {
  id: string
  shop_id: string
  treatment_time: number
  required_time: number
  is_coupon: boolean
  amount: number
  amount_before_discount: number
  can_male: boolean
  can_female: boolean
  sort_order: number
  delete_flg: boolean
}

export type ShopMenuNameResponseGetType = {
  shop_menu_id: string
  language_cd: number
  menu_name: string
  menu_description: string
}

export type ShopMenuQueryResponseType = {
  result_code: number
  message: string
  shop_menues: ShopMenuQueryResponseGetType[]
}

export type ShopMenuQueryResponseGetType = {
  id: string
  shop_id: string
  treatment_time: number
  required_time: number
  is_coupon: boolean
  amount: number
  amount_before_discount: number
  sort_order: number
  can_male: boolean
  can_female: boolean
  delete_flg: boolean
  language_cd: number
  menu_name: string
  menu_description: string
}
