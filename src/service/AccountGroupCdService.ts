import { useState } from 'react'
import CAccountGroupAPI from '@/@core/api/factoryCAccountGroup'
import { AccountGroupType } from '@/@core/api/type/cAccountGroup'

const AccountGroupCdService = () => {
  const [accountGroupCd, setAccountGroupCd] = useState([] as AccountGroupType[])
  const FetchAccountGroupCd = async (language: string) => {
    const { data } = await CAccountGroupAPI.GetCAccountGroup(Number(language))
    if (data?.c_account_groups) {
      setAccountGroupCd(data.c_account_groups)
    }
  }

  return { accountGroupCd, setAccountGroupCd, FetchAccountGroupCd }
}

export default AccountGroupCdService
