import { useState } from 'react'
import MenuAmountLimiMasterAPI from '@/@core/api/factoryMenuAmountLimiMaster'
import { MenuAmountLimitMasterResponseGetType } from '@/@core/api/type/menuAmountLimiMaster'

const MenuAmountLimiMasterService = () => {
  const [MenuAmountLimiMaster, setMenuAmountLimiMaster] = useState([] as MenuAmountLimitMasterResponseGetType[])
  const FetchMenuAmountLimiMaster = async (currencyCd: string) => {
    const { data } = await MenuAmountLimiMasterAPI.getWithKey(currencyCd)
    if (data?.menu_amount_limit_masters) {
      setMenuAmountLimiMaster(data.menu_amount_limit_masters)
    }
  }

  return { MenuAmountLimiMaster, setMenuAmountLimiMaster, FetchMenuAmountLimiMaster }
}

export default MenuAmountLimiMasterService
