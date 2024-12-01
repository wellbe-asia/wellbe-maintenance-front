import axios from '@/@core/api/BaseAxios'
import { ShopServiceResponseType, ShopServiceType } from '../type/shopService'

const ShopServiceAPI = {
  GetWithShopId: async (shopId: string): Promise<{ status: number; data: ShopServiceResponseType | null }> => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_SERVER_SHOP_URL}/shop_service_proofreadings/shop_id?shop_id=${shopId}`,
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
  DeleteShopService: async (id: string): Promise<{ status: number; data: ShopServiceResponseType | null }> => {
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER_SHOP_URL}/cud/shop_service_proofreading/delete`,
        JSON.stringify({ id: id }),
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
  DeleteShopServiceWithShopId: async (
    shopId: string
  ): Promise<{ status: number; data: ShopServiceResponseType | null }> => {
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER_SHOP_URL}/shop/delete_shop_service_proofreading_with_shop_id`,
        JSON.stringify({ shop_id: shopId }),
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
  CreateShopService: async (
    shopServiceType: ShopServiceType
  ): Promise<{ status: number; data: ShopServiceResponseType | null }> => {
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER_SHOP_URL}/cud/shop_service_proofreading/create`,
        JSON.stringify({
          shop_id: shopServiceType.ShopId,
          service_cd: shopServiceType.ServiceCd
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
  UpdateShopService: async (
    shopServiceType: ShopServiceType
  ): Promise<{ status: number; data: ShopServiceResponseType | null }> => {
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER_SHOP_URL}/cud/shop_service_proofreading/update`,
        JSON.stringify({
          id: shopServiceType.Id,
          shop_id: shopServiceType.ShopId,
          service_cd: shopServiceType.ServiceCd
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

export default ShopServiceAPI
