import { useState } from 'react'
import CShopMaintenanceLabelAPI from '@/@core/api/factoryCShopMaintenanceLabel'
import { ShopMaintenanceLabelType } from '@/@core/api/type/cShopMaintenanceLabel'

const ShopMaintenanceLabelCdService = () => {
  const [ShopMaintenanceLabelCd, setShopMaintenanceLabelCd] = useState([] as ShopMaintenanceLabelType[])
  const FetchShopMaintenanceLabelCd = async (language: string) => {
    const { data } = await CShopMaintenanceLabelAPI.GetCShopMaintenanceLabel(Number(language))
    if (data?.c_shop_maintenance_labels) {
      setShopMaintenanceLabelCd(data.c_shop_maintenance_labels)
    }
  }

  return { ShopMaintenanceLabelCd, setShopMaintenanceLabelCd, FetchShopMaintenanceLabelCd }
}

export default ShopMaintenanceLabelCdService
