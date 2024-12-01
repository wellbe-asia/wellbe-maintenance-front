export type ShopScrapingQueResponseType = {
  result_code: number
  message: string
  ques?: ShopScrapingQueResponseGetType[]
}

export type ShopScrapingQueResponseGetType = {
  id: string
  shop_name: string
  shop_url: string
  shop_url_domain: string
  shop_recognize_id: string
  last_scraping_date: string
}
