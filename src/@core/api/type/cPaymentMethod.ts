export type PaymentMethodType = {
  payment_method_cd: number
  language_cd: number
  payment_name: string
}

export type PaymentMethodTypeResponseType = {
  result_code: number
  message: string
  c_payment_method?: PaymentMethodType
  c_payment_methods?: PaymentMethodType[]
}
