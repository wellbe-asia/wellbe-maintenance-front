export type CountryType = {
  country_cd: number
  language_cd: number
  country_name: string
  country_cd_iso: string
}

export type CountryTypeResponseType = {
  result_code: number
  message: string
  c_country?: CountryType
  c_countrys?: CountryType[]
}
