export type LanguageType = {
  LanguageCd: string
  LanguageCharCd: string
  LanguageName: string
  SortNumber: string
}

export type LanguageTypeResponseType = {
  result_code: number
  message: string
  c_language?: LanguageResponseGetType
  c_languages?: LanguageResponseGetType[]
}
export type LanguageResponseGetType = {
  language_cd: number
  language_char_cd: string
  language_name: string
  sort_number: number
}
