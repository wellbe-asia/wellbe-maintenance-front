import ContentsAPI from '@/@core/api/factoryContents'
import { ContentsResponseGetType } from '@/@core/api/type/contents'
import { useState } from 'react'

const ContentsAuthorService = () => {
  const [contents, setContents] = useState<ContentsResponseGetType[]>([])

  const FetchContentsAuthor = async (language: string, url?: string) => {
    const res = await ContentsAPI.GetContentsAuthor(language, url)
    if (res && res.data && res.data.contents) {
      setContents(res.data.contents)
    }
  }

  return { FetchContentsAuthor, contents }
}

export default ContentsAuthorService
