import axios from '@/@core/api/BaseAxios'
import { ShopTransitionResponseType } from '../type/ShopTransition'

const ShopTransitionAPI = {
  GetSessionsPerDay: async (
    startDate: string,
    endDate: string
  ): Promise<{ status: number; data: ShopTransitionResponseType | null }> => {
    try {
      const response = await axios.get(
        `${
          process.env.NEXT_PUBLIC_SERVER_SHOP_URL
        }/query/shop_session_transition_per_day_shop?start_date=${startDate}&end_date=${endDate}&limit=${20}`,
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
  GetSessionsPerMonth: async (
    startDate: string,
    endDate: string
  ): Promise<{ status: number; data: ShopTransitionResponseType | null }> => {
    try {
      const response = await axios.get(
        `${
          process.env.NEXT_PUBLIC_SERVER_SHOP_URL
        }/query/shop_session_transition_per_month_shop?start_date=${startDate}&end_date=${endDate}&limit=${20}`,
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
  }
}

export default ShopTransitionAPI
