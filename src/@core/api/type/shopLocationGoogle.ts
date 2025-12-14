export type ShopLocationGoogleType = {
  Id?: string
  ShopId: string
  PlaceId: string
}

export type ShopLocationGoogleResponseType = {
  result_code: number
  message: string
  shop_location_googles?: ShopLocationGoogleResponseGetType[]
}

export type ShopLocationGoogleResponseGetType = {
  id: string
  language_cd: number
  shop_id: string
  place_name: string
  place_id: string
  formatted_address: string
  short_formatted_address: string
  address_postal_code: string
  address_country: string
  address_administrative_area1: string
  address_administrative_area2: string
  locality: string
  sublocality_level2: string
  sublocality_level3: string
  sublocality_level4: string
  premise: string
  latitude: string
  longitude: string
  google_map_uri: string
  website_uri: string
}
