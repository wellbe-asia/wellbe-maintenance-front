import axios from '@/@core/api/BaseAxios'
import { ShopScrapingQueResponseType } from '../type/shopScrapingQue'

const ShopScrapingKeywordQueAPI = {
  Get: async (lastDate: string): Promise<{ status: number; data: ShopScrapingQueResponseType | null }> => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_SERVER_SHOP_URL}/query/shop_scaping_que?last_date=${lastDate}`,
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
  Delete: async (id: string): Promise<{ status: number; data: ShopScrapingQueResponseType | null }> => {
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER_SHOP_URL}/cud/shop_scraping_que/delete`,
        JSON.stringify({
          id: id
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

export default ShopScrapingKeywordQueAPI
