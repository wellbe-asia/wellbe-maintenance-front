export type InvoiceItemResponseType = {
  result_code: number
  message: string
  invoice_items?: InvoiceItemResponseGetType[]
}

export type InvoiceItemResponseGetType = {
  id: string
  invoice_id: string
  billing_id: string
  billing_date: string
  billing_amount: number
  billing_currency_cd: number
  billing_currency_cd_iso: string
  billing_content_cd: number
  booking_id: string
  booking_no: string
  invoice_content: string
  billing_memo: string
  billing_content_name: string
}
