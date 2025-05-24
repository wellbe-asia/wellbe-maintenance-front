import { useFieldArray, useForm } from 'react-hook-form'

// ** API
import ShopDescriptionAPI from '@/@core/api/factoryShopDescription'
import { ShopDescriptionType } from '@/@core/api/type/shopDescription'
import { ShopContentType } from '@/@core/api/type/shopContent'
import { ShopImageType } from '@/@core/api/type/shopImage'

// ** hook
import { DEFAULT_SORT_ORDER, SERVER_STATUS, SHOP_CONTENT_CATEGORY } from '@/@core/utils/constant'
import { useState } from 'react'
import ShopContentAPI from '@/@core/api/factoryShopContent'
import ShopImageAPI from '@/@core/api/factoryShopImage'
import ShopContentImageAPI from '@/@core/api/factoryShopContentImage'
import { ShopContentImageType } from '@/@core/api/type/shopContentImage'
import { useLocale } from '@/@core/hooks/useLocal'
import { LanguageType } from '@/@core/api/type/cLanguage'
import { v4 as uuidv4 } from 'uuid'

export type ShopDescriptionContentFormType = {
  ShopDescriptionContent: ShopDescriptionContentsType
}

export type ShopDescriptionContentsType = {
  LanguageCd: string
  ShopImages: ShopImageType[]
  ShopDescription: ShopDescriptionType
  ShopContents: ShopContentType
  ShopContentImages: ShopContentImageType[]
}

