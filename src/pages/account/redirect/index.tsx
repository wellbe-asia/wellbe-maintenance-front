import { useLocalStorage } from '@/@core/hooks/useLocalStorage'
import { DEFAULT_SESSION_STORAGE, SESSION_STORAGE_KEY_KEYWORD } from '@/@core/utils/constant'
import { useAuth } from '@/hooks/useAuth'
import { useRouter } from 'next/router'
import { useEffect } from 'react'

export default function Redirect() {
  const router = useRouter()
  const auth = useAuth()
  const token = useLocalStorage(SESSION_STORAGE_KEY_KEYWORD.TOKEN, DEFAULT_SESSION_STORAGE.TOKEN)
  const accountId = useLocalStorage(SESSION_STORAGE_KEY_KEYWORD.ACCOUNTID, DEFAULT_SESSION_STORAGE.ACCOUNTID)

  useEffect(() => {
    const { id_token, maintenance_account_id } = router.query

    const idToken = id_token && [id_token].flat(1).length > 0 ? [id_token].flat(1)[0] : ''
    const maintenanceAccountId =
      maintenance_account_id && [maintenance_account_id].flat(1).length > 0 ? [maintenance_account_id].flat(1)[0] : ''
    if (idToken && maintenanceAccountId) {
      token.setSessionValue(idToken)
      accountId.setSessionValue(maintenanceAccountId)
      auth.verifyAuth()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router])

  return <></>
}
