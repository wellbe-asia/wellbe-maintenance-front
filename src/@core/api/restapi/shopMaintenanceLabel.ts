import axios from '@/@core/api/BaseAxios'
import { ShopMaintenanceLabelResponseType, ShopMaintenanceLabelType } from '../type/shopMaintenanceLabel'

const ShopMaintenanceLabelAPI = {
  GetWithShopId: async (shopId: string): Promise<{ status: number; data: ShopMaintenanceLabelResponseType | null }> => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_SERVER_SHOP_URL}/r/shop_maintenance_label/shop_id?shop_id=${shopId}`,
        {
          headers: {
            Wellbe_Apikey: process.env.NEXT_PUBLIC_API_KEY_SHOP_MAINTENANCE
          }
        }
      )

      return response
    } catch (error: any) {
      return error
    }
  },
  Create: async (
    shopMaintenanceLabel: ShopMaintenanceLabelType
  ): Promise<{ status: number; data: ShopMaintenanceLabelResponseType | null }> => {
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER_SHOP_URL}/cud/shop_maintenance_label/create`,
        JSON.stringify({
          shop_id: shopMaintenanceLabel.ShopId,
          shop_maintenance_label_cd: shopMaintenanceLabel.ShopMaintenanceLabelCd,
          shop_maintenance_label_value: shopMaintenanceLabel.ShopMaintenanceLabelValue
        }),
        {
          headers: {
            'Content-Type': 'application/json',
            Wellbe_Apikey: process.env.NEXT_PUBLIC_API_KEY_SHOP_MAINTENANCE
          }
        }
      )

      return response
    } catch (error: any) {
      return error
    }
  },
  DeleteWithShopId: async (
    shopId: string
  ): Promise<{ status: number; data: ShopMaintenanceLabelResponseType | null }> => {
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER_SHOP_URL}/cud/shop_maintenance_label/delete/shop_id`,
        JSON.stringify({
          shop_id: shopId
        }),
        {
          headers: {
            'Content-Type': 'application/json',
            Wellbe_Apikey: process.env.NEXT_PUBLIC_API_KEY_SHOP_MAINTENANCE
          }
        }
      )

      return response
    } catch (error: any) {
      return error
    }
  }
}

export default ShopMaintenanceLabelAPI
