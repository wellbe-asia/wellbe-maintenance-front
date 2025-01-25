export type FileExtendsPreview = File & {
  preview: string
}

export type ShopContentImageType = {
  Id: string
  LanguageCd: string
  ShopContentId: string
  ImageCategory: string
  ShopImagePath: string
  ShopImage: FileExtendsPreview | undefined
  ShopImageAlt: string
  ShopImageDescription: string
}

export type ShopContentImageRequestType = {
  language_cd: string
  shop_content_id: string
  image_category: string
  shop_image_path: string
  shop_image_alt: string
  shop_image_description: string
}

export type ShopContentImageResponseType = {
  result_code: number
  message: string
  shop_content_image_proofreadings?: ShopContentImageResponseGetType[]
}

export type ShopContentImageResponseGetType = {
  id: string
  language_cd: number
  shop_content_id: string
  image_category: string
  shop_image_path: string
  shop_image_alt: string
  shop_image_description: string
}
