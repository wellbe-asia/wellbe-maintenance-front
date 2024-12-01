// ** API
import ShopMaintenanceLabelAPI from '@/@core/api/factoryShopMaintenanceLabel'
import { ShopMaintenanceLabelType } from '@/@core/api/type/shopMaintenanceLabel'

// ** hook
import { useLocale } from '@/@core/hooks/useLocal'
import { SERVER_STATUS, SHOP_MAINTENANCE_LABEL } from '@/@core/utils/constant'
import { useState } from 'react'
import { useFieldArray, useForm } from 'react-hook-form'
import ShopMaintenanceLabelCdService from './ShopMaintenanceLabelCdService'

// ** Service

export type ShopMaintenanceLabelFormType = {
  shopMaintenanceLabels: ShopMaintenanceLabelType[]
}

const ShopMaintenanceLabelService = () => {
  const { GetMessage } = useLocale()
  const [loading, setLoading] = useState(false)
  const [shopId, setShopId] = useState('')

  const shopMaintenanceLabelCdService = ShopMaintenanceLabelCdService()

  const Form = useForm<ShopMaintenanceLabelFormType>({
    mode: 'onChange',
    defaultValues: { shopMaintenanceLabels: [] }
  })
  const ShopMaintenanceLabelsFieldArray = useFieldArray({
    name: 'shopMaintenanceLabels',
    control: Form.control
  })

  const ShopMaintenanceLabelsWatchFieldArray = Form.watch('shopMaintenanceLabels')
  const ControlledFields = ShopMaintenanceLabelsFieldArray.fields.map((field, index) => {
    return {
      ...field,
      ...ShopMaintenanceLabelsWatchFieldArray[index]
    }
  })

  const Init = async (shopId: string, languageCd: string) => {
    try {
      setLoading(true)
      Form.reset()
      setShopId(shopId)
      shopMaintenanceLabelCdService.FetchShopMaintenanceLabelCd(languageCd)
      const res = await ShopMaintenanceLabelAPI.GetWithShopId(shopId)
      if (res.status == 200 && res.data) {
        const shopMaintenanceLabels = res.data?.shop_maintenance_labels
        if (shopMaintenanceLabels && shopMaintenanceLabels.length > 0) {
          for (const v of shopMaintenanceLabels) {
            ShopMaintenanceLabelsFieldArray.append({
              ShopId: v.shop_id,
              ShopMaintenanceLabelCd: String(v.shop_maintenance_label_cd),
              ShopMaintenanceLabelValue: v.shop_maintenance_label_value
            })
          }
        } else {
          ShopMaintenanceLabelsFieldArray.append({
            ShopId: shopId,
            ShopMaintenanceLabelCd: SHOP_MAINTENANCE_LABEL.INDIVIDUAL_PAYOUT,
            ShopMaintenanceLabelValue: ''
          })
        }
      }
    } finally {
      setLoading(false)
    }
  }

  const Submit = async (): Promise<{ status: number; message: string }> => {
    setLoading(true)
    const resDelete = await ShopMaintenanceLabelAPI.DeleteWithShopId(shopId)
    setLoading(false)
    if (resDelete.status != 200 || (resDelete.data && resDelete.data.result_code != 0)) {
      const message = GetMessage(
        resDelete.status,
        resDelete.data?.result_code || SERVER_STATUS.SEVERERROR,
        resDelete.data?.message || ''
      )
      if (resDelete.data?.result_code != undefined && resDelete.status != SERVER_STATUS.SUCCESS) {
        return { status: resDelete.data.result_code, message: message }
      } else if (resDelete.status > 299) {
        return { status: SERVER_STATUS.SEVERERROR, message: message }
      } else {
        return { status: SERVER_STATUS.SUCCESS, message: message }
      }
    }

    const f = Form.getValues('shopMaintenanceLabels')
    for (const v of f) {
      const resCreate = await ShopMaintenanceLabelAPI.Create(v)
      setLoading(false)
      if (resCreate.status != 200 || (resCreate.data && resCreate.data.result_code != 0)) {
        const message = GetMessage(
          resCreate.status,
          resCreate.data?.result_code || SERVER_STATUS.SEVERERROR,
          resCreate.data?.message || ''
        )
        if (resCreate.data?.result_code != undefined && resCreate.status != SERVER_STATUS.SUCCESS) {
          return { status: resCreate.data.result_code, message: message }
        } else if (resCreate.status > 299) {
          return { status: SERVER_STATUS.SEVERERROR, message: message }
        } else {
          return { status: SERVER_STATUS.SUCCESS, message: message }
        }
      }
    }

    return { status: SERVER_STATUS.SUCCESS, message: '' }
  }

  return {
    Form,
    loading,
    ControlledFields,
    shopMaintenanceLabelCds: shopMaintenanceLabelCdService.ShopMaintenanceLabelCd,
    Init,
    Submit
  }
}

export default ShopMaintenanceLabelService
