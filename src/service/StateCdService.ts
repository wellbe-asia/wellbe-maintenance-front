import { useState } from 'react'
import CStateAPI from '@/@core/api/factoryCState'
import { StateType } from '@/@core/api/type/cState'

const StateCdService = () => {
  const [stateCd, setStateCd] = useState([] as StateType[])
  const FetchStateCd = async (language: string, countryCd: string) => {
    const { data } = await CStateAPI.GetCState(Number(language), Number(countryCd))
    if (data?.c_states) {
      setStateCd(data.c_states)
    }
  }

  return { stateCd, setStateCd, FetchStateCd }
}

export default StateCdService
