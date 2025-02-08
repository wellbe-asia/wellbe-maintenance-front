// ** React Imports
import { ReactNode, ReactElement, useEffect } from 'react'

// ** Next Import
import { useRouter } from 'next/router'

// ** Hooks Import
import { useAuth } from 'src/hooks/useAuth'
import { SESSION_STORAGE_KEY_KEYWORD } from '@/@core/utils/constant'

interface AuthGuardProps {
  children: ReactNode
  fallback: ReactElement | null
}

const AuthGuard = (props: AuthGuardProps) => {
  const { children, fallback } = props
  const auth = useAuth()
  const router = useRouter()

  useEffect(
    () => {
      if (!router.isReady) {
        return
      }

      if (auth.maintenanceAccount === null && !window.localStorage.getItem(SESSION_STORAGE_KEY_KEYWORD.ACCOUNTID)) {
        if (router.pathname == '/account/redirect') {
          return
        }
        if (router.asPath !== '/') {
          router.push({
            pathname: '/login',
            query: { returnUrl: router.asPath }
          })
        } else {
          router.push('/login')
        }
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [router.route]
  )
  if (router.pathname == '/account/redirect') {
    return <>{children}</>
  }

  if (auth.loading || auth.maintenanceAccount === null) {
    return fallback
  }

  return <>{children}</>
}

export default AuthGuard
