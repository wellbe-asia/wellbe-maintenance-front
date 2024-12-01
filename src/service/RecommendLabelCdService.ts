import { useState } from 'react'
import CRecommendLabelAPI from '@/@core/api/factoryCRecommendLabel'
import { RecommendLabelType } from '@/@core/api/type/cRecommendLabel'

const RecommendLabelCdService = () => {
  const [recommendLabelCd, setRecommendLabelCd] = useState([] as RecommendLabelType[])
  const FetchRecommendLabelCd = async (language: string) => {
    const { data } = await CRecommendLabelAPI.GetCRecommendLabel(Number(language))
    if (data?.c_recommend_labels) {
      setRecommendLabelCd(data.c_recommend_labels)
    }
  }

  return { recommendLabelCd, setRecommendLabelCd, FetchRecommendLabelCd }
}

export default RecommendLabelCdService
