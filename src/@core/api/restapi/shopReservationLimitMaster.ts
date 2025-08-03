import axios from '@/@core/api/BaseAxios'
import {
  ShopReservationLimitMasterType,
  ShopReservationLimitMasterResponseType
} from '@/@core/api/type/shopReservationLimitMaster'
import { CommonResponseType } from '@/@core/api/type/commonResponseType'

const ShopReservationLimitMasterAPI = {
  GetShopReservationLimitMaster: async (
    shopId: string
  ): Promise<{ status: number; data: ShopReservationLimitMasterResponseType | null }> => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_SERVER_SHOP_URL}/shop_reservation_limit_masters/key?shop_id=${shopId}`,
        {
          headers: {
            Wellbe_Apikey: process.env.NEXT_PUBLIC_API_KEY_WITHOUT_LOGIN
          }
        }
      )

      return response
    } catch (error: any) {
      return error
    }
  },
  CreateShopReservationLimitMaster: async (
    token: string,
    shopReservationLimitMaster: ShopReservationLimitMasterType
  ): Promise<{ status: number; data: CommonResponseType | null }> => {
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER_SHOP_URL}/shop/create_shop_reservation_limit_master`,
        JSON.stringify({ shop_id: shopReservationLimitMaster.shopId, limit: String(shopReservationLimitMaster.limit) }),
        {
          headers: {
            'Content-Type': 'application/json',
            Wellbe_Apikey: process.env.NEXT_PUBLIC_API_KEY_SHOP_MAINTENANCE,
            Wellbe_ShopToken: token
          }
        }
      )

      return response
    } catch (error: any) {
      return error
    }
  }
}

export default ShopReservationLimitMasterAPI
