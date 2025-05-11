import axios from '@/@core/api/BaseAxios'
import { StateTypeResponseType } from '../type/cState'

const CStateAPI = {
  GetCState: async (
    languageCd: number,
    CountryCd: number
  ): Promise<{ status: number; data: StateTypeResponseType }> => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_SERVER_COMMON_URL}/c_states/country_cd?language_cd=${languageCd}&country_cd=${CountryCd}`,
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
  },
  GetCStateLanguage: async (languageCd: number): Promise<{ status: number; data: StateTypeResponseType }> => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_SERVER_COMMON_URL}/c_states/language_cd?language_cd=${languageCd}`,
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

export default CStateAPI
