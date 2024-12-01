export type PayoutItemResponseType = {
  result_code: number
  message: string
  payout_items?: PayoutItemResponseGetType[]
}

export type PayoutItemResponseGetType = {
  id: string
  payout_item_category_cd: number
  content: string
  checkout_id: string
  booking_no: string
  amount: number
  wellbe_fee_amount: number
  payout_item_currency_cd_iso: string
  booking_date: string
  cancel_datetime: string
  account_id: string
  account_name: string
  booking_menu: string
  booking_id: string
  booking_amount: number
  exchange_rate: number
  exchange_paire: string
}
