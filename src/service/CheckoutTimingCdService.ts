import { useState } from 'react'
import CCheckoutTimingAPI from '@/@core/api/factoryCChecoutTiming'
import { CheckoutTimingType } from '@/@core/api/type/cCheckoutTiming'

const CheckoutTimingCdService = () => {
  const [checkoutTiming, setCheckoutTimingCd] = useState([] as CheckoutTimingType[])
  const FetchCheckoutTimingCd = async (language: string) => {
    const { data } = await CCheckoutTimingAPI.GetCCheckoutTiming(Number(language))
    if (data?.c_checkout_timings) {
      setCheckoutTimingCd(data.c_checkout_timings)
    }
  }

  return { checkoutTiming, setCheckoutTimingCd, FetchCheckoutTimingCd }
}

export default CheckoutTimingCdService
