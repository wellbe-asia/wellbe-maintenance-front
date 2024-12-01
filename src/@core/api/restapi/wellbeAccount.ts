import axios from '@/@core/api/BaseAxios'
import { AccountResponseType } from '../type/wellbeAccount'

const AccountAPI = {
  GetAccount: async (accountId: string): Promise<{ status: number; data: AccountResponseType }> => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_SERVER_ACCOUNT_URL}/account?account_id=${accountId}`,
        {
          headers: {
            'Content-Type': 'application/json',
            Wellbe_Apikey: process.env.NEXT_PUBLIC_API_KEY_ACCOUNT_MAINTENANCE
          }
        }
      )

      return response
    } catch (error: any) {
      return error
    }
  },
  GetAccountList: async (languageCd: string): Promise<{ status: number; data: AccountResponseType }> => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_SERVER_ACCOUNT_URL}/account/maintenance/list?language_cd=${languageCd}`,
        {
          headers: {
            'Content-Type': 'application/json',
            Wellbe_Apikey: process.env.NEXT_PUBLIC_API_KEY_ACCOUNT_MAINTENANCE
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
