import { useState } from 'react'
import ShopTransitionAPI from '@/@core/api/factoryShopTransition'
import { ShopTransitionResponseGetType } from '@/@core/api/type/ShopTransition'

const ShopTransitionService = () => {
  const [shopTransition, setShopTransition] = useState([] as ShopTransitionResponseGetType[])
  const FetchShopTransition = async (startDate: string, endDate: string) => {
    const { data } = await ShopTransitionAPI.GetSessionsPerDay(startDate, endDate)
    if (data?.transitions) {
      setShopTransition(data.transitions)
    }
  }
  const FetchShopTransitionPerMonth = async (startDate: string, endDate: string) => {
    const { data } = await ShopTransitionAPI.GetSessionsPerMonth(startDate, endDate)
    if (data?.transitions) {
      setShopTransition(data.transitions)
    }
  }

  return { shopTransition, setShopTransition, FetchShopTransition, FetchShopTransitionPerMonth }
}

export default ShopTransitionService
