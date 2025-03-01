import axios from '../BaseAxios'

const CShopImageFilterCategoryAPI = {
  GetCShopImageFilterCategory: async (languageCd: number) => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_SERVER_COMMON_URL}/c_shop_image_filter_categorys/language_cd?language_cd=${languageCd}`,
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

export default CShopImageFilterCategoryAPI
