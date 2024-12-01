import axios from '../BaseAxios'
import { LanguageTypeResponseType } from '../type/cLanguage'

const CLanguageAPI = {
  GetCLanguage: async (): Promise<{ status: number; data: LanguageTypeResponseType | null }> => {
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_SERVER_COMMON_URL}/c_languages/filter_col`, {
        headers: {
          'Content-Type': 'application/json',
          Wellbe_Apikey: process.env.NEXT_PUBLIC_API_KEY_WITHOUT_LOGIN
        }
      })

      return response
    } catch (error: any) {
      return error
    }
  }
}

export default CLanguageAPI
