import axios from '@/@core/api/BaseAxios'
import { WContentsImageResponseType, WContentsImageType } from '../type/wContentsImage'

const WContentsImageAPI = {
  UploadShopImage: async (
    wContentsImageType: WContentsImageType
  ): Promise<{ status: number; data: WContentsImageResponseType }> => {
    try {
      const formData = new FormData()
      if (!wContentsImageType.Image) {
        return Promise.resolve({ data: { result_code: 0, message: '' }, status: 200 })
      }
      formData.append('images', wContentsImageType.Image)
      formData.append('file_name', wContentsImageType.FileName)
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER_CONTENTS_URL}/upload_w_contents_image`,
        formData,
        {
          headers: {
            Wellbe_Apikey: process.env.NEXT_PUBLIC_API_KEY_CONTENTS_MAINTENANCE
          }
        }
      )

      return response
    } catch (error: any) {
      return error
    }
  }
}

export default WContentsImageAPI
