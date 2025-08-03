import { useForm, useFieldArray } from 'react-hook-form'

// ** API
import ShopReservationLimitAPI from '@/@core/api/factoryShopReservationLimit'
import {
  BulkShopReservationLimitType,
  ShopReservationLimitSummaryType,
  ShopReservationLimitType
} from '@/@core/api/type/shopReservationLimit'

// ** hook
import { useLocalStorage } from '@/@core/hooks/useLocalStorage'
import { useLocale } from '@/@core/hooks/useLocal'

import { DEFAULT_SESSION_STORAGE, SERVER_STATUS, SESSION_STORAGE_KEY_KEYWORD } from '@/@core/utils/constant'
import { getCurrentDate } from '@/@core/utils/date'
import ShopReservationLimitMasterAPI from '@/@core/api/factoryShopReservationLimitMaster'
import { useState } from 'react'

export type ShopReservationLimitFormType = {
  ShopReservationLimits: ShopReservationLimitSummaryType[]
}

const ShopReservationLimitService = () => {
  const { GetMessage } = useLocale()

  const [loading, setLoading] = useState(false)

  const Form = useForm<ShopReservationLimitFormType>({
    mode: 'onChange',
    defaultValues: { ShopReservationLimits: [] }
  })

  const BulkForm = useForm<BulkShopReservationLimitType>({
    mode: 'onChange',
    defaultValues: {}
  })

  const token = useLocalStorage(SESSION_STORAGE_KEY_KEYWORD.TOKEN, DEFAULT_SESSION_STORAGE.TOKEN)

  const { control, watch, reset } = Form
  const FieldArray = useFieldArray({ name: 'ShopReservationLimits', control })
  const { fields, append } = FieldArray

  const watchFieldArray = watch('ShopReservationLimits')
  const ControlledFields = fields.map((field, index) => {
    return {
      ...field,
      ...watchFieldArray[index]
    }
  })

  const InitBulk = async (shopId: string) => {
    const dt = getCurrentDate()
    BulkForm.reset()
    BulkForm.setValue('shopId', shopId)
    BulkForm.setValue('startDate', dt)
    dt.setMonth(dt.getMonth() + 3)
    BulkForm.setValue('endDate', dt)
    const res = await ShopReservationLimitMasterAPI.GetShopReservationLimitMaster(shopId)
    if (
      res &&
      res.data &&
      res.data.shop_reservation_limit_masters &&
      res.data.shop_reservation_limit_masters.length > 0
    ) {
      BulkForm.setValue('limit', Number(res.data.shop_reservation_limit_masters[0].reservation_limit))
    }
  }

  const Init = async (
    shopId: string,
    languageCd: string,
    startDate: string
  ): Promise<{ data: ShopReservationLimitSummaryType[] }> => {
    reset()
    const res = await ShopReservationLimitAPI.GetShopReservationLimit(shopId, languageCd, startDate)
    const data = [] as ShopReservationLimitSummaryType[]
    if (res.data?.shop_reservation_limit) {
      for (const weekday of res.data.shop_reservation_limit.week_day) {
        const shopReservationLimitType = [] as ShopReservationLimitType[]
        for (const shopReservationLimit of weekday.shop_reservation_limits) {
          shopReservationLimitType.push({
            id: shopReservationLimit.id,
            shop_id: weekday.shop_id,
            limit_date: weekday.limit_date,
            limit_time_start: shopReservationLimit.limit_time_start,
            limit_time_end: shopReservationLimit.limit_time_end,
            reservation_limit: shopReservationLimit.reservation_limit
          })
        }
        const shopReservationLimitSummary = {
          is_holiday: weekday.is_holiday,
          limit_date: weekday.limit_date,
          week_day_name: weekday.week_day_name,
          weekday_cd: weekday.weekday_cd,
          bussiness_hours_start: weekday.bussiness_hours_start,
          bussiness_hours_end: weekday.bussiness_hours_end,
          shop_reservation_limit: shopReservationLimitType
        }
        append(shopReservationLimitSummary)
        data.push(shopReservationLimitSummary)
      }
    }

    return { data }
  }

  const Submit = async (shopId: string): Promise<{ message: string }> => {
    try {
      setLoading(true)
      const f = Form.getValues()
      if (f.ShopReservationLimits && f.ShopReservationLimits.length > 0) {
        const resDelete = await ShopReservationLimitAPI.DeleteShopReservationLimit(
          token.value,
          shopId,
          f.ShopReservationLimits[0].limit_date
        )
        if (resDelete.status !== 200) {
          const message = GetMessage(
            resDelete.status,
            resDelete.data?.result_code || SERVER_STATUS.SEVERERROR,
            resDelete.data?.message || ''
          )

          return { message }
        }
        let array = [] as ShopReservationLimitType[]
        for (const v of f.ShopReservationLimits) {
          array = array.concat(v.shop_reservation_limit)
        }

        const res = await ShopReservationLimitAPI.CreateShopReservationLimit(token.value, array)
        if (res.status !== 200) {
          const message = GetMessage(
            res.status,
            res.data?.result_code || SERVER_STATUS.SEVERERROR,
            res.data?.message || ''
          )

          return { message }
        }
      }

      return { message: '' }
    } finally {
      setLoading(false)
    }
  }

  const SubmitBulk = async (shopId: string): Promise<{ message: string }> => {
    try {
      setLoading(true)
      const f = BulkForm.getValues()
      const res = await ShopReservationLimitAPI.BulkCreateShopReservationLimit(token.value, shopId, f)
      if (res.status !== 200) {
        const message = GetMessage(
          res.status,
          res.data?.result_code || SERVER_STATUS.SEVERERROR,
          res.data?.message || ''
        )

        return { message }
      }

      const resMaster = await ShopReservationLimitMasterAPI.CreateShopReservationLimitMaster(token.value, f)
      if (resMaster.status !== 200) {
        const message = GetMessage(
          resMaster.status,
          resMaster.data?.result_code || SERVER_STATUS.SEVERERROR,
          resMaster.data?.message || ''
        )

        return { message }
      }

      return { message: '' }
    } finally {
      setLoading(false)
    }
  }

  return { Form, BulkForm, FieldArray, ControlledFields, loading, Init, Submit, InitBulk, SubmitBulk }
}

export default ShopReservationLimitService
