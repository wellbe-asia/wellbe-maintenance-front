export type CShopEquipmentType = {
  shop_equipment_cd: number
  language_cd: number
  shop_equipment_name: string
  unit_name: string
}

export type CShopEquipmentResponseType = {
  result_code: number
  message: string
  c_shop_equipment?: CShopEquipmentType
  c_shop_equipments?: CShopEquipmentType[]
}