const ShopDescriptionContentService = () => {
  const [loading, setLoading] = useState(false)
  const [submitLoading, setSubmitLoading] = useState(false)
  const { GetMessage } = useLocale()
  const [languageCds, setLanguageCds] = useState([] as LanguageType[])

  const ShopDescriptionContentsForm = useForm<ShopDescriptionContentFormType>({
    mode: 'onChange',
    defaultValues: {
      ShopDescriptionContent: {
        ShopImages: [],
        ShopContentImages: []
      }
    }
  })

  const shopImageFieldArray = useFieldArray({
    name: 'ShopDescriptionContent.ShopImages',
    control: ShopDescriptionContentsForm.control
  })
  const shopImagesWatchFieldArray = ShopDescriptionContentsForm.watch('ShopDescriptionContent.ShopImages')
  const shopImageFields = shopImagesWatchFieldArray.map((field, index) => {
    return {
      ...field,
      ...shopImagesWatchFieldArray[index]
    }
  })

  const shopContentImageFieldArray = useFieldArray({
    name: 'ShopDescriptionContent.ShopContentImages',
    control: ShopDescriptionContentsForm.control
  })
  const shopContentImagesWatchFieldArray = ShopDescriptionContentsForm.watch('ShopDescriptionContent.ShopContentImages')
  const shopContentImageFields = shopContentImagesWatchFieldArray.map((field, index) => {
    return {
      ...field,
      ...shopContentImagesWatchFieldArray[index]
    }
  })

  const Init = async (shopId: string, languageCd: string) => {
    setLoading(true)
    ShopDescriptionContentsForm.reset()
    setLanguageCds([])

    try {
      await GetForm(shopId, languageCd)
    } finally {
      setLoading(false)
    }
  }

  const GetForm = async (shopId: string, languageCd: string) => {
    const sdResponse = await ShopDescriptionAPI.GetWithShopId(shopId, languageCd)
    const scResponse = await ShopContentAPI.GetWithShopId(shopId, languageCd)
    const siResponse = await ShopImageAPI.GetWithShopId(shopId, languageCd)

    let shopDescription = {} as ShopDescriptionType
    let shopContent = {} as ShopContentType

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
        LanguageCd: languageCd,
        ShopName: ''
      }
    }

    if (
      scResponse &&
      scResponse.status == 200 &&
      scResponse.data &&
      scResponse.data.shop_content_proofreadings &&
      scResponse.data.shop_content_proofreadings.length > 0
    ) {
      const v = scResponse.data.shop_content_proofreadings[0]
      const sciResponse = await ShopContentImageAPI.GetShopContentImage(v.id, languageCd)
      if (
        sciResponse &&
        sciResponse.status == 200 &&
        sciResponse.data &&
        sciResponse.data.shop_content_image_proofreadings &&
        sciResponse.data.shop_content_image_proofreadings.length > 0
      ) {
        for (let k = 0; k < sciResponse.data.shop_content_image_proofreadings.length; k++) {
          const w = sciResponse.data.shop_content_image_proofreadings[k]
          shopContentImageFieldArray.append({
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
      shopContent = {
        Id: v.id,
        ShopId: v.shop_id,
        ContentCategory: v.content_category,
        LanguageCd: String(v.language_cd),
        ContentTitle: v.content_title,
        ContentBody: v.content_body,
        SortOrder: String(v.sort_order)
      }
    } else {
      shopContent = {
        Id: '',
        ShopId: shopId,
        ContentCategory: SHOP_CONTENT_CATEGORY.MAIN_DESCRIPTION,
        LanguageCd: languageCd,
        ContentTitle: '',
        ContentBody: '',
        SortOrder: DEFAULT_SORT_ORDER.FIRST
      }
    }

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
        shopImageFieldArray.append({
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

    ShopDescriptionContentsForm.setValue('ShopDescriptionContent.LanguageCd', languageCd)
    ShopDescriptionContentsForm.setValue('ShopDescriptionContent.ShopDescription', shopDescription)
    ShopDescriptionContentsForm.setValue('ShopDescriptionContent.ShopContents', shopContent)
  }

  const Translate = async (shopId: string, languageCd: string): Promise<string> => {
    try {
      setSubmitLoading(true)
      const res = await ShopDescriptionAPI.TranslateShopDescription(shopId, languageCd)
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
    trace: 'shopDescription' | 'shopImage' | 'shopContent' | 'shopContentImage' | null
  }> => {
    setSubmitLoading(true)
    const f = ShopDescriptionContentsForm.getValues(`ShopDescriptionContent`)
    const shopId = ShopDescriptionContentsForm.getValues(`ShopDescriptionContent.ShopContents.ShopId`)
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
      const resShopImage = await shopImageSubmit(shopId, f)
      if (resShopImage?.message != '') {
        return resShopImage
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
      const resCreateShopContent = await ShopContentAPI.CreateShopContent(f.ShopContents)
      if (resShopContent.status != 200) {
        const message = GetMessage(
          resCreateShopContent.status,
          resCreateShopContent.data?.result_code || SERVER_STATUS.SEVERERROR,
          resCreateShopContent.data?.message || ''
        )

        return { message, trace: 'shopContent' }
      }

      const shopContentImages = f.ShopContentImages
      shopContentImages.map(v => {
        v.ShopContentId = resCreateShopContent.data.shop_content_proofreading?.id || ''
      })

      return { message: '', trace: null }
    } finally {
      setSubmitLoading(false)
    }
  }

  const shopImageSubmit = async (
    shopId: string,
    f: ShopDescriptionContentsType
  ): Promise<{
    message: string
    trace: 'shopDescription' | 'shopImage' | 'shopContent' | 'shopContentImage' | null
  }> => {
    // shop_image
    for (let i = 0; i < f.ShopImages.length; i++) {
      ShopDescriptionContentsForm.setValue(
        `ShopDescriptionContent.ShopImages.${i}.ShopImageDescription`,
        f.ShopDescription.ShopName
      )
      ShopDescriptionContentsForm.setValue(
        `ShopDescriptionContent.ShopImages.${i}.ShopImageAlt`,
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

    const uploadShopImages = [] as ShopImageType[]
    const createShopImages = [] as ShopImageType[]
    for (const d of f.ShopImages) {
      if (d.ShopImagePath) {
        createShopImages.push(d)
      } else {
        uploadShopImages.push(d)
      }
    }

    if (createShopImages.length > 0) {
      const res = await ShopImageAPI.BulkCreateShopImage(createShopImages)
      if (res.status != 200) {
        const message = GetMessage(
          res.status,
          res.data?.result_code || SERVER_STATUS.SEVERERROR,
          res.data?.message || ''
        )

        return { message, trace: 'shopImage' }
      }
    }

    if (uploadShopImages.length > 0) {
      const res = await ShopImageAPI.UploadShopImage(uploadShopImages)
      if (res.status != 200) {
        const message = GetMessage(
          res.status,
          res.data?.result_code || SERVER_STATUS.SEVERERROR,
          res.data?.message || ''
        )

        return { message, trace: 'shopImage' }
      }
    }

    return { message: '', trace: null }
  }

  const AddShopImage = (image: ShopImageType) => {
    image.Id = uuidv4()
    shopImageFieldArray.append(image)
  }

  const RemoveShopImage = (index: number) => {
    shopImageFieldArray.remove(index)
  }

  const AddShopContentImage = (image: ShopContentImageType) => {
    image.Id = uuidv4()
    shopContentImageFieldArray.append(image)
  }

  const RemoveShopContentImage = (index: number) => {
    shopContentImageFieldArray.remove(index)
  }

  return {
    ShopDescriptionContentsForm,
    Init,
    Submit,
    loading,
    setLoading,
    submitLoading,
    setSubmitLoading,
    languageCds,
    Translate,
    shopImageFields,
    shopContentImageFields,
    AddShopImage,
    RemoveShopImage,
    AddShopContentImage,
    RemoveShopContentImage
  }
}

export default ShopDescriptionContentService
