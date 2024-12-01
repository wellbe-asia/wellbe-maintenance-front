import axios from '@/@core/api/BaseAxios'
import { ShopLocationResponseType, ShopLocationType } from '../type/shopLocation'

const ShopLocationAPI = {
  GetWithShopId: async (shopId: string): Promise<{ status: number; data: ShopLocationResponseType | null }> => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_SERVER_SHOP_URL}/shop_location_proofreadings/shop_id?shop_id=${shopId}`,
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
  DeleteShopLocation: async (id: string): Promise<{ status: number; data: ShopLocationResponseType | null }> => {
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER_SHOP_URL}/cud/shop_location_proofreading/delete`,
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
  CreateShopLocation: async (
    shopLocationType: ShopLocationType
  ): Promise<{ status: number; data: ShopLocationResponseType | null }> => {
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER_SHOP_URL}/cud/shop_location_proofreading/create`,
        JSON.stringify({
          shop_id: shopLocationType.ShopId,
          country_cd: shopLocationType.CountryCd,
          state_cd: shopLocationType.StateCd,
          address1: shopLocationType.Address1,
          address2: shopLocationType.Address2,
          address3: shopLocationType.Address3,
          latitude: shopLocationType.Latitude,
          longitude: shopLocationType.Longitude,
          map_url: shopLocationType.MapUrl
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
  UpdateShopLocation: async (
    shopLocationType: ShopLocationType
  ): Promise<{ status: number; data: ShopLocationResponseType | null }> => {
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER_SHOP_URL}/cud/shop_location_proofreading/update`,
        JSON.stringify({
          id: shopLocationType.Id,
          shop_id: shopLocationType.ShopId,
          country_cd: shopLocationType.CountryCd,
          state_cd: shopLocationType.StateCd,
          address1: shopLocationType.Address1,
          address2: shopLocationType.Address2,
          address3: shopLocationType.Address3,
          latitude: shopLocationType.Latitude,
          longitude: shopLocationType.Longitude,
          map_url: shopLocationType.MapUrl
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

export default ShopLocationAPI
