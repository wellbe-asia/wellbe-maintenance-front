import axios from '@/@core/api/BaseAxios'
import { ContentsDetailType, ContentsLabelType, ContentsOneLanguageType, ContentsResponseType } from '../type/contents'
import { CommonResponseType } from '../type/commonResponseType'
import { contentsImageResponseType, contentsImageType } from '../type/contentsImage'
import { dateFormatApi } from '@/@core/utils/date'

const ContentsApi = {
  CreateContents: async (
    contents: ContentsOneLanguageType
  ): Promise<{ status: number; data: ContentsResponseType }> => {
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER_CONTENTS_URL}/contents_proofreading/create`,
        JSON.stringify({
          contents_author_id: contents.ContentsAuthorId,
          url: contents.Url,
          is_display: String(contents.IsDisplay),
          publish_date: contents.PublishDate ? dateFormatApi(contents.PublishDate) : ''
        }),
        {
          headers: {
            'Content-Type': 'application/json',
            Wellbe_Apikey: process.env.NEXT_PUBLIC_API_KEY_CONTENTS_MAINTENANCE
          }
        }
      )

      return response
    } catch (error: any) {
      return error
    }
  },
  UpdateContents: async (
    contents: ContentsOneLanguageType
  ): Promise<{ status: number; data: ContentsResponseType }> => {
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER_CONTENTS_URL}/contents_proofreading/update`,
        JSON.stringify({
          id: contents.Id,
          contents_author_id: contents.ContentsAuthorId,
          url: contents.Url,
          is_display: String(contents.IsDisplay),
          publish_date: contents.PublishDate ? dateFormatApi(contents.PublishDate) : ''
        }),
        {
          headers: {
            'Content-Type': 'application/json',
            Wellbe_Apikey: process.env.NEXT_PUBLIC_API_KEY_CONTENTS_MAINTENANCE
          }
        }
      )

      return response
    } catch (error: any) {
      return error
    }
  },
  CreateContentsDetail: async (
    contentsDetail: ContentsDetailType
  ): Promise<{ status: number; data: CommonResponseType }> => {
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER_CONTENTS_URL}/cud/contents_detail_proofreading/create`,
        JSON.stringify({
          contents_id: contentsDetail.ContentsId,
          language_cd: contentsDetail.LanguageCd,
          title: contentsDetail.Title,
          summary: contentsDetail.Summary,
          contents: contentsDetail.Contents
        }),
        {
          headers: {
            'Content-Type': 'application/json',
            Wellbe_Apikey: process.env.NEXT_PUBLIC_API_KEY_CONTENTS_MAINTENANCE
          }
        }
      )

      return response
    } catch (error: any) {
      return error
    }
  },
  UpdateContentsDetail: async (
    contentsDetail: ContentsDetailType
  ): Promise<{ status: number; data: CommonResponseType }> => {
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER_CONTENTS_URL}/cud/contents_detail_proofreading/update`,
        JSON.stringify({
          id: contentsDetail.Id,
          contents_id: contentsDetail.ContentsId,
          language_cd: contentsDetail.LanguageCd,
          title: contentsDetail.Title,
          summary: contentsDetail.Summary,
          contents: contentsDetail.Contents
        }),
        {
          headers: {
            'Content-Type': 'application/json',
            Wellbe_Apikey: process.env.NEXT_PUBLIC_API_KEY_CONTENTS_MAINTENANCE
          }
        }
      )

      return response
    } catch (error: any) {
      return error
    }
  },
  CreateContentsLabel: async (
    contentsLabel: ContentsLabelType
  ): Promise<{ status: number; data: CommonResponseType }> => {
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER_CONTENTS_URL}/cud/contents_label_proofreading/create`,
        JSON.stringify({
          contents_id: contentsLabel.ContentsId,
          contents_label_cd: contentsLabel.ContentsLabelCd
        }),
        {
          headers: {
            'Content-Type': 'application/json',
            Wellbe_Apikey: process.env.NEXT_PUBLIC_API_KEY_CONTENTS_MAINTENANCE
          }
        }
      )

      return response
    } catch (error: any) {
      return error
    }
  },
  UpdateContentsLabel: async (
    contentsLabel: ContentsLabelType
  ): Promise<{ status: number; data: CommonResponseType }> => {
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER_CONTENTS_URL}/cud/contents_label_proofreading/update`,
        JSON.stringify({
          id: contentsLabel.Id,
          contents_id: contentsLabel.ContentsId,
          contents_label_cd: contentsLabel.ContentsLabelCd
        }),
        {
          headers: {
            'Content-Type': 'application/json',
            Wellbe_Apikey: process.env.NEXT_PUBLIC_API_KEY_CONTENTS_MAINTENANCE
          }
        }
      )

      return response
    } catch (error: any) {
      return error
    }
  },
  DeleteContentsLabel: async (id: string): Promise<{ status: number; data: CommonResponseType }> => {
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER_CONTENTS_URL}/contents_label_proofreading/delete`,
        JSON.stringify({
          id: id
        }),
        {
          headers: {
            'Content-Type': 'application/json',
            Wellbe_Apikey: process.env.NEXT_PUBLIC_API_KEY_CONTENTS_MAINTENANCE
          }
        }
      )

      return response
    } catch (error: any) {
      return error
    }
  },
  GetContentsById: async (id: string, LanguageCd: string): Promise<{ status: number; data: ContentsResponseType }> => {
    try {
      const response = await axios.get(
        `${
          process.env.NEXT_PUBLIC_SERVER_CONTENTS_URL
        }/query/contents_proofreading/filter?contents_id=${id}&language_cd=${LanguageCd}&limit=${10000}&offset=${0}`,
        {
          headers: {
            'Content-Type': 'application/json',
            Wellbe_Apikey: process.env.NEXT_PUBLIC_API_KEY_CONTENTS_MAINTENANCE
          }
        }
      )

      return response
    } catch (error: any) {
      return error
    }
  },
  GetAllContents: async (LanguageCd: string): Promise<{ status: number; data: ContentsResponseType }> => {
    try {
      const response = await axios.get(
        `${
          process.env.NEXT_PUBLIC_SERVER_CONTENTS_URL
        }/query/contents_proofreading/filter?language_cd=${LanguageCd}&limit=${10000}&offset=${0}`,
        {
          headers: {
            'Content-Type': 'application/json',
            Wellbe_Apikey: process.env.NEXT_PUBLIC_API_KEY_CONTENTS_MAINTENANCE
          }
        }
      )

      return response
    } catch (error: any) {
      return error
    }
  },
  Translate: async (id: string, LanguageCd: string): Promise<{ status: number; data: CommonResponseType }> => {
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER_CONTENTS_URL}/contents/translate`,
        JSON.stringify({
          id: id,
          language_cd: LanguageCd
        }),
        {
          headers: {
            'Content-Type': 'application/json',
            Wellbe_Apikey: process.env.NEXT_PUBLIC_API_KEY_CONTENTS_MAINTENANCE
          }
        }
      )

      return response
    } catch (error: any) {
      return error
    }
  },
  Publish: async (id: string): Promise<{ status: number; data: CommonResponseType }> => {
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER_CONTENTS_URL}/contents/publish`,
        JSON.stringify({
          id: id
        }),
        {
          headers: {
            'Content-Type': 'application/json',
            Wellbe_Apikey: process.env.NEXT_PUBLIC_API_KEY_CONTENTS_MAINTENANCE
          }
        }
      )

      return response
    } catch (error: any) {
      return error
    }
  },
  Hold: async (id: string): Promise<{ status: number; data: CommonResponseType }> => {
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER_CONTENTS_URL}/contents/hold`,
        JSON.stringify({
          id: id
        }),
        {
          headers: {
            'Content-Type': 'application/json',
            Wellbe_Apikey: process.env.NEXT_PUBLIC_API_KEY_CONTENTS_MAINTENANCE
          }
        }
      )

      return response
    } catch (error: any) {
      return error
    }
  },
  UploadContentsImage: async (
    contentImage: contentsImageType
  ): Promise<{ status: number; data: contentsImageResponseType }> => {
    try {
      const formData = new FormData()
      if (!contentImage.Image) {
        return Promise.resolve({ data: { result_code: 0, message: '' }, status: 200 })
      }
      formData.append('contents_id', contentImage.ContentsId)
      formData.append('images', contentImage.Image)
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER_CONTENTS_URL}/upload_contents_image`,
        formData,
        {
          headers: {
            Wellbe_Apikey: process.env.NEXT_PUBLIC_API_KEY_CONTENTS_MAINTENANCE
          }
        }
      )

      return response
    } catch (error: any) {
      return error
    }
  },
  GetContentsAuthor: async (
    LanguageCd: string,
    authorUrl?: string
  ): Promise<{ status: number; data: ContentsResponseType }> => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_SERVER_CONTENTS_URL}/query/contents_author?language_cd=${LanguageCd}&author_url=${
          authorUrl || ''
        }`,
        {
          headers: {
            'Content-Type': 'application/json',
            Wellbe_Apikey: process.env.NEXT_PUBLIC_API_KEY_WITHOUT_LOGIN_CONTENTS
          }
        }
      )

      return response
    } catch (error: any) {
      return error
    }
  }
}

export default ContentsApi
