import axios from '@/@core/api/BaseAxios'
import { ShopChipResponseType, ShopChipType } from '../type/shopChip'
import { removeCommas } from '@/@core/utils/amount'

const ShopChipAPI = {
  GetWithShopId: async (shopId: string): Promise<{ status: number; data: ShopChipResponseType }> => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_SERVER_SHOP_URL}/shop_chip_proofreadings/shop_id?shop_id=${shopId}`,
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
  },
  DeleteShopChip: async (id: string): Promise<{ status: number; data: ShopChipResponseType }> => {
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER_SHOP_URL}/cud/shop_chip_proofreading/delete`,
        JSON.stringify({ id: id }),
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
  },
  CreateShopChip: async (shopChipType: ShopChipType): Promise<{ status: number; data: ShopChipResponseType }> => {
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER_SHOP_URL}/cud/shop_chip_proofreading/create`,
        JSON.stringify({
          shop_id: shopChipType.ShopId,
          need_shop_chip: String(shopChipType.NeedShopChip),
          shop_chip_standard_ammount: removeCommas(shopChipType.ShopChipStandardAmmount)
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
  },
  UpdateShopChip: async (shopChipType: ShopChipType): Promise<{ status: number; data: ShopChipResponseType }> => {
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER_SHOP_URL}/cud/shop_chip_proofreading/update`,
        JSON.stringify({
          id: shopChipType.Id,
          shop_id: shopChipType.ShopId,
          need_shop_chip: String(shopChipType.NeedShopChip),
          shop_chip_standard_ammount: removeCommas(shopChipType.ShopChipStandardAmmount)
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

export default ShopChipAPI
