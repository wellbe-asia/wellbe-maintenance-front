// ** React Imports
import { createContext, useState, ReactNode, useEffect } from 'react'

// ** Next Import
import { useRouter } from 'next/router'

// ** Config
import authConfig from 'src/configs/auth'

// ** Types
import { AuthValuesType } from './types'
import LoginService from '@/service/LoginService'
import { SESSION_STORAGE_KEY_KEYWORD } from '@/@core/utils/constant'
import { ShopType } from '@/@core/api/type/shop'
import { MaintenanceAccountType } from '@/@core/api/type/account'
import { Alert, Snackbar } from '@mui/material'

// ** Defaults
const defaultProvider: AuthValuesType = {
  shop: null,
  maintenanceAccount: null,
  loading: false,
  setShop: () => null,
  setMaintenanceAccount: () => null,
  setLoading: () => Boolean,
  verifyAuth: () => Promise.resolve(),
  logout: () => Promise.resolve(),
  form: null
}

const AuthContext = createContext(defaultProvider)

type Props = {
  children: ReactNode
}

const AuthProvider = ({ children }: Props) => {
  // ** States
  const [shop, setShop] = useState<ShopType | null>(defaultProvider.shop)
  const [maintenanceAccount, setMaintenanceAccount] = useState<MaintenanceAccountType | null>(
    defaultProvider.maintenanceAccount
  )
  const [loading, setLoading] = useState<boolean>(defaultProvider.loading)
  const [open, setOpen] = useState(false)

  // ** Hooks
  const router = useRouter()

  useEffect(() => {
    const storedToken = window.localStorage.getItem(SESSION_STORAGE_KEY_KEYWORD.TOKEN)!
    const accountId = window.localStorage.getItem(SESSION_STORAGE_KEY_KEYWORD.ACCOUNTID)!
    if (storedToken) {
      loginService
        .VerifyAuth(storedToken, accountId)
        .then(async response => {
          if (response.message != '' || !response.maintenanceAccountToken) {
            setMaintenanceAccount(null)
            localStorage.removeItem(SESSION_STORAGE_KEY_KEYWORD.TOKEN)
            localStorage.removeItem(SESSION_STORAGE_KEY_KEYWORD.ACCOUNTID)
            setOpen(true)
          } else {
            setLoading(false)
            setMaintenanceAccount({
              id: response.maintenanceAccountToken.maintenance_account_id
            })
          }
        })
        .catch(() => {
          setMaintenanceAccount(null)
          localStorage.removeItem(SESSION_STORAGE_KEY_KEYWORD.TOKEN)
          localStorage.removeItem(SESSION_STORAGE_KEY_KEYWORD.ACCOUNTID)
          setShop(null)
          setLoading(false)
          if (authConfig.onTokenExpiration === 'logout' && !router.pathname.includes('login')) {
            router.replace('/login')
          }
        })
    } else {
      setLoading(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // ** Service
  const loginService = LoginService()
  const handleVerifyAuth = () => {
    const storedToken = window.localStorage.getItem(SESSION_STORAGE_KEY_KEYWORD.TOKEN)!
    const accountId = window.localStorage.getItem(SESSION_STORAGE_KEY_KEYWORD.ACCOUNTID)!
    if (storedToken) {
      loginService
        .VerifyAuth(storedToken, accountId)
        .then(async response => {
          if (response.message != '' || !response.maintenanceAccountToken) {
            setMaintenanceAccount(null)
            localStorage.removeItem(SESSION_STORAGE_KEY_KEYWORD.TOKEN)
            localStorage.removeItem(SESSION_STORAGE_KEY_KEYWORD.ACCOUNTID)
            router.push('/login')
          } else {
            setLoading(false)
            setMaintenanceAccount({
              id: response.maintenanceAccountToken.maintenance_account_id
            })
            router.push('/')
          }
        })
        .catch(() => {
          setMaintenanceAccount(null)
          localStorage.removeItem(SESSION_STORAGE_KEY_KEYWORD.TOKEN)
          localStorage.removeItem(SESSION_STORAGE_KEY_KEYWORD.ACCOUNTID)
          setShop(null)
          setLoading(false)
          if (authConfig.onTokenExpiration === 'logout' && !router.pathname.includes('login')) {
            router.replace('/login')
          }
        })
    } else {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    setShop(null)
    setMaintenanceAccount(null)
    localStorage.removeItem(SESSION_STORAGE_KEY_KEYWORD.TOKEN)
    localStorage.removeItem(SESSION_STORAGE_KEY_KEYWORD.ACCOUNTID)
    router.push('/login')
  }

  const values = {
    shop: shop,
    maintenanceAccount: maintenanceAccount,
    loading,
    setShop: setShop,
    setMaintenanceAccount: setMaintenanceAccount,
    setLoading,
    verifyAuth: handleVerifyAuth,
    logout: handleLogout,
    form: loginService.Form
  }

  return (
    <AuthContext.Provider value={values}>
      {children}
      <Snackbar
        anchorOrigin={{ horizontal: 'center', vertical: 'top' }}
        open={open}
        autoHideDuration={3000}
        onClose={() => {
          setOpen(false)
        }}
      >
        <Alert
          onClose={() => {
            setOpen(false)
          }}
          variant='filled'
          severity={'error'}
          sx={{ width: '100%', fontSize: '1.5rem' }}
        >
          {'Please login.'}
        </Alert>
      </Snackbar>
    </AuthContext.Provider>
  )
}

export { AuthContext, AuthProvider }
