import axios from '@/@core/api/BaseAxios'
import { ShopContentResponseType, ShopContentType } from './../type/shopContent'

const ShopContentAPI = {
  GetWithShopId: async (
    shopId: string,
    languageCd: string
  ): Promise<{ status: number; data: ShopContentResponseType }> => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_SERVER_SHOP_URL}/shop_content_proofreadings/shop_id_language?shop_id=${shopId}&language_cd=${languageCd}`,
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
  DeleteShopContent: async (id: string): Promise<{ status: number; data: ShopContentResponseType }> => {
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER_SHOP_URL}/cud/shop_content_proofreading/delete`,
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
  DeleteShopContentShopIdLanguageCd: async (
    shopId: string,
    languageCd: string
  ): Promise<{ status: number; data: ShopContentResponseType }> => {
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER_SHOP_URL}/shop/delete_shop_content_with_shopid_languagecd`,
        JSON.stringify({ shop_id: shopId, language_cd: languageCd }),
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
  CreateShopContent: async (
    shopContentType: ShopContentType
  ): Promise<{ status: number; data: ShopContentResponseType }> => {
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER_SHOP_URL}/cud/shop_content_proofreading/create`,
        JSON.stringify({
          shop_id: shopContentType.ShopId,
          content_category: shopContentType.ContentCategory,
          language_cd: shopContentType.LanguageCd,
          content_title: shopContentType.ContentTitle,
          content_body: shopContentType.ContentBody,
          sort_order: shopContentType.SortOrder
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
  UpdateShopContent: async (
    shopContentType: ShopContentType
  ): Promise<{ status: number; data: ShopContentResponseType }> => {
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER_SHOP_URL}/cud/shop_content_proofreading/update`,
        JSON.stringify({
          id: shopContentType.Id,
          shop_id: shopContentType.ShopId,
          language_cd: shopContentType.LanguageCd,
          content_category: shopContentType.ContentCategory,
          content_title: shopContentType.ContentTitle,
          content_body: shopContentType.ContentBody,
          sort_order: shopContentType.SortOrder
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

export default ShopContentAPI
