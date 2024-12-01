import axios from '@/@core/api/BaseAxios'
import { ShopRecommendLabelResponseType } from '../type/shopRecommendLabel'

const ShopRecommendLabelAPI = {
  GetWithShopRecommendId: async (
    shopMenuId: string
  ): Promise<{ status: number; data: ShopRecommendLabelResponseType | null }> => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_SERVER_SHOP_URL}/shop_recommend_label_proofreadings/shop_menu_id?shop_menu_id=${shopMenuId}`,
        {
          headers: {
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

export default ShopRecommendLabelAPI
