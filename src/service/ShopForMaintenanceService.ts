import { useState } from 'react'

// ** Config
import { useRouter } from 'next/router'
import { getLanguageCdWithValue } from '@/configs/locales/locales'

// ** hook
import { DEFAULT_LANGUAGE, SERVER_STATUS } from '@/@core/utils/constant'
import { useLocale } from '@/@core/hooks/useLocal'

// ** service
import ShopAPI from '@/@core/api/factoryShop'
import { ShopResponseGetType } from '@/@core/api/type/shop'

const ShopForMaintenanceService = () => {
  const { GetMessage } = useLocale()

  const [loading, setLoading] = useState(false)
  const [shopList, setShopList] = useState<ShopResponseGetType[]>([])

  const { locale } = useRouter()

  const GetShopList = async (): Promise<{ message: string }> => {
    try {
      setLoading(true)
      const language = getLanguageCdWithValue(locale || DEFAULT_LANGUAGE)
      const res = await ShopAPI.getShopList(language)
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

  const GetShopContractedList = async (omitAvailable: boolean): Promise<{ message: string }> => {
    try {
      setLoading(true)
      const language = getLanguageCdWithValue(locale || DEFAULT_LANGUAGE)
      const res = await ShopAPI.getShopContractedList(language, omitAvailable)
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

  const GetShopScrapedList = async (): Promise<{ message: string }> => {
    try {
      setLoading(true)
      const language = getLanguageCdWithValue(locale || DEFAULT_LANGUAGE)
      const res = await ShopAPI.getShopScrapedList(language)
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

  const GetShopListApplicated = async (): Promise<{ message: string }> => {
    try {
      setLoading(true)
      const language = getLanguageCdWithValue(locale || DEFAULT_LANGUAGE)
      const res = await ShopAPI.getShopListApplicated(language)
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

  const GetShopListReviewing = async (): Promise<{ message: string }> => {
    try {
      setLoading(true)
      const language = getLanguageCdWithValue(locale || DEFAULT_LANGUAGE)
      const res = await ShopAPI.getShopListReviewing(language)
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

  const Approve = async (shopId: string): Promise<{ message: string }> => {
    try {
      setLoading(true)
      const res = await ShopAPI.approve(shopId)
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

  const Suspend = async (shopId: string): Promise<{ message: string }> => {
    try {
      setLoading(true)
      const res = await ShopAPI.suspend(shopId)
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

  const Delete = async (shopId: string): Promise<{ message: string }> => {
    try {
      setLoading(true)
      const res = await ShopAPI.delete(shopId)
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
    shopList,
    GetShopList,
    GetShopContractedList,
    GetShopScrapedList,
    GetShopListApplicated,
    GetShopListReviewing,
    Approve,
    Suspend,
    Delete,
    loading
  }
}

export default ShopForMaintenanceService
