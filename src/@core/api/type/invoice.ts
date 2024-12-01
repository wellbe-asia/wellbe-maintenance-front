export type InvoiceResponseType = {
  result_code: number
  message: string
  invoices?: InvoiceResponseGetType[]
}

export type InvoiceResponseGetType = {
  id: string
  billing_date: string
  billing_shop_id: string
  billing_amount: number
  billing_currency_cd: number
  billing_currency_cd_iso: string
  invoice_status_cd: number
  shop_no: string
  shop_name: string
  invoice_status_name: string
}
