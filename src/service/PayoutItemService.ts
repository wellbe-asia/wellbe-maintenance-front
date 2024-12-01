import { useState } from 'react'

// ** Config
import { useRouter } from 'next/router'
import { getLanguageCdWithValue } from '@/configs/locales/locales'

// ** hook
import { DEFAULT_LANGUAGE, SERVER_STATUS } from '@/@core/utils/constant'
import { useLocale } from '@/@core/hooks/useLocal'

// ** service
import PayoutItemAPI from '@/@core/api/factoryPayoutItem'
import { PayoutItemResponseGetType } from '@/@core/api/type/payoutItem'

const PayoutItemService = () => {
  const { GetMessage } = useLocale()

  const [loading, setLoading] = useState(false)
  const [payoutList, setPayoutList] = useState<PayoutItemResponseGetType[]>([])

  const { locale } = useRouter()

  const GetPayoutItemList = async (payoutId: string): Promise<{ message: string }> => {
    try {
      setLoading(true)
      const language = getLanguageCdWithValue(locale || DEFAULT_LANGUAGE)
      const res = await PayoutItemAPI.getPayoutItem(payoutId, language)
      if (res.status != 200) {
        const message = GetMessage(
          res.status,
          res.data?.result_code || SERVER_STATUS.SEVERERROR,
          res.data?.message || ''
        )

        setPayoutList([])

        return { message: message }
      }
      setPayoutList(res.data.payout_items || [])

      return { message: '' }
    } finally {
      setLoading(false)
    }
  }

  return {
    payoutList,
    GetPayoutItemList,
    loading
  }
}

export default PayoutItemService
