import axios from '@/@core/api/BaseAxios'
import { ShopCouponImageType } from '../type/shopCoupon'
import { CommonResponseType } from '../type/commonResponseType'

const ShopCouponImageAPI = {
  UploadShopImage: async (shopCouponImage: ShopCouponImageType) => {
    try {
      const formData = new FormData()
      if (!shopCouponImage.Image) {
        return Promise.resolve({ data: null, result_code: 200 })
      }
      formData.append('images', shopCouponImage.Image)
      formData.append('shop_coupon_id', shopCouponImage.ShopCouponId)
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER_SHOP_URL}/shop/upload_shop_coupon_image`,
        formData,
        {
          headers: {
            Wellbe_Apikey: process.env.NEXT_PUBLIC_API_KEY_SHOP_MAINTENANCE
          }
        }
      )

      return response
    } catch (error: any) {
      return error
    }
  },
  DeleteShopCouponImage: async (shopCouponId: string): Promise<{ status: number; data: CommonResponseType }> => {
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER_SHOP_URL}/shop/delete_shop_coupon_image`,
        JSON.stringify({ shop_coupon_id: shopCouponId }),
        {
          headers: {
            'Content-Type': 'application/json',
            Wellbe_Apikey: process.env.NEXT_PUBLIC_API_KEY_SHOP_MAINTENANCE
          }
        }
      )

      return response
    } catch (error: any) {
      return error
    }
  }
}

export default ShopCouponImageAPI
