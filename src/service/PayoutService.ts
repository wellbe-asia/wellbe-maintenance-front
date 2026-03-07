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
import { parseMultipartAndDownload } from '@/@core/utils/multipartDownload'

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

  const DownloadPayoutNotification = async (payoutIds: string[]): Promise<{ message: string }> => {
    if (payoutIds.length === 0) {
      return { message: '対象のpayoutを選択してください。' }
    }
    try {
      setLoading(true)
      const res = await PAyoutAPI.downloadPayoutNotification(payoutIds)
      if (res.status !== 200 || !res.data) {
        const message = GetMessage(
          res.status,
          (res.data as any)?.result_code ?? SERVER_STATUS.SEVERERROR,
          (res.data as any)?.message ?? ''
        )

        return { message: message || 'ダウンロードに失敗しました。' }
      }
      const contentType = res.contentType ?? 'multipart/form-data'
      if (contentType.includes('multipart')) {
        parseMultipartAndDownload(res.data as ArrayBuffer, contentType)

        return { message: '' }
      }

      return { message: 'ダウンロードに失敗しました。' }
    } catch (err: any) {
      return {
        message: GetMessage(
          err?.response?.status ?? 500,
          err?.response?.data?.result_code ?? SERVER_STATUS.SEVERERROR,
          err?.response?.data?.message ?? ''
        )
      }
    } finally {
      setLoading(false)
    }
  }

  return {
    payoutList,
    GetPayoutList,
    CreatePayout,
    DownloadPayoutNotification,
    loading
  }
}

export default PayoutService
