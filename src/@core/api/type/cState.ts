export type StateType = {
  state_cd: number
  language_cd: number
  state_name: string
  state_cd_iso: string
}

export type StateTypeResponseType = {
  result_code: number
  message: string
  c_state?: StateType
  c_states?: StateType[]
}
