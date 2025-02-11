import { useForm, useFieldArray } from 'react-hook-form'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'

// ** API
import ShopBussinessHourAPI from '@/@core/api/factoryShopBussinessHour'
import { ShopBussinessHourType, ShopBussinessHourResponseGetType } from '@/@core/api/type/shopBussinessHour'

// ** hook
import { SERVER_STATUS, SHOP_EQUIPMENT } from '@/@core/utils/constant'
import { useLocale } from '@/@core/hooks/useLocal'

// ** API
import { ShopContactType } from '@/@core/api/type/shopContact'
import { ShopLocationType } from '@/@core/api/type/shopLocation'
import { ShopChipType } from '@/@core/api/type/shopChip'
import { ShopEquipmentType } from '@/@core/api/type/shopEquipment'
import ShopContactAPI from '@/@core/api/factoryShopContact'
import ShopLocationAPI from '@/@core/api/factoryShopLocation'
import ShopChipAPI from '@/@core/api/factoryShopChip'
import ShopEquipmentAPI from '@/@core/api/factoryShopEquipment'
import { ShopServiceType } from '@/@core/api/type/shopService'
import ShopServiceAPI from '@/@core/api/factoryShopService'
import TellCountryCdService from './TellCountryCdService'
import CountryCdService from './CountryCdService'
import StateCdService from './StateCdService'
import { getLanguageCdWithValue } from '@/configs/locales/locales'
import ServiceCdService from './ServiceCdService'

export type ShopBasicalInfoType = {
  ShopBasicalInfo: {
    shopId: string
    ShopContact: ShopContactType
    ShopLocation: ShopLocationType
    ShopBussinessHours: ShopBussinessHourType[]
    ShopChip: ShopChipType
    ShopEquipment: ShopEquipmentType
    ShopServices: ShopServiceType[]
  }
}

