import axios from '@/@core/api/BaseAxios'
import { ShopLocationGoogleType, ShopLocationGoogleResponseType } from '../type/shopLocationGoogle'

const ShopLocationGoogleAPI = {
  GetFromGoogleWithShopId: async (
    shopId: string,
    languageCd: string
  ): Promise<{ status: number; data: ShopLocationGoogleResponseType }> => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_SERVER_SHOP_URL}/shop/shop_location_googles/shop_id?shop_id=${shopId}&language_cd=${languageCd}`,
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
  GetFromGoogleWithFilter: async (
    shopId: string,
    languageCd: string,
    query: string
  ): Promise<{ status: number; data: ShopLocationGoogleResponseType }> => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_SERVER_SHOP_URL}/shop/shop_location_googles/filter?shop_id=${shopId}&language_cd=${languageCd}&query=${query}`,
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
  Submit: async (
    shopLocationGoogleType: ShopLocationGoogleType
  ): Promise<{ status: number; data: ShopLocationGoogleResponseType }> => {
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER_SHOP_URL}/shop/shop_location_google/submit`,
        JSON.stringify({ shop_id: shopLocationGoogleType.ShopId, place_id: shopLocationGoogleType.PlaceId }),
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

export default ShopLocationGoogleAPI
