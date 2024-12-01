import axios from '../BaseAxios'
import { BookingMethodResponseType } from '../type/cBookingMethod'

const CBookingMethodAPI = {
  GetCBookingMethod: async (languageCd: number): Promise<{ status: number; data: BookingMethodResponseType }> => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_SERVER_COMMON_URL}/c_booking_methods/language_cd?language_cd=${languageCd}`,
        {
          headers: {
            'Content-Type': 'application/json',
            Wellbe_Apikey: process.env.NEXT_PUBLIC_API_KEY_WITHOUT_LOGIN
          }
        }
      )

      return response
    } catch (error: any) {
      return error
    }
  }
}

export default CBookingMethodAPI
