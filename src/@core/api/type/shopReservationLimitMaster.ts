export type ShopReservationLimitMasterType = {
  shopId: string
  limit: number
}

export type ShopReservationLimitMasterResponseType = {
  result_code: number
  message: string
  shop_reservation_limit_masters: ShopReservationLimitMasterResponseGetType[]
}

export type ShopReservationLimitMasterResponseGetType = {
  shop_id: string
  reservation_limit: string
}
