export type AreaType = {
  language_cd: number
  area_cd: number
  state_cd: number
  area_name: string
  search_area_name_seo: string
  west_longitude: number
  east_longitude: number
  north_latitude: number
  south_latitude: number
  summary_area_flg: boolean
  botpress_kb_id: string
}

export type AreaReaponseType = {
  result_code: number
  message: string
  c_areas?: AreaType[]
}
