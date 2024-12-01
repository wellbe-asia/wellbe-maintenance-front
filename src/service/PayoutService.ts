import { useState } from 'react'

// ** Config
import { useRouter } from 'next/router'
import { getLanguageCdWithValue } from '@/configs/locales/locales'

// ** hook
import { DEFAULT_LANGUAGE, SERVER_STATUS } from '@/@core/utils/constant'
import { useLocale } from '@/@core/hooks/useLocal'

// ** service
import PAyoutAPI from '@/@core/api/factoryPayout'
import { PayoutResponseGetType } from '@/@core/api/type/payout'

const PayoutService = () => {
  const { t, GetMessage } = useLocale()

  const [loading, setLoading] = useState(false)
  const [payoutList, setPayoutList] = useState<PayoutResponseGetType[]>([])

  const { locale } = useRouter()

  const GetPayoutList = async (): Promise<{ message: string }> => {
    try {
      setLoading(true)
      const language = getLanguageCdWithValue(locale || DEFAULT_LANGUAGE)
      const res = await PAyoutAPI.getPayoutFilter('', '', '', '', language)
      if (res.status != 200) {
        const message = GetMessage(
          res.status,
          res.data?.result_code || SERVER_STATUS.SEVERERROR,
          res.data?.message || ''
        )

        setPayoutList([])

        return { message: message }
      }
      setPayoutList(res.data.payouts || [])

      return { message: '' }
    } finally {
      setLoading(false)
    }
  }

  const CreatePayout = async (
    shopId: string,
    payoutDate: string,
    closingDate: string
  ): Promise<{ message: string }> => {
    try {
      setLoading(true)
      const res = await PAyoutAPI.createPayout(shopId, payoutDate, closingDate)
      if (res.status != 200) {
        const message = GetMessage(
          res.status,
          res.data?.result_code || SERVER_STATUS.SEVERERROR,
          res.data?.message || ''
        )

        setPayoutList([])

        return { message: message }
      } else if (res.data.payouts == undefined || res.data.payouts == null) {
        return { message: t.MESSAGE_NOT_EXISTS_CHECKOUT_FOR_PAYMENT }
      }
      setPayoutList(res.data.payouts || [])

      return { message: '' }
    } finally {
      setLoading(false)
    }
  }

  return {
    payoutList,
    GetPayoutList,
    CreatePayout,
    loading
  }
}

export default PayoutService
