import axios from '@/@core/api/BaseAxios'
import { PayoutResponseType } from '../type/payout'

const PayoutAPI = {
  getPayoutFilter: async (
    shopId: string,
    payoutDateStart: string,
    payoutDateEnd: string,
    payoutStatusCds: string,
    languageCd: string
  ): Promise<{ status: number; data: PayoutResponseType }> => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_SERVER_PAYMENT_URL}/payment/payout/filter?shop_id=${shopId}&payout_date_start=${payoutDateStart}&payout_date_end=${payoutDateEnd}&payout_status_cds=${payoutStatusCds}&language_cd=${languageCd}`,
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
  },
  createPayout: async (
    shopId: string,
    payoutDate: string,
    closingDate: string
  ): Promise<{ status: number; data: PayoutResponseType }> => {
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER_PAYMENT_URL}/payment/batch/payout/create`,
        JSON.stringify({ shop_id: shopId, payout_date: payoutDate, payout_closing_date: closingDate }),
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
  },
  downloadPayoutNotification: async (
    payoutIds: string[]
  ): Promise<{
    status: number
    data?: ArrayBuffer | { result_code?: number; message?: string }
    contentType?: string
  }> => {
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER_PAYMENT_URL}/payment/payout/notification`,
        { payout_ids: payoutIds },
        {
          headers: {
            'Content-Type': 'application/json',
            Wellbe_Apikey: process.env.NEXT_PUBLIC_API_KEY_PAYMENT_MAINTENANCE
          },
          responseType: 'arraybuffer'
        }
      )

      return {
        status: response.status,
        data: response.data,
        contentType: response.headers?.['content-type']
      }
    } catch (error: any) {
      const status = error?.response?.status ?? 500
      const data = error?.response?.data
      let parsedData: { result_code?: number; message?: string } | undefined
      if (data instanceof ArrayBuffer) {
        try {
          parsedData = JSON.parse(new TextDecoder().decode(data)) as {
            result_code?: number
            message?: string
          }
        } catch {
          parsedData = undefined
        }
      } else if (data && typeof data === 'object') {
        parsedData = data
      }

      return {
        status,
        data: parsedData
      }
    }
  }
}

export default PayoutAPI
