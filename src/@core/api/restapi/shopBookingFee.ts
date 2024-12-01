import axios from '@/@core/api/BaseAxios'
import { CommonResponseType } from '../type/commonResponseType'

const ShopBookingFeeApi = {
  UpdateBookingFee: async (shopId: string, fee: string): Promise<{ status: number; data: CommonResponseType }> => {
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER_SHOP_URL}/shop/update_fee`,
        JSON.stringify({
          id: shopId,
          wellbe_fee: fee
        }),
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

export default ShopBookingFeeApi
