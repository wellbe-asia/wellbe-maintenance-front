import axios from '../BaseAxios'
import { CheckoutTimingResponseType } from '../type/cCheckoutTiming'

const CCheckoutTimingAPI = {
  GetCCheckoutTiming: async (languageCd: number): Promise<{ status: number; data: CheckoutTimingResponseType }> => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_SERVER_COMMON_URL}/c_checkout_timings/language_cd?language_cd=${languageCd}`,
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

export default CCheckoutTimingAPI
