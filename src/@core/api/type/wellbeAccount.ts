export type AccountResponseType = {
  result_code: number
  message: string
  account?: AccountResponseGetType
  accounts?: AccountResponseGetType[]
}

export type AccountResponseGetType = {
  id: string
  account_no: string
  account_status_cd: number
  account_status_name: number
  family_name: string
  given_name: string
  email_address: string
  birth_date: string
  gender_cd: number
  gender_name: string
  locale_country_cd: number
  country_name: string
  tell_country_no_cd: number
  country_no: string
  tell_no: string
  basical_language_cd: number
  basical_currency_cd: number
  international_tell_no: string
}
