import { useForm } from 'react-hook-form'

// ** API
import ShopReservationLimitMasterAPI from '@/@core/api/factoryShopReservationLimitMaster'
import { ShopReservationLimitMasterType } from '@/@core/api/type/shopReservationLimitMaster'

// ** hook
import { useLocalStorage } from '@/@core/hooks/useLocalStorage'
import { useLocale } from '@/@core/hooks/useLocal'

import { DEFAULT_SESSION_STORAGE, SERVER_STATUS, SESSION_STORAGE_KEY_KEYWORD } from '@/@core/utils/constant'

const ShopReservationLimitMasterService = () => {
  const { GetMessage } = useLocale()

  const Form = useForm<ShopReservationLimitMasterType>({
    mode: 'onChange',
    defaultValues: {}
  })

  const token = useLocalStorage(SESSION_STORAGE_KEY_KEYWORD.TOKEN, DEFAULT_SESSION_STORAGE.TOKEN)

  const Init = async (shopId: string) => {
    Form.reset()
    Form.setValue('shopId', shopId)
    const res = await ShopReservationLimitMasterAPI.GetShopReservationLimitMaster(shopId)
    if (
      res &&
      res.data &&
      res.data.shop_reservation_limit_masters &&
      res.data.shop_reservation_limit_masters.length > 0
    ) {
      Form.setValue('limit', Number(res.data.shop_reservation_limit_masters[0].reservation_limit))
    }
  }

  const Submit = async (): Promise<{ message: string }> => {
    const f = Form.getValues()

    const res = await ShopReservationLimitMasterAPI.CreateShopReservationLimitMaster(token.value, f)
    if (res.status !== 200) {
      const message = GetMessage(res.status, res.data?.result_code || SERVER_STATUS.SEVERERROR, res.data?.message || '')

      return { message }
    }

    return { message: '' }
  }

  return { Form, Init, Submit }
}

export default ShopReservationLimitMasterService
