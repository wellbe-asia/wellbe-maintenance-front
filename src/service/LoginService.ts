import { useForm } from 'react-hook-form'

// ** API
import AccountAPI from '@/@core/api/factoryAccount'

// ** hook
import { useLocale } from '@/@core/hooks/useLocal'
import { VerifyAccountResponseGetType } from '@/@core/api/type/account'

export type LoginFormType = {
  emailAddress: string
  password: string
  propsedPassword: string
  rememberMe: boolean
}

const LoginService = () => {
  const { GetMessage } = useLocale()

  const Form = useForm<LoginFormType>({
    mode: 'onChange',
    defaultValues: {
      emailAddress: '',
      password: '',
      rememberMe: true
    }
  })
  const { reset } = Form

  const Init = async () => {
    reset()
  }

  const VerifyAuth = async (
    token: string,
    shopId: string
  ): Promise<{ message: string; maintenanceAccountToken: VerifyAccountResponseGetType | undefined }> => {
    const res = await AccountAPI.Verify(token, shopId)
    if (res.status !== 200) {
      const message = GetMessage(res.status, res.data?.result_code, res.data?.message)

      return { message: message, maintenanceAccountToken: {} as VerifyAccountResponseGetType }
    }

    return { message: '', maintenanceAccountToken: res.data?.maintenance_account_token }
  }

  return { Form, Init, VerifyAuth }
}

export default LoginService
