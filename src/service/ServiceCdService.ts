import { useState } from 'react'
import CServiceAPI from '@/@core/api/factoryCService'
import { ServiceType } from '@/@core/api/type/cService'

const ServiceCdService = () => {
  const [serviceCd, setServiceCd] = useState([] as ServiceType[])
  const FetchServiceCd = async (language: string) => {
    const { data } = await CServiceAPI.GetCService(Number(language))
    if (data?.c_services) {
      setServiceCd(data.c_services)
    }
  }

  return { serviceCd, setServiceCd, FetchServiceCd }
}

export default ServiceCdService
