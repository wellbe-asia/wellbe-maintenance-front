export type ShopScrapingKeywordQueResponseType = {
  result_code: number
  message: string
  ques?: ShopScrapingKeywordQueResponseGetType[]
}

export type ShopScrapingKeywordQueResponseGetType = {
  id: string
  keyword: string
  last_scraping_date: string
}
