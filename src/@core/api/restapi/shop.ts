import axios from '@/@core/api/BaseAxios'
import { ShopPaymentResponseType, ShopResponseType, ShopType } from '../type/shop'

const ShopAPI = {
  getWithKey: async (id: string) => {
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_SERVER_SHOP_URL}/shops_with_key?id=${id}`, {
        headers: {
          'Content-Type': 'application/json',
          Wellbe_Apikey: process.env.NEXT_PUBLIC_API_KEY_WITHOUT_LOGIN
        }
      })

      return response
    } catch (error: any) {
      return error
    }
  },
  getWithFilter: async (filter: ShopType) => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_SERVER_SHOP_URL}/shops_with_filter_col?id=${filter.Id}&shop_no=${filter.ShopNo}&shop_name=${filter.ShopName}&shop_identify_number=${filter.ShopIdentifyNumber}&shop_admin_tell_no=${filter.ShopAdminTellNo}&shop_admin_tell_country_no=${filter.ShopAdminTellCountryNoCd}&shop_admin_email_address=${filter.ShopAdminEmailAddress}`,
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
  },
  DeleteShopMaintenance: async (token: string, id: string) => {
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER_SHOP_URL}/delete_shop`,
        JSON.stringify({ id: id }),
        {
          headers: {
            'Content-Type': 'application/json',
            Wellbe_Apikey: process.env.NEXT_PUBLIC_API_KEY_WITH_LOGIN,
            Wellbe_ShopToken: token
          }
        }
      )

      return response
    } catch (error: any) {
      return error
    }
  },
  CreateShopMaintenance: async (shopType: ShopType) => {
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER_SHOP_URL}/create_shop`,
        JSON.stringify({
          id: shopType.Id,
          shop_no: shopType.ShopNo,
          shop_name: shopType.ShopName,
          shop_identify_number: shopType.ShopIdentifyNumber,
          shop_admin_tell_no: shopType.ShopAdminTellNo,
          shop_admin_tell_country_no: String(shopType.ShopAdminTellCountryNoCd),
          shop_admin_email_address: shopType.ShopAdminEmailAddress
        }),
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
  },
  UpdateShopMaintenance: async (shopType: ShopType) => {
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER_SHOP_URL}/update_shop`,
        JSON.stringify({
          id: shopType.Id,
          shop_no: shopType.ShopNo,
          shop_name: shopType.ShopName,
          shop_identify_number: shopType.ShopIdentifyNumber,
          shop_admin_tell_no: shopType.ShopAdminTellNo,
          shop_admin_tell_country_no: String(shopType.ShopAdminTellCountryNoCd),
          shop_admin_email_address: shopType.ShopAdminEmailAddress
        }),
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
  },
  Publish: async (shopId: string) => {
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER_SHOP_URL}/shop/publish`,
        JSON.stringify({
          id: shopId
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
  getShopList: async (languageCd: string): Promise<{ status: number; data: ShopResponseType }> => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_SERVER_SHOP_URL}/maintenance/query/shop?language_cd=${languageCd}`,
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
  getShopContractedList: async (languageCd: string): Promise<{ status: number; data: ShopResponseType }> => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_SERVER_SHOP_URL}/maintenance/query/shop_contracted?language_cd=${languageCd}`,
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
  getShopScrapedList: async (languageCd: string): Promise<{ status: number; data: ShopResponseType }> => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_SERVER_SHOP_URL}/maintenance/query/shop_scraped?language_cd=${languageCd}`,
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
  getShopListApplicated: async (languageCd: string): Promise<{ status: number; data: ShopResponseType }> => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_SERVER_SHOP_URL}/maintenance/query/shop_applicated?language_cd=${languageCd}`,
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
  getShopIndvidualPaymentList: async (
    languageCd: string
  ): Promise<{ status: number; data: ShopPaymentResponseType }> => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_SERVER_SHOP_URL}/maintenance/shops/individual_payment?language_cd=${languageCd}`,
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
  approve: async (shopId: string): Promise<{ status: number; data: ShopResponseType }> => {
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER_SHOP_URL}/shop/approve`,
        JSON.stringify({
          id: shopId
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
  suspend: async (shopId: string): Promise<{ status: number; data: ShopResponseType }> => {
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER_SHOP_URL}/shop/suspend`,
        JSON.stringify({
          id: shopId
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
  delete: async (shopId: string): Promise<{ status: number; data: ShopResponseType }> => {
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER_SHOP_URL}/cud/shop/delete`,
        JSON.stringify({
          id: shopId
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

export default ShopAPI
