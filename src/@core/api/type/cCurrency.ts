export type CurrencyType = {
  currency_cd: number
  language_cd: number
  currency_name: string
  currency_cd_iso: string
}

export type CurrencyTypeResponseType = {
  result_code: number
  message: string
  c_currency?: CurrencyType
  c_currencys?: CurrencyType[]
}
