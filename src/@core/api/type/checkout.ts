export type CheckoutResponseType = {
  result_code: number
  message: string
  checkouts?: CheckoutResponseGetType[]
}

export type CheckoutResponseGetType = {
  id: string
  checkout_status_cd: number
  checkout_amount: number
  admin_fee_amount: number
  refund_amount: number
  currency_cd: number
  currency_cd_iso: string
  contract_execute_date: string
  checkout_actual_datetime: string
  checkout_status_name: string
  booking_id: string
  booking_no: string
  shop_id: string
  shop_no: string
  shop_name: string
  account_name: string
  menu: string
  checkout_items: CheckoutItemResponseGetType[]
}

export type CheckoutItemResponseGetType = {
  id: string
  checkout_id: string
  checkout_content: string
  amount: number
  currency_cd: number
  currency_cd_iso: string
}
