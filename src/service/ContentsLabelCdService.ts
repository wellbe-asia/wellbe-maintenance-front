import { useState } from 'react'
import CContentsLabelAPI from '@/@core/api/factoryCContentsLabel'
import { ContentsLabelType } from '@/@core/api/type/cContentsLabel'

const ContentsLabelCdService = () => {
  const [contentsLabel, setContentsLabelCd] = useState([] as ContentsLabelType[])
  const FetchContentsLabelCd = async (language: string) => {
    const { data } = await CContentsLabelAPI.GetCContentsLabel(Number(language))
    if (data?.c_contents_labels) {
      setContentsLabelCd(data.c_contents_labels)
    }
  }

  return { contentsLabel, setContentsLabelCd, FetchContentsLabelCd }
}

export default ContentsLabelCdService
