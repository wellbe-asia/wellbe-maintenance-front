export type ShopMaintenanceLabelType = {
  Id: string
  ShopId: string
  ShopMaintenanceLabelCd: string
  ShopMaintenanceLabelName: string
  ShopMaintenanceLabelValue: string
}

export type ShopMaintenanceLabelResponseType = {
  result_code: number
  message: string
  shop_maintenance_label?: ShopMaintenanceLabelResponseGetType
  shop_maintenance_labels?: ShopMaintenanceLabelResponseGetType[]
}

export type ShopMaintenanceLabelResponseGetType = {
  id: string
  shop_id: string
  shop_maintenance_label_cd: number
  shop_maintenance_label_name: string
  shop_maintenance_label_value: string
}
