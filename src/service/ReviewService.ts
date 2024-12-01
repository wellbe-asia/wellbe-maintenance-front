import { useState } from 'react'

// ** Config
import { useRouter } from 'next/router'
import { getLanguageCdWithValue } from '@/configs/locales/locales'

// ** hook
import { DEFAULT_LANGUAGE, SERVER_STATUS } from '@/@core/utils/constant'
import { useLocale } from '@/@core/hooks/useLocal'

// ** service
import ReviewAPI from '@/@core/api/factoryReview'
import { ReviewHeader } from '@/@core/api/type/review'

const ReviewService = () => {
  const { GetMessage } = useLocale()

  const [loading, setLoading] = useState(false)
  const [reviewList, setReviewList] = useState<ReviewHeader[]>([])

  const { locale } = useRouter()

  const GetReviewList = async (): Promise<{ message: string }> => {
    try {
      setLoading(true)
      const language = getLanguageCdWithValue(locale || DEFAULT_LANGUAGE)
      const res = await ReviewAPI.Filter(language, 1000)
      if (res.status != 200) {
        const message = GetMessage(
          res.status,
          res.data?.result_code || SERVER_STATUS.SEVERERROR,
          res.data?.message || ''
        )

        setReviewList([])

        return { message: message }
      }
      setReviewList(res.data.reviews || [])

      return { message: '' }
    } finally {
      setLoading(false)
    }
  }

  const GetReviewOne = async (id: string): Promise<{ data: ReviewHeader }> => {
    try {
      setLoading(true)
      const language = getLanguageCdWithValue(locale || DEFAULT_LANGUAGE)
      const res = await ReviewAPI.GetOne(id, language)

      if (res && res.data && res.data.reviews && res.data.reviews.length > 0) {
        return { data: res.data.reviews[0] }
      }

      return { data: {} as ReviewHeader }
    } finally {
      setLoading(false)
    }
  }

  const Approve = async (id: string): Promise<{ message: string }> => {
    try {
      setLoading(true)
      const res = await ReviewAPI.Approve(id)
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

  const Deny = async (id: string): Promise<{ message: string }> => {
    try {
      setLoading(true)
      const res = await ReviewAPI.Deny(id)
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
    reviewList,
    GetReviewList,
    GetReviewOne,
    Approve,
    Deny,
    loading
  }
}

export default ReviewService
