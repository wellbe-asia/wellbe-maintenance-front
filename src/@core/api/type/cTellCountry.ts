export type TellCountryType = {
  tell_country_cd: number
  language_cd: number
  country_name: string
  country_no: string
}

export type TellCountryTypeResponseType = {
  result_code: number
  message: string
  c_tell_country?: TellCountryType
  c_tell_countrys?: TellCountryType[]
}
