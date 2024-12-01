import axios from '@/@core/api/BaseAxios'
import {
  ShopMenuNameRequestType,
  ShopMenuQueryResponseType,
  ShopMenuResponseType,
  ShopMenuType
} from '../type/shopMenu'
import { CommonResponseType } from '../type/commonResponseType'

const ShopMenuAPI = {
  GetWithShopId: async (shopId: string): Promise<{ status: number; data: ShopMenuResponseType | null }> => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_SERVER_SHOP_URL}/shop/shop_menu_proofreadings_with_shop_id?shop_id=${shopId}`,
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
  DeleteShopMenu: async (id: string): Promise<{ status: number; data: ShopMenuResponseType | null }> => {
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER_SHOP_URL}/shop/delete_shop_menu`,
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
  CreateShopMenu: async (
    shopMenuType: ShopMenuType
  ): Promise<{ status: number; data: ShopMenuResponseType | null }> => {
    try {
      const shopMenuNameRequest = [] as ShopMenuNameRequestType[]
      for (let i = 0; i < shopMenuType.ShopMenuNames.length; i++) {
        const v = shopMenuType.ShopMenuNames[i]
        shopMenuNameRequest.push({
          language_cd: v.LanguageCd,
          menu_name: v.MenuName,
          menu_description: v.MenuDescription
        })
      }
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER_SHOP_URL}/shop/create_shop_menu`,
        JSON.stringify({
          shop_id: shopMenuType.ShopId,
          treatment_time: shopMenuType.TreatmentTime,
          required_time: shopMenuType.RequiredTime,
          is_coupon: String(shopMenuType.IsCoupon),
          amount: shopMenuType.Amount,
          amount_before_discount: shopMenuType.AmountBeforeDiscount,
          sort_order: shopMenuType.SortOrder,
          can_male: String(shopMenuType.CanMale),
          can_female: String(shopMenuType.CanFemale),
          menu_label_cds: shopMenuType.ShopMenuLabelCds,
          recommend_label_cds: shopMenuType.ShopRecommendLabelCds,
          menu_names: shopMenuNameRequest,
          delete_flg: String(shopMenuType.DeleteFlg)
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
  UpdateShopMenu: async (
    shopMenuType: ShopMenuType
  ): Promise<{ status: number; data: ShopMenuResponseType | null }> => {
    try {
      const shopMenuNameRequest = [] as ShopMenuNameRequestType[]
      for (let i = 0; i < shopMenuType.ShopMenuNames.length; i++) {
        const v = shopMenuType.ShopMenuNames[i]
        shopMenuNameRequest.push({
          language_cd: v.LanguageCd,
          menu_name: v.MenuName,
          menu_description: v.MenuDescription
        })
      }
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER_SHOP_URL}/shop/update_shop_menu`,
        JSON.stringify({
          id: shopMenuType.Id,
          shop_id: shopMenuType.ShopId,
          treatment_time: shopMenuType.TreatmentTime,
          required_time: shopMenuType.RequiredTime,
          is_coupon: String(shopMenuType.IsCoupon),
          amount: shopMenuType.Amount,
          amount_before_discount: shopMenuType.AmountBeforeDiscount,
          sort_order: shopMenuType.SortOrder,
          can_male: String(shopMenuType.CanMale),
          can_female: String(shopMenuType.CanFemale),
          menu_label_cds: shopMenuType.ShopMenuLabelCds,
          recommend_label_cds: shopMenuType.ShopRecommendLabelCds,
          menu_names: shopMenuNameRequest,
          delete_flg: String(shopMenuType.DeleteFlg)
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
  TranslateShopMenu: async (
    shopId: string,
    languageCd: string
  ): Promise<{ status: number; data: CommonResponseType | null }> => {
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER_SHOP_URL}/shop/menu/translate`,
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
  },
  GetPublishedWithShopId: async (
    shopId: string,
    languageCd: string
  ): Promise<{ status: number; data: ShopMenuQueryResponseType | null }> => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_SERVER_SHOP_URL}/query/shop/menu/shop_id?shop_id=${shopId}&language_cd=${languageCd}`,
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
  }
}

export default ShopMenuAPI
