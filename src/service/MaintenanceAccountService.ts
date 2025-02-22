import { useForm } from 'react-hook-form'
import { useState } from 'react'

// ** hook
import { useLocale } from '@/@core/hooks/useLocal'

// ** API
import { MaintenanceAccountResponseGetType, MaintenanceAccountType } from '@/@core/api/type/account'
import AccountAPI from '@/@core/api/factoryAccount'

export type MaintenanceAccountInfoType = {
  MaintenanceAccountType: MaintenanceAccountType
}

const MaintenanceAccountService = () => {
  const { GetMessage } = useLocale()

  const [loading, setLoading] = useState(false)

  const MaintenanceAccountForm = useForm<MaintenanceAccountInfoType>({
    mode: 'onChange',
    defaultValues: { MaintenanceAccountType: { AccountGroupCd: '', EmailAddress: '', id: '' } }
  })

  const GetAccount = async (languageCd: string): Promise<MaintenanceAccountResponseGetType[]> => {
    try {
      setLoading(true)
      const res = await AccountAPI.GetAccount('', languageCd)

      if (res.data && res.data.accounts && res.data.accounts.length > 0) {
        return res.data.accounts
      }

      return []
    } finally {
      setLoading(false)
    }
  }

  const Submit = async (
    token: string
  ): Promise<{
    message: string
  }> => {
    const f = MaintenanceAccountForm.getValues()
    setLoading(true)
    try {
      const res = await AccountAPI.CreateAccount(token, f.MaintenanceAccountType)
      if (res.status != 200) {
        const message = GetMessage(res.status, res.data.result_code, res.data.message)

        return { message }
      }

      return { message: '' }
    } finally {
      setLoading(false)
    }
  }

  return {
    MaintenanceAccountForm,
    GetAccount,
    Submit,
    loading
  }
}

export default MaintenanceAccountService
