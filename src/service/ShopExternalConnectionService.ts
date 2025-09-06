import { useForm } from 'react-hook-form'
import { useState } from 'react'

// ** hook
import { EXTERNAL_SITE_CD } from '@/@core/utils/constant'
import { useLocale } from '@/@core/hooks/useLocal'
import { useAuth } from '@/hooks/useAuth'

// ** API
import ShopExternalConnectionAPI from '@/@core/api/factoryShopExternalConnection'
import {
  shopExternalConnectionSalonboardResponseGetType,
  shopExternalConnectionSalonboardType
} from '@/@core/api/type/shopExternalConnectionSalonboard'

export type ShopExternalConnectionFormType = {
  ShopExternalConnection: shopExternalConnectionSalonboardType
}

const ShopExternalConnectionService = () => {
  const { GetMessage } = useLocale()

  const auth = useAuth()

  const [loading, setLoading] = useState(false)

  const ShopExternalConnectionForm = useForm<ShopExternalConnectionFormType>({
    mode: 'onChange',
    defaultValues: { ShopExternalConnection: {} }
  })

  const Init = async (shopId: string) => {
    try {
      setLoading(true)
      const res = await ShopExternalConnectionAPI.GetSalonboardWithShopId(shopId || '')

      if (
        res.data &&
        res.data.shop_external_connect_salonboards &&
        res.data.shop_external_connect_salonboards.length > 0
      ) {
        const c = SetConnection(res.data.shop_external_connect_salonboards[0])
        ShopExternalConnectionForm.setValue('ShopExternalConnection', c)
      } else {
        const c = SetEmptyConnection(shopId)
        ShopExternalConnectionForm.setValue('ShopExternalConnection', c)
      }
    } finally {
      setLoading(false)
    }
  }

  const SetConnection = (
    val: shopExternalConnectionSalonboardResponseGetType
  ): shopExternalConnectionSalonboardType => {
    return {
      Id: val.id,
      ShopId: val.shop_id,
      UserId: val.user_id,
      Password: val.password,
      IsConfirmed: val.is_confirmed,
      ExternalConnectSiteCd: val.external_connect_site_cd,
      SalonboardType: val.salonboard_type,
      IsConnectShiftSetting: val.is_connect_shift_setting,
      IsMultipleSalon: val.is_multiple_salon,
      SalonboardId: val.salonboard_id
    }
  }

  const SetEmptyConnection = (shopId: string): shopExternalConnectionSalonboardType => {
    return {
      Id: '',
      ShopId: shopId,
      UserId: '',
      Password: '',
      IsConfirmed: undefined,
      ExternalConnectSiteCd: EXTERNAL_SITE_CD.SALONBOARD,
      SalonboardType: '',
      IsConnectShiftSetting: '',
      IsMultipleSalon: '',
      SalonboardId: ''
    }
  }

  const Submit = async (): Promise<{ message: string }> => {
    const f = ShopExternalConnectionForm.getValues()
    setLoading(true)
    try {
      const res = await ShopExternalConnectionAPI.SubmitShopExternalConnectionSalonboard(f.ShopExternalConnection)
      if (res.status != 200) {
        const message = GetMessage(res.status, res.data.result_code, res.data.message)

        return { message }
      }

      return { message: '' }
    } finally {
      setLoading(false)
    }
  }

  const Delete = async (): Promise<{ message: string }> => {
    const f = ShopExternalConnectionForm.getValues()
    setLoading(true)
    try {
      const res = await ShopExternalConnectionAPI.DeleteShopExternalConnectionSalonboard(
        f.ShopExternalConnection.Id,
        auth.shop?.Id || ''
      )
      if (res.status != 200) {
        const message = GetMessage(res.status, res.data.result_code, res.data.message)

        return { message }
      }

      return { message: '' }
    } finally {
      setLoading(false)
    }
  }

  return {
    ShopExternalConnectionForm,
    loading,
    Init,
    Submit,
    Delete
  }
}

export default ShopExternalConnectionService
