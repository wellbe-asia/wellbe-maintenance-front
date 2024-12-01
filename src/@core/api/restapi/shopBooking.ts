import axios from '@/@core/api/BaseAxios'
import { ShopBookingResponseType } from '../type/shopBooking'

const ShopBookingAPI = {
  GetWithShopId: async (
    token: string,
    shopId: string,
    languageCd: string,
    startDate: string,
    endDate: string
  ): Promise<{ status: number; data: ShopBookingResponseType }> => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_SERVER_SHOP_URL}/query/shop/booking?shop_id=${shopId}&language_cd=${languageCd}&start_date=${startDate}&end_date=${endDate}`,
        {
          headers: {
            Wellbe_Apikey: process.env.NEXT_PUBLIC_API_KEY_WITH_LOGIN,
            Wellbe_ShopToken: token
          }
        }
      )

      return response
    } catch (error: any) {
      return error
    }
  },
  ApprovalBooking: async (
    bookingId: string,
    dateOfBooking: string,
    timeOfBooking: string
  ): Promise<{ status: number; data: ShopBookingResponseType }> => {
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER_SHOP_URL}/shop/booking/approval_with_booking_id`,
        JSON.stringify({ booking_id: bookingId, date_of_booking: dateOfBooking, time_of_booking: timeOfBooking }),
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
  CancelShopBookingByShop: async (
    bookingId: string,
    CancelReason: string
  ): Promise<{ status: number; data: ShopBookingResponseType }> => {
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER_SHOP_URL}/shop/booking/cancel_with_booking_id`,
        JSON.stringify({ booking_id: bookingId, cancel_reason: CancelReason }),
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

export default ShopBookingAPI
