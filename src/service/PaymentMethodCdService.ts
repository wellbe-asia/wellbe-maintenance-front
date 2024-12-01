import { useState } from 'react'
import CPaymentMethodAPI from '@/@core/api/factoryCPaymentMethod'
import { PaymentMethodType } from '@/@core/api/type/cPaymentMethod'

const PaymentMethodCdService = () => {
  const [paymentMethodCd, setPaymentMethodCd] = useState([] as PaymentMethodType[])
  const FetchPaymentMethodCd = async (language: string) => {
    const { data } = await CPaymentMethodAPI.GetCPaymentMethod(Number(language))
    if (data?.c_payment_methods) {
      setPaymentMethodCd(data.c_payment_methods)
    }
  }

  return { paymentMethodCd, setPaymentMethodCd, FetchPaymentMethodCd }
}

export default PaymentMethodCdService
