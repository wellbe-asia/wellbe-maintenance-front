export type FileExtendsPreview = File & {
  preview: string
  path: string
}

export type ShopImageType = {
  Id: string
  LanguageCd: string
  ShopId: string
  ImageCategory: string
  ShopImagePath: string
  ShopImage: FileExtendsPreview | undefined
  ShopImageAlt: string
  ShopImageDescription: string
  ShopImageCategories: string[]
}

export type ShopImageResponseType = {
  result_code: number
  message: string
  shop_image_proofreadings?: ShopImageResponseGetType[]
}

export type ShopImageResponseGetType = {
  id: string
  language_cd: number
  shop_id: string
  image_category: string
  shop_image_path: string
  shop_image_alt: string
  shop_image_description: string
  shop_image_category_proofreadings: ShopImageCategoryResponseGetType[]
}

export type ShopImageCategoryResponseGetType = {
  shop_image_filter_category_cd: number
}
