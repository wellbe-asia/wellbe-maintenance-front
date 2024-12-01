import { useState } from 'react'

import { useForm, useFieldArray } from 'react-hook-form'
import { useEffect } from 'react'

// ** API
import CLanguageAPI from '@/@core/api/factoryCLanguage'
import { LanguageType, LanguageResponseGetType } from '@/@core/api/type/cLanguage'

export type LanguageFormType = {
  Languages: LanguageType[]
}

const LanguageCdService = () => {
  const [languageCd, setLanguageCd] = useState([] as LanguageType[])

  const FetchLanguageCd = async () => {
    const { data } = await CLanguageAPI.GetCLanguage()
    setLanguageCd([])
    if (data?.c_languages) {
      data.c_languages.map((v: LanguageResponseGetType) => {
        setLanguageCd(oldValue => [
          ...oldValue,
          {
            LanguageCd: String(v.language_cd),
            LanguageCharCd: v.language_char_cd,
            LanguageName: v.language_name,
            SortNumber: String(v.sort_number)
          }
        ])
      })
    }
  }

  const Form = useForm<LanguageFormType>({
    mode: 'onChange',
    defaultValues: { Languages: [] }
  })

  const { control, watch } = Form
  const FieldArray = useFieldArray({ name: 'Languages', control })
  const { fields, append } = FieldArray

  const watchFieldArray = watch('Languages')
  const watchLanguage = watch(`Languages.${0}.LanguageCd`)
  const ControlledFields = fields.map((field, index) => {
    return {
      ...field,
      ...watchFieldArray[index]
    }
  })

  useEffect(() => {
    FetchLanguageCd()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    languageCd.map(v => {
      if (watchLanguage == v.LanguageCd) {
        Form.setValue(`Languages.${0}.LanguageCharCd`, v.LanguageCharCd)
        Form.setValue(`Languages.${0}.LanguageName`, v.LanguageName)
        Form.setValue(`Languages.${0}.SortNumber`, v.SortNumber)
      }
    })

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [watchLanguage])

  const Init = async () => {
    AppendField()
  }

  const AppendField = () => {
    append({ LanguageCd: '', LanguageCharCd: '', LanguageName: '', SortNumber: '' })
  }

  return { languageCd, Form, FieldArray, ControlledFields, Init, AppendField }
}

export default LanguageCdService
