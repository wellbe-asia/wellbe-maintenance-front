export type ShopEquipmentType = {
  Id: string
  ShopId: string
  EquipmentCd: string
  EquipmentName: string
  Quantity: string
}

export type ShopEquipmentResponseType = {
  result_code: number
  message: string
  shop_equipment_proofreadings?: ShopEquipmentResponseGetType[]
}

export type ShopEquipmentResponseGetType = {
  id: string
  shop_id: string
  equipment_cd: number
  equipment_name: string
  quantity: number
}
