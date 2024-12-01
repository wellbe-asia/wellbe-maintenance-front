import { useFieldArray, useForm } from 'react-hook-form'

// ** hook
import { SERVER_STATUS } from '@/@core/utils/constant'
import { useState } from 'react'
import { useLocale } from '@/@core/hooks/useLocal'
import { LanguageType } from '@/@core/api/type/cLanguage'
import CLanguageAPI from '@/@core/api/factoryCLanguage'
import {
  ContentsOneLanguageType,
  ContentsLabelType,
  ContentsDetailType,
  ContentsResponseGetType
} from '@/@core/api/type/contents'
import ContentsApi from '@/@core/api/factoryContents'
import { contentsImageType } from '@/@core/api/type/contentsImage'
import { WContentsImageType } from '@/@core/api/type/wContentsImage'
import WContentsImageApi from '@/@core/api/factoryWContentsImage'
import { dateFormatApi2Date } from '@/@core/utils/date'

export type ContentsFormType = {
  Content: ContentsOneLanguageType
}

export type WContentsImageFormType = {
  WContentsImages: WContentsImageType[]
}

const ContentsService = () => {
  const [loading, setLoading] = useState(false)
  const [submitLoading, setSubmitLoading] = useState(false)
  const { GetMessage } = useLocale()
  const [languageCds, setLanguageCds] = useState([] as LanguageType[])
  const [contentsList, setContentsList] = useState([] as ContentsResponseGetType[])

  const ContentsForm = useForm<ContentsFormType>({
    mode: 'onChange',
    defaultValues: { Content: { IsDisplay: true } }
  })

  const WContentsForm = useForm<WContentsImageFormType>({
    mode: 'onChange',
    defaultValues: { WContentsImages: [] }
  })

  const wContentsServiceFieldArray = useFieldArray({
    name: 'WContentsImages',
    control: WContentsForm.control
  })

  const WContentsServicesWatchFieldArray = WContentsForm.watch('WContentsImages')
  const WContentsServicesControlledFields = wContentsServiceFieldArray.fields.map((field, index) => {
    return {
      ...field,
      ...(WContentsServicesWatchFieldArray && WContentsServicesWatchFieldArray[index])
    }
  })

  const Init = async (contentId: string, defaultLanguageCd: string) => {
    setLoading(true)
    ContentsForm.reset()
    setLanguageCds([])

    try {
      const { data } = await CLanguageAPI.GetCLanguage()
      if (data?.c_languages) {
        for (let i = 0; i < data.c_languages.length; i++) {
          const v = data.c_languages[i]
          setLanguageCds(oldValue => [
            ...oldValue,
            {
              LanguageCd: String(v.language_cd),
              LanguageCharCd: v.language_char_cd,
              LanguageName: v.language_name,
              SortNumber: String(v.sort_number)
            }
          ])
        }
        await GetForm(contentId, defaultLanguageCd)
      }
    } finally {
      setLoading(false)
    }
  }

  const InitList = async (languageCd: string) => {
    setContentsList([])
    setLoading(true)

    try {
      const res = await ContentsApi.GetAllContents(languageCd)
      if (res.data.contents && res.data.contents.length > 0) {
        setContentsList(res.data.contents)
      }
    } finally {
      setLoading(false)
    }
  }

  const GetForm = async (contentId: string, languageCd: string) => {
    const res = await ContentsApi.GetContentsById(contentId, languageCd)

    const contentsLabel = [] as string[]
    if (res && res.status == 200 && res.data && res.data.contents && res.data.contents.length > 0) {
      const v = res.data.contents[0]
      if (res.data.contents && res.data.contents.length > 0 && res.data.contents[0].contents_labels) {
        for (let j = 0; j < res.data.contents[0].contents_labels.length; j++) {
          const d = res.data.contents[0].contents_labels[j]

          contentsLabel.push(String(d.contents_label_cd))
        }
      }

      const contentsDetail = {
        Id: '',
        ContentsId: contentId,
        LanguageCd: languageCd,
        Title: '',
        Summary: '',
        Contents: ''
      } as ContentsDetailType

      if (v.contents_details && v.contents_details.length > 0) {
        contentsDetail.Id = v.contents_details[0].id
        contentsDetail.LanguageCd = String(v.contents_details[0].language_cd)
        contentsDetail.ContentsId = v.contents_details[0].contents_id
        contentsDetail.Title = v.contents_details[0].title
        contentsDetail.Summary = v.contents_details[0].summary
        contentsDetail.Contents = v.contents_details[0].contents
      }

      const contentsImage = {
        Id: '',
        ContentsId: contentId,
        ImagePath: ''
      } as contentsImageType

      if (v.contents_image) {
        contentsImage.ImagePath = v.contents_image.path
      }

      ContentsForm.setValue('Content', {
        Id: contentId,
        ContentsStatus: String(v.contents_status),
        PublishDate: v.publish_date ? dateFormatApi2Date(v.publish_date) : null,
        Url: v.url,
        ContentsAuthorId: v.contents_author_id,
        IsDisplay: v.is_display,
        TransitionAll: v.transition_all,
        TransitionLastMonth: v.transition_last_month,
        ContentsLabelCds: contentsLabel,
        ContentsDetail: contentsDetail,
        ContentsImage: contentsImage
      })
    }
  }

  const Translate = async (contentId: string, languageCd: string): Promise<string> => {
    try {
      setSubmitLoading(true)
      const res = await ContentsApi.Translate(contentId || '', languageCd)
      if (res.status != 200) {
        const message = GetMessage(
          res.status,
          res.data?.result_code || SERVER_STATUS.SEVERERROR,
          res.data?.message || ''
        )

        return message
      }

      return ''
    } finally {
      setSubmitLoading(false)
    }
  }

  const Publish = async (contentId: string): Promise<string> => {
    try {
      setSubmitLoading(true)
      const res = await ContentsApi.Publish(contentId || '')
      if (res.status != 200) {
        const message = GetMessage(
          res.status,
          res.data?.result_code || SERVER_STATUS.SEVERERROR,
          res.data?.message || ''
        )

        return message
      }

      return ''
    } finally {
      setSubmitLoading(false)
    }
  }

  const Hold = async (contentId: string): Promise<string> => {
    try {
      setSubmitLoading(true)
      const res = await ContentsApi.Hold(contentId || '')
      if (res.status != 200) {
        const message = GetMessage(
          res.status,
          res.data?.result_code || SERVER_STATUS.SEVERERROR,
          res.data?.message || ''
        )

        return message
      }

      return ''
    } finally {
      setSubmitLoading(false)
    }
  }

  const Submit = async (): Promise<{
    message: string
    contentsId: string
  }> => {
    setSubmitLoading(true)
    const f = ContentsForm.getValues(`Content`)
    try {
      if (f.Id && f.Id != '') {
        // contents
        const resContents = await ContentsApi.UpdateContents(f)
        if (resContents.status != 200) {
          const message = GetMessage(
            resContents.status,
            resContents.data?.result_code || SERVER_STATUS.SEVERERROR,
            resContents.data?.message || ''
          )

          return { contentsId: '', message: message }
        }

        // contents detail
        const resContentsDetail = await ContentsApi.UpdateContentsDetail(f.ContentsDetail)
        if (resContentsDetail.status != 200) {
          const message = GetMessage(
            resContentsDetail.status,
            resContentsDetail.data?.result_code || SERVER_STATUS.SEVERERROR,
            resContentsDetail.data?.message || ''
          )

          return { contentsId: f.Id, message: message }
        }

        // delete contents label
        const resContentsLable = await ContentsApi.DeleteContentsLabel(f.Id)
        if (resContentsLable.status != 200) {
          const message = GetMessage(
            resContentsLable.status,
            resContentsLable.data?.result_code || SERVER_STATUS.SEVERERROR,
            resContentsLable.data?.message || ''
          )

          return { contentsId: f.Id, message: message }
        }

        // create contents label
        if (f.ContentsLabelCds) {
          for (const v of f.ContentsLabelCds) {
            const contentsLabelMessage = await ContentsLabelSubmit({ ContentsId: f.Id, ContentsLabelCd: v, Id: '' })
            if (contentsLabelMessage.message != '') {
              return { contentsId: f.Id, message: contentsLabelMessage.message }
            }
          }
        }

        // upload contents label
        const contentsImageMessage = await ContentsImageSubmit(f.ContentsImage)
        if (contentsImageMessage.message != '') {
          return { contentsId: f.Id, message: contentsImageMessage.message }
        }

        return { contentsId: f.Id, message: '' }
      } else {
        // create contents
        let contentsId = ''
        const resContents = await ContentsApi.CreateContents(f)
        if (resContents.status != 200) {
          const message = GetMessage(
            resContents.status,
            resContents.data?.result_code || SERVER_STATUS.SEVERERROR,
            resContents.data?.message || ''
          )

          return { contentsId: '', message: message }
        }

        contentsId = resContents.data.contents_proofreading?.id || ''

        // create contents detail
        const contentsDetail = {
          ContentsId: contentsId,
          LanguageCd: f.ContentsDetail.LanguageCd,
          Title: f.ContentsDetail.Title,
          Summary: f.ContentsDetail.Summary,
          Contents: f.ContentsDetail.Contents
        } as ContentsDetailType
        const resContentsDetail = await ContentsApi.CreateContentsDetail(contentsDetail)
        if (resContentsDetail.status != 200) {
          const message = GetMessage(
            resContentsDetail.status,
            resContentsDetail.data?.result_code || SERVER_STATUS.SEVERERROR,
            resContentsDetail.data?.message || ''
          )

          return { contentsId: contentsId, message: message }
        }

        // create contents label
        if (f.ContentsLabelCds) {
          for (const v of f.ContentsLabelCds) {
            const contentsLabelMessage = await ContentsLabelSubmit({
              ContentsId: contentsId,
              ContentsLabelCd: v,
              Id: ''
            })
            if (contentsLabelMessage.message != '') {
              return { contentsId: contentsId, message: contentsLabelMessage.message }
            }
          }
        }

        if (f.ContentsImage) {
          // upload contents label
          const contentsImageMessage = await ContentsImageSubmit({
            ContentsId: contentsId,
            Image: f.ContentsImage.Image
          })
          if (contentsImageMessage.message != '') {
            return { contentsId: contentsId, message: contentsImageMessage.message }
          }
        }

        return { contentsId: contentsId, message: '' }
      }
    } finally {
      setSubmitLoading(false)
    }
  }

  const ContentsLabelSubmit = async (
    contentsLabel: ContentsLabelType
  ): Promise<{
    message: string
  }> => {
    const resContentsLabel = await ContentsApi.CreateContentsLabel(contentsLabel)
    if (resContentsLabel.status != 200) {
      const message = GetMessage(
        resContentsLabel.status,
        resContentsLabel.data?.result_code || SERVER_STATUS.SEVERERROR,
        resContentsLabel.data?.message || ''
      )

      return { message }
    }

    return { message: '' }
  }

  const ContentsImageSubmit = async (
    contentsImage: contentsImageType
  ): Promise<{
    message: string
  }> => {
    const resContentsImage = await ContentsApi.UploadContentsImage(contentsImage)
    if (resContentsImage.status != 200) {
      const message = GetMessage(
        resContentsImage.status,
        resContentsImage.data?.result_code || SERVER_STATUS.SEVERERROR,
        resContentsImage.data?.message || ''
      )

      return { message }
    }

    return { message: '' }
  }

  const WContentsImageSubmit = async (
    wContentsImage: WContentsImageType
  ): Promise<{
    filePath: string
    message: string
  }> => {
    const resWContentsImage = await WContentsImageApi.UploadShopImage(wContentsImage)
    if (resWContentsImage.status != 200) {
      const message = GetMessage(
        resWContentsImage.status,
        resWContentsImage.data?.result_code || SERVER_STATUS.SEVERERROR,
        resWContentsImage.data?.message || ''
      )

      return { filePath: '', message: message }
    }

    WContentsForm.reset()
    wContentsServiceFieldArray.append({
      FileName: wContentsImage.FileName,
      Image: wContentsImage.Image,
      Path: `<figure>
  <img loading="lazy" src="${
    (resWContentsImage.data.w_contents_image &&
      resWContentsImage.data.w_contents_image.length > 0 &&
      resWContentsImage.data.w_contents_image[0].path) ||
    ''
  }?w=600&q=75&auto=format" alt="★★altを入力★★" width="350">
  <figcaption>★★キャプションを入力★★</figcaption>
</figure><br/>`
    })

    return {
      filePath:
        (resWContentsImage.data.w_contents_image &&
          resWContentsImage.data.w_contents_image.length > 0 &&
          resWContentsImage.data.w_contents_image[0].path) ||
        '',
      message: ''
    }
  }

  return {
    ContentsForm,
    WContentsForm,
    loading,
    submitLoading,
    languageCds,
    WContentsServicesControlledFields,
    contentsList,
    Init,
    InitList,
    Submit,
    setSubmitLoading,
    WContentsImageSubmit,
    Translate,
    Publish,
    Hold
  }
}

export default ContentsService
