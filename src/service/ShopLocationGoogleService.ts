// ** hook
import { useLocale } from '@/@core/hooks/useLocal'
import { useState } from 'react'

// ** API
import ShopLocationGoogleAPI from '@/@core/api/factoryShopLocationGoogle'

// ** config
import { SERVER_STATUS } from '@/@core/utils/constant'
import { ShopLocationGoogleResponseGetType } from '@/@core/api/type/shopLocationGoogle'

const ShopLocationGoogleService = () => {
  const { GetMessage } = useLocale()
  const [shopLocationGoogleList, setShopLocationGoogleList] = useState<ShopLocationGoogleResponseGetType[]>([])
  const [loading, setLoading] = useState(false)

  const GetFromGoogleWithShopId = async (shopId: string, languageCd: string): Promise<{ message: string }> => {
    setLoading(true)
    try {
      const res = await ShopLocationGoogleAPI.GetFromGoogleWithShopId(shopId, languageCd)

      if (res.status != 200) {
        const message = GetMessage(
          res.status,
          res.data?.result_code || SERVER_STATUS.SEVERERROR,
          res.data?.message || ''
        )
        setShopLocationGoogleList([])

        return { message }
      }

      // idにplace_idを設定, それ以外はそのまま設定
      setShopLocationGoogleList(res.data?.shop_location_googles?.map(item => ({ ...item, id: item.place_id })) || [])

      return { message: '' }
    } finally {
      setLoading(false)
    }
  }

  const GetFromGoogleWithFilter = async (
    shopId: string,
    languageCd: string,
    query: string
  ): Promise<{ message: string }> => {
    setLoading(true)
    try {
      const res = await ShopLocationGoogleAPI.GetFromGoogleWithFilter(shopId, languageCd, query)
      if (res.status != 200) {
        const message = GetMessage(
          res.status,
          res.data?.result_code || SERVER_STATUS.SEVERERROR,
          res.data?.message || ''
        )
        setShopLocationGoogleList([])

        return { message }
      }
      setShopLocationGoogleList(res.data?.shop_location_googles?.map(item => ({ ...item, id: item.place_id })) || [])

      return { message: '' }
    } finally {
      setLoading(false)
    }
  }

  const Submit = async (shopId: string, placeId: string): Promise<{ message: string }> => {
    setLoading(true)
    try {
      const res = await ShopLocationGoogleAPI.Submit({
        ShopId: shopId,
        PlaceId: placeId
      })
      if (res.status != 200) {
        const message = GetMessage(
          res.status,
          res.data?.result_code || SERVER_STATUS.SEVERERROR,
          res.data?.message || ''
        )

        return { message }
      }

      return { message: '' }
    } finally {
      setLoading(false)
    }
  }

  const DeleteWithShopId = async (shopId: string): Promise<{ message: string; deletedCount: number | null }> => {
    setLoading(true)
    try {
      const res = await ShopLocationGoogleAPI.DeleteWithShopId(shopId)
      if (res.status != 200) {
        const message = GetMessage(
          res.status,

          // delete APIはdeleted_countのみ返すので result_code が無いケースも想定
          (res.data as any)?.result_code || SERVER_STATUS.SEVERERROR,
          (res.data as any)?.message || ''
        )

        return { message, deletedCount: null }
      }

      setShopLocationGoogleList([])

      return { message: '', deletedCount: res.data?.deleted_count ?? 0 }
    } finally {
      setLoading(false)
    }
  }

  return {
    GetFromGoogleWithShopId,
    GetFromGoogleWithFilter,
    Submit,
    DeleteWithShopId,
    shopLocationGoogleList,
    loading
  }
}

export default ShopLocationGoogleService
