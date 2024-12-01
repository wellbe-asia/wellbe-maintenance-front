export type ShopMaintenanceLabelType = {
  shop_maintenance_label_cd: number
  language_cd: number
  shop_maintenance_label_name: string
}

export type ShopMaintenanceLabelTypeResponseType = {
  result_code: number
  message: string
  c_shop_maintenance_label?: ShopMaintenanceLabelType
  c_shop_maintenance_labels?: ShopMaintenanceLabelType[]
}
