import axios from '@/@core/api/BaseAxios'
import { ShopBussinessHourResponseType, ShopBussinessHourType } from '../type/shopBussinessHour'

const ShopBussinessHourAPI = {
  GetWithShopId: async (
    shopId: string,
    languageCd: string
  ): Promise<{ status: number; data: ShopBussinessHourResponseType }> => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_SERVER_SHOP_URL}/shop/shop_bussiness_hours_with_shop_id_language_cd?shop_id=${shopId}&language_cd=${languageCd}`,
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
  DeleteShopBussinessHour: async (id: string): Promise<{ status: number; data: ShopBussinessHourResponseType }> => {
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER_SHOP_URL}/cud/shop_bussiness_hour_proofreading/delete`,
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
  CreateShopBussinessHour: async (
    shopBussinessHourType: ShopBussinessHourType
  ): Promise<{ status: number; data: ShopBussinessHourResponseType }> => {
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER_SHOP_URL}/cud/shop_bussiness_hour_proofreading/create`,
        JSON.stringify({
          shop_id: shopBussinessHourType.ShopId,
          weekday_cd: shopBussinessHourType.WeekdayCd,
          is_holiday: String(shopBussinessHourType.IsHoliday),
          bussiness_hours_start: shopBussinessHourType.BussinessHoursStart,
          bussiness_hours_end: shopBussinessHourType.BussinessHoursEnd
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
  UpdateShopBussinessHour: async (
    shopBussinessHourType: ShopBussinessHourType
  ): Promise<{ status: number; data: ShopBussinessHourResponseType }> => {
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER_SHOP_URL}/cud/shop_bussiness_hour_proofreading/update`,
        JSON.stringify({
          id: shopBussinessHourType.Id,
          shop_id: shopBussinessHourType.ShopId,
          weekday_cd: shopBussinessHourType.WeekdayCd,
          is_holiday: String(shopBussinessHourType.IsHoliday),
          bussiness_hours_start: shopBussinessHourType.BussinessHoursStart,
          bussiness_hours_end: shopBussinessHourType.BussinessHoursEnd
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

export default ShopBussinessHourAPI
