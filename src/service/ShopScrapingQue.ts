import { useState } from 'react'

// ** hook
import { SERVER_STATUS } from '@/@core/utils/constant'
import { useLocale } from '@/@core/hooks/useLocal'

// ** service
import QueAPI from '@/@core/api/factoryShopScrapingQue'
import { ShopScrapingQueResponseGetType } from '@/@core/api/type/shopScrapingQue'

const ShopScrapingQueService = () => {
  const { GetMessage } = useLocale()

  const [loading, setLoading] = useState(false)
  const [queList, setQueList] = useState<ShopScrapingQueResponseGetType[]>([])

  const GetQueList = async (lastDate: string): Promise<{ message: string }> => {
    try {
      setLoading(true)
      const res = await QueAPI.Get(lastDate)
      if (res.status != 200) {
        const message = GetMessage(
          res.status,
          res.data?.result_code || SERVER_STATUS.SEVERERROR,
          res.data?.message || ''
        )

        setQueList([])

        return { message: message }
      }
      setQueList(res.data?.ques || [])

      return { message: '' }
    } finally {
      setLoading(false)
    }
  }

  const Delete = async (id: string): Promise<{ message: string }> => {
    try {
      setLoading(true)
      const res = await QueAPI.Delete(id)
      if (res.status != 200) {
        const message = GetMessage(
          res.status,
          res.data?.result_code || SERVER_STATUS.SEVERERROR,
          res.data?.message || ''
        )

        return { message: message }
      }

      return { message: '' }
    } finally {
      setLoading(false)
    }
  }

  return {
    queList,
    GetQueList,
    Delete,
    loading
  }
}

export default ShopScrapingQueService
