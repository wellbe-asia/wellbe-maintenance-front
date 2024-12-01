import axios from '@/@core/api/BaseAxios'
import { ShopScrapingKeywordQueResponseType } from '../type/shopScrapingKeywordQue'

const ShopScrapingKeywordQueAPI = {
  Get: async (lastDate: string): Promise<{ status: number; data: ShopScrapingKeywordQueResponseType | null }> => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_SERVER_SHOP_URL}/query/shop_scaping_keyword_que?last_date=${lastDate}`,
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
  Create: async (keyword: string): Promise<{ status: number; data: ShopScrapingKeywordQueResponseType | null }> => {
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER_SHOP_URL}/cud/shop_scraping_keyword_que/create`,
        JSON.stringify({
          keyword: keyword
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
