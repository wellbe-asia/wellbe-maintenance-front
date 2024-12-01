import axios from '@/@core/api/BaseAxios'
import { ReviewResponseType } from '../type/review'

const ShopReviewAPI = {
  Filter: async (languageCd: string, limit: number): Promise<{ status: number; data: ReviewResponseType }> => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_SERVER_REVIEW_URL}/query/review/filter?language_cd=${languageCd}&review_status={2,3}&limit=${limit}`,
        {
          headers: {
            Wellbe_Apikey: process.env.NEXT_PUBLIC_API_KEY_REVIEW_MAINTENANCE
          }
        }
      )

      return response
    } catch (error: any) {
      return error
    }
  },
  GetOne: async (id: string, languageCd: string): Promise<{ status: number; data: ReviewResponseType }> => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_SERVER_REVIEW_URL}/query/review/filter?review_header_id=${id}&language_cd=${languageCd}`,
        {
          headers: {
            Wellbe_Apikey: process.env.NEXT_PUBLIC_API_KEY_REVIEW_MAINTENANCE
          }
        }
      )

      return response
    } catch (error: any) {
      return error
    }
  },
  Approve: async (id: string): Promise<{ status: number; data: ReviewResponseType }> => {
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER_REVIEW_URL}/review_header/approve`,
        JSON.stringify({ id: id }),
        {
          headers: {
            'Content-Type': 'application/json',
            Wellbe_Apikey: process.env.NEXT_PUBLIC_API_KEY_REVIEW_MAINTENANCE
          }
        }
      )

      return response
    } catch (error: any) {
      return error
    }
  },
  Deny: async (id: string): Promise<{ status: number; data: ReviewResponseType }> => {
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER_REVIEW_URL}/review_header/deny`,
        JSON.stringify({ id: id }),
        {
          headers: {
            'Content-Type': 'application/json',
            Wellbe_Apikey: process.env.NEXT_PUBLIC_API_KEY_REVIEW_MAINTENANCE
          }
        }
      )

      return response
    } catch (error: any) {
      return error
    }
  }
}

export default ShopReviewAPI
