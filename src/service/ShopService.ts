import { useState } from 'react'

// ** API
import ShopAPI from '@/@core/api/factoryShop'

// ** hook
import { SERVER_STATUS } from '@/@core/utils/constant'
import { useLocale } from '@/@core/hooks/useLocal'

const ShopService = () => {
  const { GetMessage } = useLocale()

  const [loading, setLoading] = useState(false)

  const Publish = async (shopId: string): Promise<string> => {
    setLoading(true)
    try {
      const res = await ShopAPI.Publish(shopId)
      if (res.status !== 200) {
        const message = GetMessage(
          res.status,
          res.data?.result_code || SERVER_STATUS.SEVERERROR,
          res.data?.message || ''
        )

        return message
      }

      return ''
    } finally {
      setLoading(false)
    }
  }

  return {
    Publish,
    loading
  }
}

export default ShopService
