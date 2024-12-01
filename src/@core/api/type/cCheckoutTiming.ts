export type CheckoutTimingType = {
  checkout_timing_cd: number
  language_cd: number
  checkout_timing_name: string
}

export type CheckoutTimingResponseType = {
  result_code: number
  message: string
  c_checkout_timings?: CheckoutTimingType[]
}
