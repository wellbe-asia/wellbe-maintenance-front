import { useState } from 'react'
import CShopEquipmentAPI from '@/@core/api/factoryCShopEquipment'
import { CShopEquipmentType } from '@/@core/api/type/cShopEquipment'

const ShopEquipmentCdService = () => {
  const [shopEquipmentCd, setShopEquipmentCd] = useState([] as CShopEquipmentType[])
  const FetchEquipmentCd = async (language: string) => {
    const { data } = await CShopEquipmentAPI.GetCShopEquipment(Number(language))
    if (data?.c_shop_equipments) {
      setShopEquipmentCd(data.c_shop_equipments)
    }
  }

  return { shopEquipmentCd, setShopEquipmentCd, FetchEquipmentCd }
}

export default ShopEquipmentCdService
