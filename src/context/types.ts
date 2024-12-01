import { MaintenanceAccountType } from '@/@core/api/type/account'
import { ShopType } from '@/@core/api/type/shop'
import { LoginFormType } from '@/service/LoginService'
import { UseFormReturn } from 'react-hook-form/dist/types'

export type ErrCallbackType = (err: { [key: string]: string }) => void

export type LoginParams = {
  email: string
  password: string
  rememberMe?: boolean
}

export type UserDataType = {
  id: number
  role: string
  email: string
  fullName: string
  username: string
  password: string
  avatar?: string | null
}

export type AuthValuesType = {
  loading: boolean
  logout: () => void
  shop: ShopType | null
  maintenanceAccount: MaintenanceAccountType | null
  setLoading: (value: boolean) => void
  setShop: (value: ShopType | null) => void
  setMaintenanceAccount: (value: MaintenanceAccountType | null) => void
  verifyAuth: () => void
  form: UseFormReturn<LoginFormType, any> | null
}
