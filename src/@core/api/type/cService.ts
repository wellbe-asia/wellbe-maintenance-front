export type ServiceType = {
  service_cd: number
  language_cd: number
  service_name: string
}

export type ServiceTypeResponseType = {
  result_code: number
  message: string
  c_service?: ServiceType
  c_services?: ServiceType[]
}
