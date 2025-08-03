import axios from '@/@core/api/BaseAxios'
import {
  ShopReservationLimitType,
  ShopReservationLimitResponseType,
  BulkShopReservationLimitType
} from '@/@core/api/type/shopReservationLimit'
import { CommonResponseType } from '../type/commonResponseType'
import { dateFormatApi } from '@/@core/utils/date'

const ShopReservationLimitAPI = {
  GetShopReservationLimit: async (
    shopId: string,
    languageCd: string,
    startDate: string
  ): Promise<{ status: number; data: ShopReservationLimitResponseType | null }> => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_SERVER_SHOP_URL}/query/shop_reservation_limit?shop_id=${shopId}&language_cd=${languageCd}&start_date=${startDate}`,
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
  CreateShopReservationLimit: async (
    token: string,
    shopReservationLimit: ShopReservationLimitType[]
  ): Promise<{ status: number; data: ShopReservationLimitResponseType | null }> => {
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER_SHOP_URL}/shop/create_shop_reservation_limits`,
        JSON.stringify({ limits: shopReservationLimit }),
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
  },
  BulkCreateShopReservationLimit: async (
    token: string,
    shopId: string,
    bulkShopReservationLimit: BulkShopReservationLimitType
  ): Promise<{ status: number; data: CommonResponseType | null }> => {
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER_SHOP_URL}/shop/bulk/create_shop_reservation_limits`,
        JSON.stringify({
          shop_id: shopId,
          start_date: dateFormatApi(bulkShopReservationLimit.startDate),
          end_date: dateFormatApi(bulkShopReservationLimit.endDate),
          limit: String(bulkShopReservationLimit.limit)
        }),
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
  },
  DeleteShopReservationLimit: async (
    token: string,
    shopId: string,
    startDate: string
  ): Promise<{ status: number; data: ShopReservationLimitResponseType | null }> => {
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER_SHOP_URL}/shop/delete_shop_reservation_limits`,
        JSON.stringify({
          shop_id: shopId,
          start_date: startDate
        }),
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

export default ShopReservationLimitAPI
