import axios from '@/@core/api/BaseAxios'
import { CheckoutResponseType } from '../type/checkout'

const CheckoutAPI = {
  getCheckoutFilter: async (
    shopId: string,
    bookingDateStart: string,
    bookingDateEnd: string,
    checkoutStatusCds: string,
    languageCd: string
  ): Promise<{ status: number; data: CheckoutResponseType }> => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_SERVER_PAYMENT_URL}/payment/checkout/filter?shop_id=${shopId}&booking_date_start=${bookingDateStart}&booking_date_end=${bookingDateEnd}&checkout_status_cds=${checkoutStatusCds}&language_cd=${languageCd}`,
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

export default CheckoutAPI
