export type FileExtendsPreview = File & {
  preview: string
}

export type ShopCouponType = {
  id: string
  shop_id: string
  coupon_rate_100: string
  coupon_rate: string
  coupon_amount: string
  coupon_start_date: string
  coupon_end_date: string
  coupon_start_date_dt?: Date
  coupon_end_date_dt?: Date
  coupon_limit_amount: string
  coupon_limit_count: string
  coupon_code: string
  language_cd: string
  coupon_title: string
  coupon_description: string
  new_customer: boolean
  repeat_customer: boolean
  shopCouponImage?: ShopCouponImageType
  shop_coupon_menues: string[]
  shop_coupon_targets: ShopCouponTargetType[]
}

export type ShopCouponImageType = {
  ShopCouponId: string
  Image?: FileExtendsPreview | undefined
  ImagePath?: string
}

export type ShopCouponMenuType = {
  shop_menu_id: string
}

export type ShopCouponTargetType = {
  coupon_target_attr_cd: string
  coupon_target_attr_value: string
}

export type ShopCouponResponseType = {
  result_code: number
  message: string
  shop_coupon?: ShopCouponResponseGetType
  shop_coupons?: ShopCouponResponseGetType[]
}

export type ShopCouponResponseGetType = {
  id: string
  shop_id: string
  coupon_rate: number
  coupon_amount: number
  coupon_start_date: string
  coupon_end_date: string
  coupon_limit_amount: number
  coupon_limit_count: number
  coupon_code: string
  is_display: boolean
  shop_coupon_menus: ShopCouponMenuResponseGetType[]
  base_shop_coupon_name: ShopCouponNameResponseGetType
  shop_coupon_names: ShopCouponNameResponseGetType[]
  shop_coupon_targets: ShopCouponTargetResponseGetType[]
  shop_coupon_images: ShopCouponImageResponseGetType[]
}

export type ShopCouponMenuResponseGetType = {
  id: string
  shop_coupon_id: string
  shop_menu_id: string
  menu_name: string
  menu_description: string
  CouponTitle: string
  CouponDescription: string
}

export type ShopCouponNameResponseGetType = {
  id: string
  coupon_title: string
  coupon_description: string
}

export type ShopCouponTargetResponseGetType = {
  id: string
  coupon_target_attr_cd: number
  coupon_target_attr_value: string
  coupon_target_attr_name: string
}

export type ShopCouponImageResponseGetType = {
  id: string
  image_path: string
}
