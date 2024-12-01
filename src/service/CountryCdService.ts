import { useState } from 'react'
import CCountryAPI from '@/@core/api/factoryCCountry'
import { CountryType } from '@/@core/api/type/cCountry'

const CountryCdService = () => {
  const [countryCd, setCountryCd] = useState([] as CountryType[])
  const FetchCountryCd = async (language: string) => {
    const { data } = await CCountryAPI.GetCCountry(Number(language))
    if (data?.c_countrys) {
      setCountryCd(data.c_countrys)
    }
  }

  return { countryCd, setCountryCd, FetchCountryCd }
}

export default CountryCdService
