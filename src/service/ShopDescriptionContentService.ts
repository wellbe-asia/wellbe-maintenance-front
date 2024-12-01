import { useForm, useFieldArray } from 'react-hook-form'

// ** API
import ShopDescriptionAPI from '@/@core/api/factoryShopDescription'
import { ShopDescriptionType } from '@/@core/api/type/shopDescription'
import { ShopContentType } from '@/@core/api/type/shopContent'
import { ShopImageType } from '@/@core/api/type/shopImage'

// ** hook
import { DEFAULT_SORT_ORDER, SERVER_STATUS, SHOP_CONTENT_CATEGORY } from '@/@core/utils/constant'
import { useEffect, useState } from 'react'
import ShopContentAPI from '@/@core/api/factoryShopContent'
import ShopImageAPI from '@/@core/api/factoryShopImage'
import ShopContentImageAPI from '@/@core/api/factoryShopContentImage'
import { ShopContentImageType } from '@/@core/api/type/shopContentImage'
import { useLocale } from '@/@core/hooks/useLocal'
import { LanguageResponseGetType, LanguageType } from '@/@core/api/type/cLanguage'
import CLanguageAPI from '@/@core/api/factoryCLanguage'

export type ShopDescriptionContentFormType = {
  ShopDescriptionContents: ShopDescriptionContentsType[]
}

export type ShopDescriptionContentsType = {
  LanguageCd: string
  ShopImages: ShopImageType[]
  ShopDescription: ShopDescriptionType
  ShopContents: ShopContentType[]
}

type SetAddShopImageType = { languageCd: string; func: (image: ShopImageType) => void }
type SetRemoveShopImageType = { languageCd: string; func: (index: number) => void }
type SetAddShopContentImageType = { languageCd: string; func: (image: ShopContentImageType) => void }
type SetRemoveShopContentImageType = { languageCd: string; func: (index: number) => void }

