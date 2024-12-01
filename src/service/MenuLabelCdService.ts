import { useState } from 'react'
import CMenuLabelAPI from '@/@core/api/factoryCMenuLabel'
import { MenuLabelType } from '@/@core/api/type/cMenuLabel'

const MenuLabelCdService = () => {
  const [menuLabelCd, setMenuLabelCd] = useState([] as MenuLabelType[])
  const FetchMenuLabelCd = async (language: string) => {
    const { data } = await CMenuLabelAPI.GetCMenuLabel(Number(language))
    if (data?.c_menu_labels) {
      setMenuLabelCd(data.c_menu_labels)
    }
  }

  return { menuLabelCd, setMenuLabelCd, FetchMenuLabelCd }
}

export default MenuLabelCdService
