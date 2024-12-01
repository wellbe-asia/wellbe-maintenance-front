export type ShopImageFilterCategoryType = {
  shop_image_filter_category_cd: number
  language_cd: number
  shop_image_filter_category_name: string
}

export type ShopImageFilterCategoryResponseType = {
  result_code: number
  message: string
  c_shop_image_filter_category?: ShopImageFilterCategoryType
  c_shop_image_filter_categorys?: ShopImageFilterCategoryType[]
}
