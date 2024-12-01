import { useState } from 'react'

// ** Config
import { useRouter } from 'next/router'
import { getLanguageCdWithValue } from '@/configs/locales/locales'

// ** hook
import { DEFAULT_LANGUAGE, SERVER_STATUS } from '@/@core/utils/constant'
import { useLocale } from '@/@core/hooks/useLocal'

// ** service
import { CheckoutResponseGetType } from '@/@core/api/type/checkout'
import CheckoutAPI from '@/@core/api/factoryCheckout'
import { getFirstDayOfLastMonth } from '@/@core/utils/date'

const CheckoutService = () => {
  const { GetMessage } = useLocale()

  const [loading, setLoading] = useState(false)
  const [checkoutList, setCheckoutList] = useState<CheckoutResponseGetType[]>([])

  const { locale } = useRouter()

  const GetCheckoutList = async (): Promise<{ message: string }> => {
    try {
      setLoading(true)
      const language = getLanguageCdWithValue(locale || DEFAULT_LANGUAGE)
      const lastMonth = getFirstDayOfLastMonth()
      const res = await CheckoutAPI.getCheckoutFilter('', lastMonth, '', '', language)
      if (res.status != 200) {
        const message = GetMessage(
          res.status,
          res.data?.result_code || SERVER_STATUS.SEVERERROR,
          res.data?.message || ''
        )

        setCheckoutList([])

        return { message: message }
      }
      setCheckoutList(res.data.checkouts || [])

      return { message: '' }
    } finally {
      setLoading(false)
    }
  }

  return {
    checkoutList,
    GetCheckoutList,
    loading
  }
}

export default CheckoutService
