import axios from '@/@core/api/BaseAxios'
import { ShopDescriptionResponseType, ShopDescriptionType } from '../type/shopDescription'
import { CommonResponseType } from '../type/commonResponseType'

const ShopDescriptionAPI = {
  GetWithShopId: async (
    shopId: string,
    languageCd: string
  ): Promise<{ status: number; data: ShopDescriptionResponseType | null }> => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_SERVER_SHOP_URL}/shop_description_proofreadings/shop_id_language?shop_id=${shopId}&language_cd=${languageCd}`,
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
  DeleteShopDescription: async (id: string): Promise<{ status: number; data: ShopDescriptionResponseType | null }> => {
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER_SHOP_URL}/cud/shop_description_proofreading/delete`,
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
  CreateShopDescription: async (
    shopDescriptionType: ShopDescriptionType
  ): Promise<{ status: number; data: ShopDescriptionResponseType | null }> => {
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER_SHOP_URL}/cud/shop_description_proofreading/create`,
        JSON.stringify({
          shop_id: shopDescriptionType.ShopId,
          language_cd: shopDescriptionType.LanguageCd,
          shop_name: shopDescriptionType.ShopName
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
  UpdateShopDescription: async (
    shopDescriptionType: ShopDescriptionType
  ): Promise<{ status: number; data: ShopDescriptionResponseType | null }> => {
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER_SHOP_URL}/cud/shop_description_proofreading/update`,
        JSON.stringify({
          id: shopDescriptionType.Id,
          shop_id: shopDescriptionType.ShopId,
          language_cd: shopDescriptionType.LanguageCd,
          shop_name: shopDescriptionType.ShopName
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
  TranslateShopDescription: async (
    shopId: string,
    languageCd: string
  ): Promise<{ status: number; data: CommonResponseType | null }> => {
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER_SHOP_URL}/shop/description/translate`,
        JSON.stringify({
          shop_id: shopId,
          base_language_cd: languageCd
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

export default ShopDescriptionAPI
