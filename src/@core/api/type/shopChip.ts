export type ShopChipType = {
  Id: string
  ShopId: string
  NeedShopChip: boolean
  ShopChipStandardAmmount: string
}

export type ShopChipResponseType = {
  result_code: number
  message: string
  shop_chip_proofreading?: ShopChipResponseGetType
  shop_chip_proofreadings?: ShopChipResponseGetType[]
}

export type ShopChipResponseGetType = {
  id: string
  shop_id: string
  need_shop_chip: boolean
  shop_chip_standard_ammount: number
}
