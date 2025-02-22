import axios from '@/@core/api/BaseAxios'
import {
  VerifyAccountResponseType,
  SignupInfo,
  MaintenanceAuthorizationResponseType,
  MaintenanceMenuAuthorizationResponseType,
  MaintenanceAccountResponseType,
  MaintenanceAccountType
} from '../type/account'
import { ShopResponseType, ShopType } from '../type/shop'
import { CommonResponseType } from '../type/commonResponseType'

const AccountAPI = {
  CreateShop: async (signupInfo: SignupInfo) => {
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER_SHOP_URL}/shop/create`,
        JSON.stringify({
          email_address: signupInfo.Email,
          shop_name: signupInfo.ShopName,
          identify_number: signupInfo.IdentifyNumber,
          tell_country_no_cd: signupInfo.TellCountryNoCd,
          tell_no: signupInfo.TellNo,
          admin_email_address: signupInfo.Email,
          basical_currency_cd: signupInfo.BasicalCurrencyCd,
          payment_currency_cd: signupInfo.PaymentCurrencyCd,
          booking_method_cd: signupInfo.BookingMethodCd,
          basical_language_cd: signupInfo.BasicalLanguageCd,
          shop_admin_pic_name: signupInfo.ShopAdminPicName,
          shop_admin_pic_tell_country_cd: String(signupInfo.ShopAdminPicTellCountryCd),
          shop_admin_pic_tell_no: signupInfo.ShopAdminPicTellNo,
          shop_admin_pic_email_address: signupInfo.ShopAdminPicEmailAddress,
          country_cd: signupInfo.CountryCd,
          state_cd: signupInfo.StateCd,
          address1: signupInfo.Address1,
          address2: signupInfo.Address2,
          address3: signupInfo.Address3,
          latitude: signupInfo.Latitude,
          longitude: signupInfo.Longitude,
          map_url: signupInfo.MapUrl
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
  Verify: async (
    token: string,
    maintenanceAccountId: string
  ): Promise<{ status: number; data: VerifyAccountResponseType }> => {
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER_MAINTENANCE_URL}/maintenance/account/verify`,
        JSON.stringify({
          maintenance_account_id: maintenanceAccountId
        }),
        {
          headers: {
            'Content-Type': 'application/json',
            Wellbe_Apikey: process.env.NEXT_PUBLIC_API_KEY_MAINTENANCE_WITH_LOGIN,
            Wellbe_MaintenanceAccountToken: token
          }
        }
      )

      return response
    } catch (error: any) {
      return error
    }
  },
  UpdateShop: async (shopType: ShopType): Promise<{ status: number; data: ShopResponseType }> => {
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER_SHOP_URL}/shop/update_shop`,
        JSON.stringify({
          id: shopType.Id,
          shop_name: shopType.ShopName,
          shop_identify_number: shopType.ShopIdentifyNumber,
          shop_admin_tell_no: shopType.ShopAdminTellNo,
          shop_admin_tell_country_no_cd: String(shopType.ShopAdminTellCountryNoCd),
          booking_method_cd: String(shopType.BookingMethodCd),
          checkout_timing_cd: String(shopType.CheckoutTimingCd),
          shop_country_cd: String(shopType.ShopCountryCd),
          shop_basical_language_cd: String(shopType.ShopBasicalLanguageCd),
          shop_admin_pic_name: shopType.ShopAdminPicName,
          shop_admin_pic_tell_country_cd: String(shopType.ShopAdminPicTellCountryCd),
          shop_admin_pic_tell_no: shopType.ShopAdminPicTellNo,
          shop_admin_pic_email_address: shopType.ShopAdminPicEmailAddress
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
  UpdateRank: async (shopType: ShopType) => {
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER_SHOP_URL}/shop/update_rank`,
        JSON.stringify({
          id: shopType.Id,
          rank: shopType.Rank
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
  UpdateShopEmail: async (shopType: ShopType) => {
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER_SHOP_URL}/shop/update_email`,
        JSON.stringify({
          id: shopType.Id,
          email_address: shopType.ShopAdminEmailAddress
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
  UpdateShopUrl: async (id: string, shopUrl: string): Promise<{ status: number; data: CommonResponseType }> => {
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER_SHOP_URL}/shop/update_shop_url`,
        JSON.stringify({
          id: id,
          shop_url: shopUrl
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
  GetShopWithKey: async (id: string): Promise<{ status: number; data: ShopResponseType }> => {
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_SERVER_SHOP_URL}/shop/key?id=${id}`, {
        headers: {
          'Content-Type': 'application/json',
          Wellbe_Apikey: process.env.NEXT_PUBLIC_API_KEY_SHOP_MAINTENANCE
        }
      })

      return response
    } catch (error: any) {
      return error
    }
  },
  GetAuthorizedMenu: async (
    maintenanceAccountId: string
  ): Promise<{ status: number; data: MaintenanceMenuAuthorizationResponseType }> => {
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER_MAINTENANCE_URL}/maintenance/menu_authorization/get`,
        JSON.stringify({
          maintenance_account_id: maintenanceAccountId
        }),
        {
          headers: {
            'Content-Type': 'application/json',
            Wellbe_Apikey: process.env.NEXT_PUBLIC_API_KEY_MAINTENANCE_WITH_LOGIN
          }
        }
      )

      return response
    } catch (error: any) {
      return error
    }
  },
  CheckMenuAuthorization: async (
    token: string,
    maintenanceAccountId: string,
    url: string
  ): Promise<{ status: number; data: MaintenanceAuthorizationResponseType }> => {
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER_MAINTENANCE_URL}/maintenance/menu_authorization/verify`,
        JSON.stringify({
          maintenance_account_id: maintenanceAccountId,
          url: url
        }),
        {
          headers: {
            'Content-Type': 'application/json',
            Wellbe_Apikey: process.env.NEXT_PUBLIC_API_KEY_MAINTENANCE_WITH_LOGIN,
            Wellbe_MaintenanceAccountToken: token
          }
        }
      )

      return response
    } catch (error: any) {
      return error
    }
  },
  CheckApiAuthorization: async (
    token: string,
    maintenanceAccountId: string,
    url: string
  ): Promise<{ status: number; data: MaintenanceAuthorizationResponseType }> => {
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER_MAINTENANCE_URL}/maintenance/api_authorization/verify`,
        JSON.stringify({
          maintenance_account_id: maintenanceAccountId,
          url: url
        }),
        {
          headers: {
            'Content-Type': 'application/json',
            Wellbe_Apikey: process.env.NEXT_PUBLIC_API_KEY_MAINTENANCE_WITH_LOGIN,
            Wellbe_MaintenanceAccountToken: token
          }
        }
      )

      return response
    } catch (error: any) {
      return error
    }
  },
  GetAccount: async (
    id: string,
    languageCd: string
  ): Promise<{ status: number; data: MaintenanceAccountResponseType }> => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_SERVER_MAINTENANCE_URL}/maintenance/account/get?id=${id}&language_cd=${languageCd}`,
        {
          headers: {
            'Content-Type': 'application/json',
            Wellbe_Apikey: process.env.NEXT_PUBLIC_API_KEY_MAINTENANCE_WITH_LOGIN
          }
        }
      )

      return response
    } catch (error: any) {
      return error
    }
  },
  CreateAccount: async (
    token: string,
    account: MaintenanceAccountType
  ): Promise<{ status: number; data: CommonResponseType }> => {
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER_MAINTENANCE_URL}/maintenance/account/create`,
        JSON.stringify({
          name: account.Name,
          email_address: account.EmailAddress,
          account_group_cd: account.AccountGroupCd
        }),
        {
          headers: {
            'Content-Type': 'application/json',
            Wellbe_Apikey: process.env.NEXT_PUBLIC_API_KEY_MAINTENANCE_WITH_LOGIN,
            Wellbe_MaintenanceAccountToken: token
          }
        }
      )

      return response
    } catch (error: any) {
      return error
    }
  }
}

export default AccountAPI
