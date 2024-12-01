export type MenuAmountLimitMasterResponseType = {
  result_code: number
  message: string
  menu_amount_limit_masters?: MenuAmountLimitMasterResponseGetType[]
}

export type MenuAmountLimitMasterResponseGetType = {
  currency_cd: number
  min_amount: number
  max_amount: number
}
