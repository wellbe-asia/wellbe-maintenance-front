import axios from '@/@core/api/BaseAxios'
import { MenuAmountLimitMasterResponseType } from '../type/menuAmountLimiMaster'

const MenuAmountLimiMasterAPI = {
  getWithKey: async (currency_cd: string): Promise<{ status: number; data: MenuAmountLimitMasterResponseType }> => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_SERVER_SHOP_URL}/menu_amount_limit_masters/key?currency_cd=${currency_cd}`,
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

export default MenuAmountLimiMasterAPI
