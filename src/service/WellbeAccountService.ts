import { useState } from 'react'

// ** API
import WellbeAccountAPI from '@/@core/api/factoryWellbeAccount'
import { AccountResponseGetType } from '@/@core/api/type/wellbeAccount'
import { SERVER_STATUS } from '@/@core/utils/constant'

const WellbeAccountService = () => {
  const [account, setAccount] = useState<AccountResponseGetType>()
  const [accounts, setAccounts] = useState<AccountResponseGetType[]>([])
  const [loading, setLoading] = useState(false)

  const GetAccount = async (accountId: string): Promise<number> => {
    setLoading(true)
    try {
      const { data, status } = await WellbeAccountAPI.GetAccount(accountId)
      if (data && data.account) {
        setAccount(data.account)
      }
      if (data && data.result_code != undefined && status != SERVER_STATUS.SUCCESS) {
        return data.result_code
      } else if (status > 299) {
        return SERVER_STATUS.SEVERERROR
      } else {
        return SERVER_STATUS.SUCCESS
      }
    } finally {
      setLoading(false)
    }
  }

  const GetAccountList = async (languageCd: string): Promise<number> => {
    setLoading(true)
    try {
      const { data, status } = await WellbeAccountAPI.GetAccountList(languageCd)
      if (data && data.accounts) {
        setAccounts(data.accounts)
      }
      if (data && data.result_code != undefined && status != SERVER_STATUS.SUCCESS) {
        return data.result_code
      } else if (status > 299) {
        return SERVER_STATUS.SEVERERROR
      } else {
        return SERVER_STATUS.SUCCESS
      }
    } finally {
      setLoading(false)
    }
  }

  return {
    GetAccount,
    GetAccountList,
    account,
    accounts,
    loading
  }
}

export default WellbeAccountService
