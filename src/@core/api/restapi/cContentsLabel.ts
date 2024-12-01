import axios from '../BaseAxios'
import { ContentsLabelTypeResponseType } from '../type/cContentsLabel'

const CContentsLabelApi = {
  GetCContentsLabel: async (languageCd: number): Promise<{ status: number; data: ContentsLabelTypeResponseType }> => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_SERVER_COMMON_URL}/c_contents_labels/language_cd?language_cd=${languageCd}`,
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

export default CContentsLabelApi
