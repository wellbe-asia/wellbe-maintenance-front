export type ShopPaymentMethodType = {
  Id: string
  ShopId: string
  PaymentMethodCd: string
}

export type ShopPaymentMethodResponseType = {
  result_code: number
  message: string
  shop_payment_method_proofreading?: ShopPaymentMethodResponseGetType
  shop_payment_method_proofreadings?: ShopPaymentMethodResponseGetType[]
}

export type ShopPaymentMethodResponseGetType = {
  id: string
  shop_id: string
  payment_method_cd: number
}
