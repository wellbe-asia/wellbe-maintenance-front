import axios from '@/@core/api/BaseAxios'
import { ShopContactResponseType, ShopContactType } from './../type/shopContact'

const ShopContactAPI = {
  GetWithShopId: async (shopId: string): Promise<{ status: number; data: ShopContactResponseType }> => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_SERVER_SHOP_URL}/shop_contact_proofreadings/shop_id?shop_id=${shopId}`,
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
  DeleteShopContact: async (id: string): Promise<{ status: number; data: ShopContactResponseType }> => {
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER_SHOP_URL}/cud/shop_contact_proofreading/delete`,
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
  CreateShopContact: async (
    shopContactType: ShopContactType
  ): Promise<{ status: number; data: ShopContactResponseType }> => {
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER_SHOP_URL}/cud/shop_contact_proofreading/create`,
        JSON.stringify({
          shop_id: shopContactType.ShopId,
          shop_tell_country_no_cd: shopContactType.ShopTellCountryNoCd,
          shop_tell_no: shopContactType.ShopTellNo,
          shop_email_address: shopContactType.ShopEmailAddress
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
  UpdateShopContact: async (
    shopContactType: ShopContactType
  ): Promise<{ status: number; data: ShopContactResponseType }> => {
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER_SHOP_URL}/cud/shop_contact_proofreading/update`,
        JSON.stringify({
          id: shopContactType.Id,
          shop_id: shopContactType.ShopId,
          shop_tell_country_no_cd: shopContactType.ShopTellCountryNoCd,
          shop_tell_no: shopContactType.ShopTellNo,
          shop_email_address: shopContactType.ShopEmailAddress
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
      console.log(error)

      return error
    }
  }
}

export default ShopContactAPI