const ShopBasicalInfoService = () => {
  const { t, GetMessage } = useLocale()
  const { locale } = useRouter()

  const [loading, setLoading] = useState(false)
  const [submitLoading, setSubmitLoading] = useState(false)

  // ** Service
  const tellCountryCdService = TellCountryCdService()
  const countryCdService = CountryCdService()
  const stateCdService = StateCdService()
  const serviceCdService = ServiceCdService()

  const ShopBasicalInfoForm = useForm<ShopBasicalInfoType>({
    mode: 'onChange',
    defaultValues: {
      ShopBasicalInfo: {}
    }
  })

  const ShopChipWatchField = ShopBasicalInfoForm.watch('ShopBasicalInfo.ShopChip')

  const ShopBussinessHoursFieldArray = useFieldArray({
    name: 'ShopBasicalInfo.ShopBussinessHours',
    control: ShopBasicalInfoForm.control
  })

  const ShopBussinessHoursWatchFieldArray = ShopBasicalInfoForm.watch('ShopBasicalInfo.ShopBussinessHours')
  const ShopBussinessHoursControlledFields = ShopBussinessHoursFieldArray.fields.map((field, index) => {
    return {
      ...field,
      ...(ShopBussinessHoursWatchFieldArray &&
        ShopBussinessHoursWatchFieldArray.length > 0 &&
        ShopBussinessHoursWatchFieldArray[index])
    }
  })

  const ShopServiceFieldArray = useFieldArray({
    name: 'ShopBasicalInfo.ShopServices',
    control: ShopBasicalInfoForm.control
  })

  const ShopServicesWatchFieldArray = ShopBasicalInfoForm.watch('ShopBasicalInfo.ShopServices')
  const ShopServicesControlledFields = ShopServiceFieldArray.fields.map((field, index) => {
    return {
      ...field,
      ...(ShopServicesWatchFieldArray && ShopServicesWatchFieldArray[index])
    }
  })

  const watchCountry = ShopBasicalInfoForm.watch(`ShopBasicalInfo.ShopLocation.CountryCd`)

  useEffect(() => {
    if (locale) {
      const language = getLanguageCdWithValue(locale)
      tellCountryCdService.FetchTellCountryCd(language)
      countryCdService.FetchCountryCd(language)
      serviceCdService.FetchServiceCd(language)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [locale])

  useEffect(() => {
    if (locale) {
      const language = getLanguageCdWithValue(locale)
      stateCdService.FetchStateCd(language, String(watchCountry))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [watchCountry, locale])

  const Init = async (shopId: string, languageCd: string) => {
    try {
      setLoading(true)
      ShopBasicalInfoForm.reset()
      const scResponse = await ShopContactAPI.GetWithShopId(shopId)
      const slResponse = await ShopLocationAPI.GetWithShopId(shopId)
      const sbhResponse = await ShopBussinessHourAPI.GetWithShopId(shopId, languageCd)
      const schResponse = await ShopChipAPI.GetWithShopId(shopId)
      const seResponse = await ShopEquipmentAPI.GetWithShopId(shopId)
      const ssResponse = await ShopServiceAPI.GetWithShopId(shopId)

      // shop_id
      ShopBasicalInfoForm.setValue('ShopBasicalInfo.shopId', shopId)

      // shop_contact
      if (
        scResponse &&
        scResponse.status == 200 &&
        scResponse.data &&
        scResponse.data.shop_contact_proofreadings &&
        scResponse.data.shop_contact_proofreadings.length > 0
      ) {
        const v = scResponse.data.shop_contact_proofreadings[0]
        ShopBasicalInfoForm.setValue('ShopBasicalInfo.ShopContact', {
          Id: v.id,
          ShopId: v.shop_id,
          ShopTellCountryNoCd: String(v.shop_tell_country_no_cd),
          ShopTellNo: v.shop_tell_no,
          ShopEmailAddress: v.shop_email_address
        })
      } else {
        ShopBasicalInfoForm.setValue('ShopBasicalInfo.ShopContact', {
          Id: '',
          ShopId: shopId || '',
          ShopTellCountryNoCd: '',
          ShopTellNo: '',
          ShopEmailAddress: ''
        })
      }

      // shop_location
      if (
        slResponse &&
        slResponse.status == 200 &&
        slResponse.data &&
        slResponse.data.shop_location_proofreadings &&
        slResponse.data.shop_location_proofreadings.length > 0
      ) {
        const v = slResponse.data.shop_location_proofreadings[0]
        ShopBasicalInfoForm.setValue('ShopBasicalInfo.ShopLocation', {
          Id: v.id,
          ShopId: v.shop_id,
          CountryCd: v.country_cd ? String(v.country_cd) : '',
          StateCd: v.state_cd ? String(v.state_cd) : '',
          Address1: v.address1,
          Address2: v.address2,
          Address3: v.address3,
          Latitude: v.latitude ? String(v.latitude) : '',
          Longitude: v.longitude ? String(v.longitude) : '',
          MapUrl: v.map_url,
          GoogleMapEmbeddTag: v.google_map_embedd_tag
        })
      } else {
        ShopBasicalInfoForm.setValue('ShopBasicalInfo.ShopLocation', {
          Id: '',
          ShopId: shopId,
          CountryCd: '',
          StateCd: '',
          Address1: '',
          Address2: '',
          Address3: '',
          Latitude: '',
          Longitude: '',
          MapUrl: '',
          GoogleMapEmbeddTag: ''
        })
      }

      // shop_bussiness_hour
      if (
        sbhResponse &&
        sbhResponse.status == 200 &&
        sbhResponse.data &&
        sbhResponse.data.shop_bussiness_hours &&
        sbhResponse.data.shop_bussiness_hours.length > 0
      ) {
        sbhResponse.data.shop_bussiness_hours.map((v: ShopBussinessHourResponseGetType) => {
          ShopBussinessHoursFieldArray.append({
            Id: v.id,
            ShopId: shopId || '',
            WeekdayCd: String(v.weekday_cd),
            IsHoliday: v.is_holiday,
            BussinessHoursStart: v.bussiness_hours_start,
            BussinessHoursEnd: v.bussiness_hours_end,
            WeekdayName: v.weekday_name,
            WeekdayAbbreviation: v.weekday_abbreviation
          })
        })
      }

      // shop_chip
      if (
        schResponse &&
        schResponse.status == 200 &&
        schResponse.data &&
        schResponse.data.shop_chip_proofreadings &&
        schResponse.data.shop_chip_proofreadings.length > 0
      ) {
        const v = schResponse.data.shop_chip_proofreadings[0]
        ShopBasicalInfoForm.setValue('ShopBasicalInfo.ShopChip', {
          Id: v.id,
          ShopId: v.shop_id,
          NeedShopChip: v.need_shop_chip,
          ShopChipStandardAmmount: String(v.shop_chip_standard_ammount)
        })
      } else {
        ShopBasicalInfoForm.setValue('ShopBasicalInfo.ShopChip', {
          Id: '',
          ShopId: shopId || '',
          NeedShopChip: false,
          ShopChipStandardAmmount: ''
        })
      }

      // shop_equipment
      if (
        seResponse &&
        seResponse.status == 200 &&
        seResponse.data &&
        seResponse.data.shop_equipment_proofreadings &&
        seResponse.data.shop_equipment_proofreadings.length > 0
      ) {
        const v = seResponse.data.shop_equipment_proofreadings[0]
        ShopBasicalInfoForm.setValue('ShopBasicalInfo.ShopEquipment', {
          Id: v.id,
          ShopId: v.shop_id,
          EquipmentCd: v.equipment_cd ? String(v.equipment_cd) : '',
          EquipmentName: v.equipment_name,
          Quantity: v.quantity ? String(v.quantity) : ''
        })
      } else {
        ShopBasicalInfoForm.setValue('ShopBasicalInfo.ShopEquipment', {
          Id: '',
          ShopId: shopId || '',
          EquipmentCd: SHOP_EQUIPMENT.BED,
          EquipmentName: t.SCREEN_COL_SHOP_EQUIPMENT_BED,
          Quantity: ''
        })
      }

      // shop_service
      if (
        ssResponse &&
        ssResponse.status == 200 &&
        ssResponse.data &&
        ssResponse.data.shop_service_proofreadings &&
        ssResponse.data.shop_service_proofreadings.length > 0
      ) {
        ssResponse.data.shop_service_proofreadings.map(v => {
          ShopServiceFieldArray.append({
            Id: v.id,
            ShopId: v.shop_id,
            ServiceCd: String(v.service_cd)
          })
        })
      } else {
        AddShopService(shopId)
      }
    } finally {
      setLoading(false)
    }
  }

  const Submit = async (): Promise<{
    message: string
    trace:
      | 'shopContact'
      | 'shopLocation'
      | 'shopBussinessHour'
      | 'shopChip'
      | 'shopEquipment'
      | 'shopService'
      | 'shopPaymentMethod'
      | null
  }> => {
    const f = ShopBasicalInfoForm.getValues()
    setSubmitLoading(true)
    try {
      // shop_contact
      if (f.ShopBasicalInfo.ShopContact && f.ShopBasicalInfo.ShopContact.Id != '') {
        const res = await ShopContactAPI.UpdateShopContact(f.ShopBasicalInfo.ShopContact)
        if (res.status != 200) {
          const message = GetMessage(res.status, res.data.result_code, res.data.message)

          return { message, trace: 'shopContact' }
        }
      } else {
        const res = await ShopContactAPI.CreateShopContact(f.ShopBasicalInfo.ShopContact)
        if (res.status != 200) {
          const message = GetMessage(res.status, res.data.result_code, res.data.message)

          return { message, trace: 'shopContact' }
        }
      }

      // shop_location
      if (f.ShopBasicalInfo.ShopLocation && f.ShopBasicalInfo.ShopLocation.Id != '') {
        const res = await ShopLocationAPI.UpdateShopLocation(f.ShopBasicalInfo.ShopLocation)
        if (res.status != 200) {
          const message = GetMessage(
            res.status,
            res.data?.result_code || SERVER_STATUS.SEVERERROR,
            res.data?.message || ''
          )

          return { message, trace: 'shopLocation' }
        }
      } else {
        const res = await ShopLocationAPI.CreateShopLocation(f.ShopBasicalInfo.ShopLocation)
        if (res.status != 200) {
          const message = GetMessage(
            res.status,
            res.data?.result_code || SERVER_STATUS.SEVERERROR,
            res.data?.message || ''
          )

          return { message, trace: 'shopLocation' }
        }
      }

      // shop_bussiness_hour
      for (let i = 0; i < f.ShopBasicalInfo.ShopBussinessHours.length; i++) {
        const v = f.ShopBasicalInfo.ShopBussinessHours[i]
        if (v.Id != '') {
          const res = await ShopBussinessHourAPI.UpdateShopBussinessHour(v)
          if (res.status != 200) {
            const message = GetMessage(
              res.status,
              res.data?.result_code || SERVER_STATUS.SEVERERROR,
              res.data?.message || ''
            )

            return { message, trace: 'shopBussinessHour' }
          }
        } else {
          const res = await ShopBussinessHourAPI.CreateShopBussinessHour(v)
          if (res.status != 200) {
            const message = GetMessage(
              res.status,
              res.data?.result_code || SERVER_STATUS.SEVERERROR,
              res.data?.message || ''
            )

            return { message, trace: 'shopBussinessHour' }
          }
        }
      }

      // shop_chip
      if (f.ShopBasicalInfo.ShopChip && f.ShopBasicalInfo.ShopChip.Id != '') {
        const res = await ShopChipAPI.UpdateShopChip(f.ShopBasicalInfo.ShopChip)
        if (res.status != 200) {
          const message = GetMessage(
            res.status,
            res.data?.result_code || SERVER_STATUS.SEVERERROR,
            res.data?.message || ''
          )

          return { message, trace: 'shopChip' }
        }
      } else {
        const res = await ShopChipAPI.CreateShopChip(f.ShopBasicalInfo.ShopChip)
        if (res.status != 200) {
          const message = GetMessage(
            res.status,
            res.data?.result_code || SERVER_STATUS.SEVERERROR,
            res.data?.message || ''
          )

          return { message, trace: 'shopChip' }
        }
      }

      // shop_equipment
      if (f.ShopBasicalInfo.ShopEquipment && f.ShopBasicalInfo.ShopEquipment.Id != '') {
        const res = await ShopEquipmentAPI.UpdateShopEquipment(f.ShopBasicalInfo.ShopEquipment)
        if (res.status != 200) {
          const message = GetMessage(
            res.status,
            res.data?.result_code || SERVER_STATUS.SEVERERROR,
            res.data?.message || ''
          )

          return { message, trace: 'shopEquipment' }
        }
      } else {
        const res = await ShopEquipmentAPI.CreateShopEquipment(f.ShopBasicalInfo.ShopEquipment)
        if (res.status != 200) {
          const message = GetMessage(
            res.status,
            res.data?.result_code || SERVER_STATUS.SEVERERROR,
            res.data?.message || ''
          )

          return { message, trace: 'shopEquipment' }
        }
      }

      // shop_service
      const resServiceDelete = await ShopServiceAPI.DeleteShopServiceWithShopId(
        ShopBasicalInfoForm.getValues('ShopBasicalInfo.shopId')
      )
      if (resServiceDelete.status != 200) {
        const messageServiceDelete = GetMessage(
          resServiceDelete.status,
          resServiceDelete.data?.result_code || SERVER_STATUS.SEVERERROR,
          resServiceDelete.data?.message || ''
        )

        return { message: messageServiceDelete, trace: 'shopService' }
      }
      for (let i = 0; i < f.ShopBasicalInfo.ShopServices.length; i++) {
        const v = f.ShopBasicalInfo.ShopServices[i]
        if (v.ServiceCd != '') {
          const res = await ShopServiceAPI.CreateShopService(v)
          if (res.status != 200) {
            const message = GetMessage(
              res.status,
              res.data?.result_code || SERVER_STATUS.SEVERERROR,
              res.data?.message || ''
            )

            return { message, trace: 'shopService' }
          }
        }
      }

      return { message: '', trace: null }
    } finally {
      setSubmitLoading(false)
    }
  }

  const AddShopService = (shopId: string) => {
    ShopServiceFieldArray.append({
      Id: '',
      ServiceCd: '',
      ShopId: shopId
    })
  }

  const RemoveShopService = (index: number) => {
    ShopServiceFieldArray.remove(index)
  }

  return {
    ShopBasicalInfoForm,
    ShopBussinessHoursControlledFields,
    ShopServicesControlledFields,
    loading,
    submitLoading,
    tellCountryCd: tellCountryCdService.tellCountryCd,
    countryCd: countryCdService.countryCd,
    stateCd: stateCdService.stateCd,
    serviceCd: serviceCdService.serviceCd,
    ShopChipWatchField,
    Init,
    Submit,
    AddShopService,
    RemoveShopService
  }
}

export default ShopBasicalInfoService
