import axios from '../BaseAxios'
import { CurrencyTypeResponseType } from '../type/cCurrency'

const CurrencyForPaymentAPI = {
  GetCurrencyForPayment: async (languageCd: number): Promise<{ status: number; data: CurrencyTypeResponseType }> => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_SERVER_COMMON_URL}/query/currency_for_payments?language_cd=${languageCd}`,
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

export default CurrencyForPaymentAPI
