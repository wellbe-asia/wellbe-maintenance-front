import { useState } from 'react'
import CurrencyForPaymentAPI from '@/@core/api/factoryCurrencyForPayment'
import { CurrencyType } from '@/@core/api/type/cCurrency'

const CurrencyForPaymentService = () => {
  const [currencyCd, setCurrencyCd] = useState([] as CurrencyType[])
  const FetchCurrencyCd = async (language: string) => {
    const { data } = await CurrencyForPaymentAPI.GetCurrencyForPayment(Number(language))
    if (data?.c_currencys) {
      setCurrencyCd(data.c_currencys)
    }
  }

  return { currencyCd, setCurrencyCd, FetchCurrencyCd }
}

export default CurrencyForPaymentService