const ShopDescriptionContentService = () => {
  const [loading, setLoading] = useState(false)
  const [submitLoading, setSubmitLoading] = useState(false)
  const { GetMessage, t } = useLocale()
  const [languageCds, setLanguageCds] = useState([] as LanguageType[])
  const [languageCdHasError, setLanguageCdHasError] = useState([] as boolean[])

  const [addShopImage, setAddShopImage] = useState<SetAddShopImageType[]>([])
  const [removeShopImage, setRemoveShopImage] = useState<SetRemoveShopImageType[]>([])

  const [addShopContentImage, setAddShopContentImage] = useState<SetAddShopContentImageType[]>([])
  const [removeShopContentImage, setRemoveShopContentImage] = useState<SetRemoveShopContentImageType[]>([])

  const ShopDescriptionContentsForm = useForm<ShopDescriptionContentFormType>({
    mode: 'onChange',
    defaultValues: { ShopDescriptionContents: [] }
  })
  const ShopDescriptionContentsFieldArray = useFieldArray({
    name: 'ShopDescriptionContents',
    control: ShopDescriptionContentsForm.control
  })

  const ShopDescriptionContentsWatchFieldArray = ShopDescriptionContentsForm.watch('ShopDescriptionContents')
  const ControlledFields = ShopDescriptionContentsFieldArray.fields.map((field, index) => {
    return {
      ...field,
      ...ShopDescriptionContentsWatchFieldArray[index]
    }
  })

  useEffect(() => {
    CheckHasError()
  }, [ShopDescriptionContentsWatchFieldArray])

  const CheckHasError = () => {
    const varHasErrors = [] as boolean[]
    for (const v of ControlledFields) {
      if (v.ShopDescription.ShopName && v.ShopDescription.ShopName != '') {
        varHasErrors.push(false)
      } else {
        varHasErrors.push(true)
      }
    }
    setLanguageCdHasError(varHasErrors)
  }

  const Init = async (shopId: string) => {
    setLoading(true)
    ShopDescriptionContentsForm.reset()
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
          await GetForm(shopId, v)
        }
      }
    } finally {
      setLoading(false)
    }
  }

  const SetAddShopImage = (languageCd: string, func: (image: ShopImageType) => void) => {
    for (const v of addShopImage) {
      if (v.languageCd == languageCd) {
        return
      }
    }

    setAddShopImage([...addShopImage, { languageCd: languageCd, func: func }])
  }

  const SetRemoveShopImage = (languageCd: string, func: (index: number) => void) => {
    for (const v of addShopImage) {
      if (v.languageCd == languageCd) {
        return
      }
    }

    setRemoveShopImage([...removeShopImage, { languageCd: languageCd, func: func }])
  }

  const ClearAddShopImage = () => {
    setAddShopImage([])
  }

  const ClearRemoveShopImage = () => {
    setRemoveShopImage([])
  }

  const ClearAddShopContentImage = () => {
    setAddShopContentImage([])
  }

  const ClearRemoveShopContentImage = () => {
    setAddShopContentImage([])
  }

  const AddShopImage = (excludeLanguageCd: string, shopImage: ShopImageType) => {
    for (const v of addShopImage) {
      if (v.languageCd != excludeLanguageCd) {
        const d = shopImage
        d.LanguageCd = v.languageCd
        const categories = [] as string[]
        for (const k of d.ShopImageCategories) {
          categories.push(k)
        }
        v.func({
          Id: d.Id,
          ImageCategory: d.ImageCategory,
          LanguageCd: v.languageCd,
          ShopId: d.ShopId,
          ShopImage: d.ShopImage,
          ShopImageAlt: d.ShopImageAlt,
          ShopImageDescription: d.ShopImageDescription,
          ShopImagePath: d.ShopImagePath,
          ShopImageCategories: categories
        })
      }
    }
  }

  const RemoveShopImage = (excludeLanguageCd: string, index: number) => {
    for (const v of removeShopImage) {
      if (v.languageCd != excludeLanguageCd) {
        v.func(index)
      }
    }
  }

  const SetAddShopContentImage = (languageCd: string, func: (image: ShopContentImageType) => void) => {
    for (const v of addShopImage) {
      if (v.languageCd == languageCd) {
        return
      }
    }

    setAddShopContentImage([...addShopContentImage, { languageCd: languageCd, func: func }])
  }

  const SetRemoveShopContentImage = (languageCd: string, func: (index: number) => void) => {
    for (const v of addShopImage) {
      if (v.languageCd == languageCd) {
        return
      }
    }

    setRemoveShopContentImage([...removeShopContentImage, { languageCd: languageCd, func: func }])
  }

  const AddShopContentImage = (excludeLanguageCd: string, shopImage: ShopContentImageType) => {
    for (const v of addShopContentImage) {
      if (v.languageCd != excludeLanguageCd) {
        const d = shopImage
        d.LanguageCd = v.languageCd
        v.func({
          Id: d.Id,
          ImageCategory: d.ImageCategory,
          LanguageCd: v.languageCd,
          ShopContentId: d.ShopContentId,
          ShopImage: d.ShopImage,
          ShopImageAlt: d.ShopImageAlt,
          ShopImageDescription: d.ShopImageDescription,
          ShopImagePath: d.ShopImagePath
        })
      }
    }
  }

  const RemoveShoContentpImage = (excludeLanguageCd: string, index: number) => {
    for (const v of removeShopContentImage) {
      if (v.languageCd != excludeLanguageCd) {
        v.func(index)
      }
    }
  }

  const GetForm = async (shopId: string, d: LanguageResponseGetType) => {
    const sdResponse = await ShopDescriptionAPI.GetWithShopId(shopId, String(d.language_cd))
    const scResponse = await ShopContentAPI.GetWithShopId(shopId, String(d.language_cd))
    const siResponse = await ShopImageAPI.GetWithShopId(shopId, String(d.language_cd))

    let shopDescription = {} as ShopDescriptionType

    // shop_description
    if (
      sdResponse &&
      sdResponse.status == 200 &&
      sdResponse.data &&
      sdResponse.data.shop_description_proofreadings &&
      sdResponse.data.shop_description_proofreadings.length > 0
    ) {
      const v = sdResponse.data.shop_description_proofreadings[0]
      shopDescription = {
        Id: v.id,
        ShopId: v.shop_id,
        LanguageCd: String(v.language_cd),
        ShopName: v.shop_name
      }
    } else {
      shopDescription = {
        Id: '',
        ShopId: shopId,
        LanguageCd: String(d.language_cd),
        ShopName: ''
      }
    }

    const shopContents = [] as ShopContentType[]
    if (
      scResponse &&
      scResponse.status == 200 &&
      scResponse.data &&
      scResponse.data.shop_content_proofreadings &&
      scResponse.data.shop_content_proofreadings.length > 0
    ) {
      for (let j = 0; j < scResponse.data.shop_content_proofreadings.length; j++) {
        const v = scResponse.data.shop_content_proofreadings[j]

        const shopContentImages = [] as ShopContentImageType[]
        const sciResponse = await ShopContentImageAPI.GetShopContentImage(v.id, String(d.language_cd))
        if (
          sciResponse &&
          sciResponse.status == 200 &&
          sciResponse.data &&
          sciResponse.data.shop_content_image_proofreadings &&
          sciResponse.data.shop_content_image_proofreadings.length > 0
        ) {
          for (let k = 0; k < sciResponse.data.shop_content_image_proofreadings.length; k++) {
            const w = sciResponse.data.shop_content_image_proofreadings[k]
            shopContentImages.push({
              Id: w.id,
              ShopContentId: w.shop_content_id,
              LanguageCd: String(w.language_cd),
              ShopImagePath: w.shop_image_path,
              ImageCategory: w.image_category,
              ShopImageAlt: w.shop_image_alt,
              ShopImageDescription: w.shop_image_description,
              ShopImage: undefined
            })
          }
        }
        shopContents.push({
          Id: v.id,
          ShopId: v.shop_id,
          ContentCategory: v.content_category,
          LanguageCd: String(v.language_cd),
          ContentTitle: v.content_title,
          ContentBody: v.content_body,
          SortOrder: String(v.sort_order),
          ShopContentImages: shopContentImages
        })
      }
    } else {
      shopContents.push({
        Id: '',
        ShopId: shopId,
        ContentCategory: SHOP_CONTENT_CATEGORY.MAIN_DESCRIPTION,
        LanguageCd: String(d.language_cd),
        ContentTitle: '',
        ContentBody: '',
        SortOrder: DEFAULT_SORT_ORDER.FIRST,
        ShopContentImages: []
      })
    }

    const shopImages = [] as ShopImageType[]
    if (
      siResponse &&
      siResponse.status == 200 &&
      siResponse.data &&
      siResponse.data.shop_image_proofreadings &&
      siResponse.data.shop_image_proofreadings.length > 0
    ) {
      for (let j = 0; j < siResponse.data.shop_image_proofreadings.length; j++) {
        const v = siResponse.data.shop_image_proofreadings[j]
        const shopImageCategories = [] as string[]
        if (v.shop_image_category_proofreadings) {
          for (const d of v.shop_image_category_proofreadings) {
            shopImageCategories.push(String(d.shop_image_filter_category_cd))
          }
        }
        shopImages.push({
          Id: v.id,
          ShopId: v.shop_id,
          LanguageCd: String(v.language_cd),
          ShopImagePath: v.shop_image_path,
          ImageCategory: v.image_category,
          ShopImageAlt: v.shop_image_alt,
          ShopImageDescription: v.shop_image_description,
          ShopImage: undefined,
          ShopImageCategories: shopImageCategories
        })
      }
    }

    ShopDescriptionContentsFieldArray.append({
      LanguageCd: String(d.language_cd),
      ShopContents: shopContents,
      ShopDescription: shopDescription,
      ShopImages: shopImages
    })
  }

  const Translate = async (shopId: string, languageIndex: number): Promise<string> => {
    try {
      if (languageCds.length > languageIndex) {
        setSubmitLoading(true)
        const res = await ShopDescriptionAPI.TranslateShopDescription(
          shopId || '',
          languageCds[languageIndex].LanguageCd
        )
        if (res.status != 200) {
          const message = GetMessage(
            res.status,
            res.data?.result_code || SERVER_STATUS.SEVERERROR,
            res.data?.message || ''
          )

          return message
        }

        return ''
      } else {
        return t.MESSAGE_ETC_ERROR
      }
    } finally {
      setSubmitLoading(false)
    }
  }

  const Submit = async (
    languageIndex: number
  ): Promise<{
    message: string
    trace: 'shopDescription' | 'shopImage' | 'shopContent' | 'shopContentImage' | null
  }> => {
    setSubmitLoading(true)
    const f = ShopDescriptionContentsForm.getValues(`ShopDescriptionContents.${languageIndex}`)
    const shopId = f.ShopDescription.ShopId
    try {
      // shop_description
      if (f.ShopDescription.Id != '') {
        const res = await ShopDescriptionAPI.UpdateShopDescription(f.ShopDescription)
        if (res.status != 200) {
          const message = GetMessage(
            res.status,
            res.data?.result_code || SERVER_STATUS.SEVERERROR,
            res.data?.message || ''
          )

          return { message, trace: 'shopDescription' }
        }
      } else {
        const res = await ShopDescriptionAPI.CreateShopDescription(f.ShopDescription)
        if (res.status != 200) {
          const message = GetMessage(
            res.status,
            res.data?.result_code || SERVER_STATUS.SEVERERROR,
            res.data?.message || ''
          )

          return { message, trace: 'shopDescription' }
        }
      }

      // shop_image
      const resShopImage = await shopImageSubmit(shopId, f, languageIndex)
      if (resShopImage?.message != '') {
        return resShopImage
      }
      const sis = ShopDescriptionContentsForm.getValues(`ShopDescriptionContents`)
      for (let i = 0; i < sis.length; i++) {
        if (i == languageIndex) {
          continue
        }

        const si = sis[i]

        const resShopImage = await shopImageSubmit(shopId, si, i)
        if (resShopImage?.message != '') {
          return resShopImage
        }
      }

      // ShopContent
      const resShopContent = await ShopContentAPI.DeleteShopContentShopIdLanguageCd(shopId, f.LanguageCd)
      if (resShopContent.status != 200) {
        const message = GetMessage(
          resShopContent.status,
          resShopContent.data?.result_code || SERVER_STATUS.SEVERERROR,
          resShopContent.data?.message || ''
        )

        return { message, trace: 'shopContent' }
      }

      for (let i = 0; i < f.ShopContents.length; i++) {
        for (let j = 0; j < f.ShopContents.length; j++) {
          const resShopContent = await ShopContentAPI.CreateShopContent(f.ShopContents[j])
          if (resShopContent.status != 200) {
            const message = GetMessage(
              resShopContent.status,
              resShopContent.data?.result_code || SERVER_STATUS.SEVERERROR,
              resShopContent.data?.message || ''
            )

            return { message, trace: 'shopContent' }
          }

          // shop_content_image
          if (f.ShopContents[j].Id != '') {
            const resShopContentImageDel = await ShopContentImageAPI.DeleteShopContentImageContentIdLanguageCd(
              f.ShopContents[j].Id,
              f.ShopContents[j].LanguageCd
            )
            if (resShopContentImageDel.status != 200) {
              const message = GetMessage(
                resShopContentImageDel.status,
                resShopContentImageDel.data?.result_code || SERVER_STATUS.SEVERERROR,
                resShopContentImageDel.data?.message || ''
              )

              return { message, trace: 'shopContent' }
            }
          }

          if (resShopContent.data.shop_content_proofreading) {
            const shopContent = {
              Id: resShopContent.data.shop_content_proofreading.id,
              ShopId: f.ShopContents[j].ShopId,
              ContentCategory: f.ShopContents[j].ContentCategory,
              LanguageCd: f.ShopContents[j].LanguageCd,
              ContentTitle: f.ShopContents[j].ContentTitle,
              ContentBody: f.ShopContents[j].ContentBody,
              SortOrder: f.ShopContents[j].SortOrder,
              ShopContentImages: f.ShopContents[j].ShopContentImages
            } as ShopContentType

            // shop_content_image
            const resShopContentImage = await submitShopContentImage(shopContent)
            if (resShopContentImage.message != '') {
              return resShopContentImage
            }
          }
        }
      }

      return { message: '', trace: null }
    } finally {
      setSubmitLoading(false)
      CheckHasError()
    }
  }

  const shopImageSubmit = async (
    shopId: string,
    f: ShopDescriptionContentsType,
    languageIndex: number
  ): Promise<{
    message: string
    trace: 'shopDescription' | 'shopImage' | 'shopContent' | 'shopContentImage' | null
  }> => {
    // shop_image
    for (let i = 0; i < f.ShopImages.length; i++) {
      ShopDescriptionContentsForm.setValue(
        `ShopDescriptionContents.${languageIndex}.ShopImages.${i}.ShopImageDescription`,
        f.ShopDescription.ShopName
      )
      ShopDescriptionContentsForm.setValue(
        `ShopDescriptionContents.${languageIndex}.ShopImages.${i}.ShopImageAlt`,
        f.ShopDescription.ShopName
      )
    }

    const resShopImage = await ShopImageAPI.DeleteShopImageShopIdLanguageCd(shopId, f.LanguageCd)
    if (resShopImage.status != 200) {
      const message = GetMessage(
        resShopImage.status,
        resShopImage.data?.result_code || SERVER_STATUS.SEVERERROR,
        resShopImage.data?.message || ''
      )

      return { message, trace: 'shopImage' }
    }

    for (let i = 0; i < f.ShopImages.length; i++) {
      if (f.ShopImages[i].Id != '') {
        const res = await ShopImageAPI.CreateShopImage(f.ShopImages[i])
        if (res.status != 200) {
          const message = GetMessage(
            res.status,
            res.data?.result_code || SERVER_STATUS.SEVERERROR,
            res.data?.message || ''
          )

          return { message, trace: 'shopImage' }
        }
      } else {
        const res = await ShopImageAPI.UploadShopImage(f.ShopImages[i])
        if (res.status != 200) {
          const message = GetMessage(
            res.status,
            res.data?.result_code || SERVER_STATUS.SEVERERROR,
            res.data?.message || ''
          )

          return { message, trace: 'shopImage' }
        }
      }
    }

    return { message: '', trace: null }
  }

  const submitShopContentImage = async (
    shopContent: ShopContentType
  ): Promise<{
    message: string
    trace: 'shopDescription' | 'shopImage' | 'shopContent' | 'shopContentImage' | null
  }> => {
    for (let k = 0; k < shopContent.ShopContentImages.length; k++) {
      const shopContentImage = shopContent.ShopContentImages[k]
      shopContentImage.ShopContentId = shopContent.Id
      if (shopContentImage.Id != '') {
        const res = await ShopContentImageAPI.CreateShopContentImage(shopContentImage)
        if (res.status != 200) {
          const message = GetMessage(
            res.status,
            res.data?.result_code || SERVER_STATUS.SEVERERROR,
            res.data?.message || ''
          )

          return { message, trace: 'shopContent' }
        }
      } else {
        const res = await ShopContentImageAPI.UploadShopContentImage(shopContentImage)
        if (res.status != 200) {
          const message = GetMessage(
            res.status,
            res.data?.result_code || SERVER_STATUS.SEVERERROR,
            res.data?.message || ''
          )

          return { message, trace: 'shopContent' }
        }
      }
    }

    return { message: '', trace: null }
  }

  return {
    ShopDescriptionContentsForm,
    ShopDescriptionContentsFieldArray,
    ControlledFields,
    Init,
    Submit,
    languageCdHasError,
    loading,
    submitLoading,
    setSubmitLoading,
    languageCds,
    AddShopImage,
    SetAddShopImage,
    RemoveShopImage,
    SetRemoveShopImage,
    AddShopContentImage,
    SetAddShopContentImage,
    RemoveShoContentpImage,
    SetRemoveShopContentImage,
    ClearAddShopImage,
    ClearRemoveShopImage,
    ClearAddShopContentImage,
    ClearRemoveShopContentImage,
    Translate
  }
}

export default ShopDescriptionContentService
