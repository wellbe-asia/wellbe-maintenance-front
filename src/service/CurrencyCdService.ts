import { useState } from 'react'
import CCurrencyAPI from '@/@core/api/factoryCCurrency'
import { CurrencyType } from '@/@core/api/type/cCurrency'

const CurrencyCdService = () => {
  const [currencyCd, setCurrencyCd] = useState([] as CurrencyType[])
  const FetchCurrencyCd = async (language: string) => {
    const { data } = await CCurrencyAPI.GetCCurrency(Number(language))
    if (data?.c_currencys) {
      setCurrencyCd(data.c_currencys)
    }
  }

  return { currencyCd, setCurrencyCd, FetchCurrencyCd }
}

export default CurrencyCdService
