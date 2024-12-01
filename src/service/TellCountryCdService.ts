import { useState } from 'react'
import CTellCountryAPI from '@/@core/api/factoryCTellCountry'
import { TellCountryType } from '@/@core/api/type/cTellCountry'

const TellCountryCdService = () => {
  const [tellCountryCd, setTellCountryCd] = useState([] as TellCountryType[])
  const FetchTellCountryCd = async (language: string) => {
    const { data } = await CTellCountryAPI.GetCTellCountry(Number(language))
    if (data?.c_tell_countrys) {
      setTellCountryCd(data.c_tell_countrys)
    }
  }

  return { tellCountryCd, setTellCountryCd, FetchTellCountryCd }
}

export default TellCountryCdService
