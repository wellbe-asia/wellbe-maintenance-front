export type PayoutResponseType = {
  result_code: number
  message: string
  payouts?: PayoutResponseGetType[]
}

export type PayoutResponseGetType = {
  id: string
  payout_date: string
  payout_closing_date: string
  payout_status_cd: number
  payout_status_name: string
  payout_shop_id: string
  payout_shop_name: string
  payout_amount: number
  payout_wellbe_fee_amount: number
  payout_paypal_fee_amount: number
  payout_actual_amount: number
  payout_currency_cd: number
  payout_currency_cd_iso: string
}
