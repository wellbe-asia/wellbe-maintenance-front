export type AccountGroupType = {
  account_group_cd: number
  language_cd: number
  account_group_name: string
}

export type AccountGroupTypeResponseType = {
  result_code: number
  message: string
  c_account_groups?: AccountGroupType[]
}
