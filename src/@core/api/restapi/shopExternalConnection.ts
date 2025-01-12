import axios from '@/@core/api/BaseAxios'
import {
  shopExternalConnectionSalonboardType,
  shopExternalConnectionSalonboardResponseType
} from '../type/shopExternalConnectionSalonboard'
import { CommonResponseType } from '../type/commonResponseType'

const ShopExternalConnectionAPI = {
  GetSalonboardWithShopId: async (
    shopId: string
  ): Promise<{ status: number; data: shopExternalConnectionSalonboardResponseType }> => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_SERVER_SHOP_URL}/shop/shop_external_connect/get?shop_id=${shopId}`,
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
  DeleteShopExternalConnectionSalonboard: async (
    id: string,
    shopId: string
  ): Promise<{ status: number; data: CommonResponseType }> => {
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER_SHOP_URL}/shop/shop_external_connect/delete`,
        JSON.stringify({ id: id, shop_id: shopId }),
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
  SubmitShopExternalConnectionSalonboard: async (
    shopExternalConnectionType: shopExternalConnectionSalonboardType
  ): Promise<{ status: number; data: CommonResponseType }> => {
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER_SHOP_URL}/shop/shop_external_connect/salonboard/submit`,
        JSON.stringify({
          id: shopExternalConnectionType.Id,
          shop_id: shopExternalConnectionType.ShopId,
          user_id: shopExternalConnectionType.UserId,
          password: shopExternalConnectionType.Password,
          external_connect_site_cd: shopExternalConnectionType.ExternalConnectSiteCd,
          salonboard_type: shopExternalConnectionType.SalonboardType,
          is_connect_shift_setting: String(shopExternalConnectionType.IsConnectShiftSetting)
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

export default ShopExternalConnectionAPI
