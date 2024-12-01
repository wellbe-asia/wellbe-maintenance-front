export type ReviewResponseType = {
  result_code: number
  message: string
  review: ReviewHeader
  reviews: ReviewHeader[]
  count: number
}

export type ReviewHeader = {
  id: string
  booking_id: string
  review_status_cd: number
  shop_id: string
  account_id: string
  booking_date: string
  booking_time: string
  booking_datetime_utc: string
  limit_datetime: string
  review_datetime: string
  review_category_cd: number
  nickname: string
  gender_cd: number
  age_range_cd: number
  shop_name: string
  review_status_name: string
  review_category_name: string
  gender_name: string
  age_range_gender: string
  review_contents: ReviewContent[]
  review_menues: ReviewMenu[]
  shop_images: ReviewShopImage[]
}

export type ReviewContent = {
  id: string
  review_header_id: string
  review_content_cd: number
  review_content_name: string
  review_evaluation_value: number
  review_comment: string
}

export type ReviewMenu = {
  id: string
  review_header_id: string
  menu_id: string
  menu_name: string
  amount: number
  basical_currency_cd_iso: string
}

export type ReviewShopImage = {
  shop_image_path: string
  shop_image_alt: string
}
