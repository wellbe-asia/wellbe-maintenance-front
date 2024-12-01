import axios from '@/@core/api/BaseAxios'
import { BookingResponseType } from '../type/booking'

const BookingApi = {
  GetBookingBookingNo: async (
    languageCd: string,
    bookingNo: string
  ): Promise<{ status: number; data: BookingResponseType }> => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_SERVER_BOOKING_URL}/query/booking/booking_no?language_cd=${languageCd}&booking_no=${bookingNo}`,
        {
          headers: {
            'Content-Type': 'application/json',
            Wellbe_Apikey: process.env.NEXT_PUBLIC_API_KEY_BOOKING_MAINTENANCE
          }
        }
      )

      return response
    } catch (error: any) {
      return error
    }
  },
  GetBookingList: async (languageCd: string): Promise<{ status: number; data: BookingResponseType }> => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_SERVER_BOOKING_URL}/query/booking/maintenance/recent?language_cd=${languageCd}`,
        {
          headers: {
            'Content-Type': 'application/json',
            Wellbe_Apikey: process.env.NEXT_PUBLIC_API_KEY_BOOKING_MAINTENANCE
          }
        }
      )

      return response
    } catch (error: any) {
      return error
    }
  },
  GetProxyBookingList: async (languageCd: string): Promise<{ status: number; data: BookingResponseType }> => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_SERVER_BOOKING_URL}/query/booking/maintenance/proxy?language_cd=${languageCd}`,
        {
          headers: {
            'Content-Type': 'application/json',
            Wellbe_Apikey: process.env.NEXT_PUBLIC_API_KEY_BOOKING_MAINTENANCE
          }
        }
      )

      return response
    } catch (error: any) {
      return error
    }
  }
}

export default BookingApi
