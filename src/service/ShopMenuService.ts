import { useEffect, useState } from 'react'
import { useForm, useFieldArray } from 'react-hook-form'

// ** Config
import { useRouter } from 'next/router'
import { getLanguageCdWithValue } from '@/configs/locales/locales'

// ** API
import ShopMenuAPI from '@/@core/api/factoryShopMenu'
import { ShopMenuType, ShopMenuResponseType, ShopMenuNameType } from '@/@core/api/type/shopMenu'
import { v4 as uuidv4 } from 'uuid'

// ** hook
import { SERVER_STATUS } from '@/@core/utils/constant'
import { useLocale } from '@/@core/hooks/useLocal'

// ** service
import CurrencyCdService from './CurrencyCdService'
import ShopMenuLabelAPI from '@/@core/api/factoryShopMenuLabel'
import { LanguageType } from '@/@core/api/type/cLanguage'
import CLanguageAPI from '@/@core/api/factoryCLanguage'
import ShopRecommendLabelAPI from '@/@core/api/factoryShopRecommendLabel'

export type ShopMenuFormType = {
  ShopMenus: ShopMenuType[]
}

const ShopMenuService = () => {
  const { GetMessage, t } = useLocale()

  const [loading, setLoading] = useState(false)
  const [submitLoading, setSubmitLoading] = useState(false)
  const [languageCds, setLanguageCds] = useState([] as LanguageType[])
  const [languageCdHasError, setLanguageCdHasError] = useState([] as boolean[])

  const Form = useForm<ShopMenuFormType>({
    mode: 'onChange',
    defaultValues: { ShopMenus: [] }
  })

  const { control } = Form

  const FieldArray = useFieldArray({ name: 'ShopMenus', control })

  const watchFieldArray = Form.watch('ShopMenus')
  const ControlledFields = FieldArray.fields.map((field, index) => {
    return {
      ...field,
      ...watchFieldArray[index]
    }
  })

  useEffect(() => {
    CheckHasError()
  }, [watchFieldArray])

  const CheckHasError = () => {
    const varHasErrors = [] as boolean[]
    for (let i = 0; i < languageCds.length; i++) {
      varHasErrors.push(false)
    }

    const f = Form.getValues('ShopMenus')
    for (const v of f) {
      for (let i = 0; i < varHasErrors.length; i++) {
        if (
          (v.ShopMenuNames.length > i && varHasErrors[i] == true) ||
          !v.ShopMenuNames[i].MenuName ||
          v.ShopMenuNames[i].MenuName == '' ||
          !v.ShopMenuNames[i].MenuDescription ||
          v.ShopMenuNames[i].MenuDescription == ''
        ) {
          varHasErrors[i] = true
        } else {
          varHasErrors[i] = false
        }
      }
    }
    setLanguageCdHasError(varHasErrors)
  }

  const { append } = FieldArray
  const { locale } = useRouter()

  const { currencyCd, FetchCurrencyCd } = CurrencyCdService()

  useEffect(() => {
    if (locale) {
      const language = getLanguageCdWithValue(locale)
      FetchCurrencyCd(language)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [locale])

  const Init = async (shopId: string) => {
    setLoading(true)
    Form.reset()
    setLanguageCds([])

    try {
      const resLanguages = await CLanguageAPI.GetCLanguage()
      if (resLanguages && resLanguages.data && resLanguages.data.c_languages) {
        for (let i = 0; i < resLanguages.data.c_languages.length; i++) {
          const v = resLanguages.data.c_languages[i]
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
      }
      const res = await ShopMenuAPI.GetWithShopId(shopId)
      const data = res.data as ShopMenuResponseType
      if (data?.shop_menu_proofreadings && data.shop_menu_proofreadings.length > 0) {
        for (let i = 0; i < data.shop_menu_proofreadings.length; i++) {
          const v = data.shop_menu_proofreadings[i]
          const shopMenuLabelCds = [] as string[]
          const resShopMenuLabel = await ShopMenuLabelAPI.GetWithShopMenuId(v.ShopMenuProofreading.id)
          if (
            resShopMenuLabel.data &&
            resShopMenuLabel.data.shop_menu_label_proofreadings &&
            resShopMenuLabel.data.shop_menu_label_proofreadings.length > 0
          ) {
            for (let i = 0; i < resShopMenuLabel.data.shop_menu_label_proofreadings.length; i++) {
              const v = resShopMenuLabel.data.shop_menu_label_proofreadings[i]
              shopMenuLabelCds.push(String(v.menu_label_cd))
            }
          }
          const shoRecommendLabelCds = [] as string[]
          const resShopRecommendLabel = await ShopRecommendLabelAPI.GetWithShopRecommendId(v.ShopMenuProofreading.id)
          if (
            resShopRecommendLabel.data &&
            resShopRecommendLabel.data.shop_recommend_label_proofreadings &&
            resShopRecommendLabel.data.shop_recommend_label_proofreadings.length > 0
          ) {
            for (let i = 0; i < resShopRecommendLabel.data.shop_recommend_label_proofreadings.length; i++) {
              const v = resShopRecommendLabel.data.shop_recommend_label_proofreadings[i]
              shoRecommendLabelCds.push(String(v.recommend_label_cd))
            }
          }

          const shopMenuNames = [] as ShopMenuNameType[]
          if (resLanguages.data?.c_languages) {
            for (let i = 0; i < resLanguages.data.c_languages.length; i++) {
              const d = resLanguages.data.c_languages[i]
              if (v.ShopMenuNameProofreadings && v.ShopMenuNameProofreadings.length > 0) {
                const shopMenuName = v.ShopMenuNameProofreadings.find(
                  varMenuName => varMenuName.language_cd == d.language_cd
                )
                if (shopMenuName && shopMenuName.menu_name && shopMenuName.menu_name != '') {
                  shopMenuNames.push({
                    LanguageCd: String(shopMenuName.language_cd),
                    ShopMenuId: shopMenuName.shop_menu_id,
                    MenuName: shopMenuName.menu_name,
                    MenuDescription: shopMenuName.menu_description
                  })
                  continue
                }
              }

              shopMenuNames.push({
                LanguageCd: String(resLanguages.data.c_languages[i].language_cd),
                MenuDescription: '',
                MenuName: '',
                ShopMenuId: ''
              })
            }
          }

          append({
            Id: v.ShopMenuProofreading.id,
            ShopId: v.ShopMenuProofreading.shop_id,
            TreatmentTime: String(v.ShopMenuProofreading.treatment_time),
            RequiredTime: String(v.ShopMenuProofreading.required_time),
            IsCoupon: v.ShopMenuProofreading.is_coupon,
            Amount: String(v.ShopMenuProofreading.amount),
            AmountBeforeDiscount: String(v.ShopMenuProofreading.amount_before_discount),
            CurrencyCdIso: v.basical_currency_cd_iso,
            DeleteFlg: v.ShopMenuProofreading.delete_flg,
            CanFemale: v.ShopMenuProofreading.can_female,
            CanMale: v.ShopMenuProofreading.can_male,
            SortOrder: String(v.ShopMenuProofreading.sort_order),
            ShopMenuLabelCds: shopMenuLabelCds,
            ShopRecommendLabelCds: shoRecommendLabelCds,
            ShopMenuNames: shopMenuNames
          })
        }
      } else {
        const shopMenuNames = [] as ShopMenuNameType[]
        if (resLanguages.data?.c_languages) {
          for (let i = 0; i < resLanguages.data.c_languages.length; i++) {
            shopMenuNames.push({
              LanguageCd: String(resLanguages.data.c_languages[i].language_cd),
              MenuDescription: '',
              MenuName: '',
              ShopMenuId: ''
            })
          }
        }
        append({
          Id: '',
          ShopId: shopId,
          TreatmentTime: '',
          RequiredTime: '',
          IsCoupon: false,
          Amount: '',
          AmountBeforeDiscount: '',
          CurrencyCdIso: '',
          DeleteFlg: false,
          CanFemale: true,
          CanMale: true,
          SortOrder: uuidv4(),
          ShopMenuLabelCds: [],
          ShopRecommendLabelCds: [],
          ShopMenuNames: shopMenuNames
        })
      }
    } finally {
      setLoading(false)
    }
  }

  const Translate = async (shopId: string, languageCdIndex: number): Promise<string> => {
    try {
      if (languageCds.length > languageCdIndex) {
        setSubmitLoading(true)
        const res = await ShopMenuAPI.TranslateShopMenu(shopId || '', languageCds[languageCdIndex].LanguageCd)
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

  const Submit = async (languageCdIndex: number): Promise<string> => {
    setSubmitLoading(true)
    try {
      const f = Form.getValues(`ShopMenus`)
      let order = 1
      if (f && f.length > 0) {
        for (const v of f) {
          v.SortOrder = String(order)
          v.Amount = v.Amount.replace(/,/g, '')
          if (v.Id == '') {
            if (v.Amount || v.Amount != '') {
              if (v.ShopMenuNames.length > languageCdIndex) {
                const cv = JSON.parse(JSON.stringify(v))
                cv.ShopMenuNames = [v.ShopMenuNames[languageCdIndex]]
                const res = await ShopMenuAPI.CreateShopMenu(cv)
                if (res.status !== 200) {
                  const message = GetMessage(
                    res.status,
                    res.data?.result_code || SERVER_STATUS.SEVERERROR,
                    res.data?.message || ''
                  )

                  return message
                }
              }
            }
          } else if (v.DeleteFlg == false) {
            if (v.ShopMenuNames.length > languageCdIndex) {
              const cv = JSON.parse(JSON.stringify(v))
              cv.ShopMenuNames = [v.ShopMenuNames[languageCdIndex]]
              const res = await ShopMenuAPI.UpdateShopMenu(cv)
              if (res.status !== 200) {
                const message = GetMessage(
                  res.status,
                  res.data?.result_code || SERVER_STATUS.SEVERERROR,
                  res.data?.message || ''
                )

                return message
              }
            }
          } else {
            const res = await ShopMenuAPI.DeleteShopMenu(v.Id)
            if (res.status !== 200) {
              const message = GetMessage(
                res.status,
                res.data?.result_code || SERVER_STATUS.SEVERERROR,
                res.data?.message || ''
              )

              return message
            }
          }
          order = order + 1
        }
      }

      return ''
    } finally {
      setSubmitLoading(false)
      CheckHasError()
    }
  }

  const Append = (shopId: string) => {
    const shopMenuNames = [] as ShopMenuNameType[]
    for (let i = 0; i < languageCds.length; i++) {
      shopMenuNames.push({
        LanguageCd: String(languageCds[i].LanguageCd),
        MenuDescription: '',
        MenuName: '',
        ShopMenuId: ''
      })
    }
    append({
      Id: '',
      ShopId: shopId,
      TreatmentTime: '',
      RequiredTime: '',
      IsCoupon: false,
      Amount: '',
      AmountBeforeDiscount: '',
      CurrencyCdIso: '',
      DeleteFlg: false,
      CanFemale: true,
      CanMale: true,
      SortOrder: uuidv4(),
      ShopMenuLabelCds: [],
      ShopRecommendLabelCds: [],
      ShopMenuNames: shopMenuNames
    })
  }

  const Remove = (index: number) => {
    const f = Form.getValues(`ShopMenus.${index}`)
    if (f.Id == '') {
      FieldArray.remove(index)
    } else {
      Form.setValue(`ShopMenus.${index}.DeleteFlg`, true)
    }
  }

  return {
    Form,
    fields: ControlledFields,
    FieldArray,
    loading,
    submitLoading,
    languageCds,
    languageCdHasError,
    Init,
    Submit,
    Append,
    Remove,
    currencyCd,
    Translate
  }
}

export default ShopMenuService
