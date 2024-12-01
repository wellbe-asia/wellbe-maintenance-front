import { useState } from 'react'

// ** Config
import { useRouter } from 'next/router'
import { getLanguageCdWithValue } from '@/configs/locales/locales'

// ** hook
import { DEFAULT_LANGUAGE, SERVER_STATUS } from '@/@core/utils/constant'
import { useLocale } from '@/@core/hooks/useLocal'

// ** service
import ShopAPI from '@/@core/api/factoryShop'
import { ShopPaymentResponseGetType } from '@/@core/api/type/shop'

const ShopForMaintenanceService = () => {
  const { GetMessage } = useLocale()

  const [loading, setLoading] = useState(false)
  const [shopList, setShopList] = useState<ShopPaymentResponseGetType[]>([])

  const { locale } = useRouter()

  const GetShopList = async (): Promise<{ message: string }> => {
    try {
      setLoading(true)
      const language = getLanguageCdWithValue(locale || DEFAULT_LANGUAGE)
      const res = await ShopAPI.getShopIndvidualPaymentList(language)
      if (res.status != 200) {
        const message = GetMessage(
          res.status,
          res.data?.result_code || SERVER_STATUS.SEVERERROR,
          res.data?.message || ''
        )

        setShopList([])

        return { message: message }
      }
      setShopList(res.data.shops || [])

      return { message: '' }
    } finally {
      setLoading(false)
    }
  }

  return {
    shopList,
    GetShopList,
    loading
  }
}

export default ShopForMaintenanceService
