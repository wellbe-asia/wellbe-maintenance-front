import axios from '@/@core/api/BaseAxios'
import { PayoutItemResponseType } from '../type/payoutItem'

const PayoutItemAPI = {
  getPayoutItem: async (
    payoutId: string,
    languageCd: string
  ): Promise<{ status: number; data: PayoutItemResponseType }> => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_SERVER_PAYMENT_URL}/query/payment/payoutitem?payout_id=${payoutId}&language_cd=${languageCd}`,
        {
          headers: {
            'Content-Type': 'application/json',
            Wellbe_Apikey: process.env.NEXT_PUBLIC_API_KEY_PAYMENT_MAINTENANCE
          }
        }
      )

      return response
    } catch (error: any) {
      return error
    }
  }
}

export default PayoutItemAPI
