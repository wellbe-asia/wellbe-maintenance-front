// ** API
import AccountAPI from '@/@core/api/factoryAccount'
import ShopBookingFeeApi from '@/@core/api/restapi/shopBookingFee'
import { ShopType } from '@/@core/api/type/shop'

// ** hook
import { useLocale } from '@/@core/hooks/useLocal'
import { SERVER_STATUS } from '@/@core/utils/constant'
import { useState } from 'react'
import { useForm } from 'react-hook-form'

export type AccountFormType = {
  shop: ShopType
}

export type ShopUrlFormType = {
  shopUrl: string
}

const AccountService = () => {
  const { GetMessage } = useLocale()
  const [loading, setLoading] = useState(false)
  const [shop, setShop] = useState<ShopType>()

  const Form = useForm<AccountFormType>({
    mode: 'onChange',
    defaultValues: { shop: {} }
  })

  const ShopUrlForm = useForm<ShopUrlFormType>({
    mode: 'onChange',
    defaultValues: { shopUrl: '' }
  })

  const Init = async (shopId: string) => {
    try {
      setLoading(true)
      Form.reset()
      const res = await AccountAPI.GetShopWithKey(shopId)
      const message = GetMessage(res.status, res.data.result_code, res.data.message)
      if (res.status != 200 || res.data.result_code != 0) {
        if (res.data.result_code != undefined && res.status != SERVER_STATUS.SUCCESS) {
          return { status: res.data.result_code, message: message }
        } else {
          return { status: SERVER_STATUS.SEVERERROR, message: message }
        }
      } else {
        const shop = res.data.shop
        const pic = res.data.shop_admin_pic_name
        const fee = res.data.shop_booking_fee
        if (shop) {
          const s = {
            Id: shop.id,
            ShopNo: shop.shop_no,
            ShopName: shop.shop_name,
            ShopIdentifyNumber: shop.shop_identify_number,
            ShopAdminTellCountryNoCd: String(shop.shop_admin_tell_country_no_cd),
            ShopAdminTellNo: shop.shop_admin_tell_no,
            ShopAdminEmailAddress: shop.shop_admin_email_address,
            ShopStatusCd: String(shop.shop_status_cd),
            ShopBasicalCurrencyCd: String(shop.shop_basical_currency_cd),
            ShopPaymentCurrencyCd: String(shop.shop_payment_currency_cd),
            BookingMethodCd: String(shop.booking_method_cd),
            CheckoutTimingCd: String(shop.checkout_timing_cd),
            ShopCountryCd: String(shop.shop_country_cd),
            ShopBasicalLanguageCd: String(shop.shop_basical_language_cd),
            ShopUrl: shop.shop_url,
            ShopAdminPicName: pic?.shop_admin_pic_name || '',
            ShopAdminPicTellCountryCd: pic?.shop_admin_pic_tell_country_cd
              ? String(pic.shop_admin_pic_tell_country_cd)
              : '',
            ShopAdminPicTellNo: pic?.shop_admin_pic_tell_no || '',
            ShopAdminPicEmailAddress: pic?.shop_admin_pic_email_address || '',
            Rank: String(shop.rank),
            WellbeFee: String(fee?.fee_rate)
          }
          Form.setValue('shop', s)
          setShop(s)
          ShopUrlForm.setValue('shopUrl', shop.shop_url)
        }

        return { status: SERVER_STATUS.SUCCESS, message: message }
      }
    } finally {
      setLoading(false)
    }
  }

  const UpdateShop = async (): Promise<{ status: number; message: string }> => {
    try {
      setLoading(true)
      const f = Form.getValues('shop')
      const res = await AccountAPI.UpdateShop(f)
      if (res.status != 200 || res.data.result_code != 0) {
        const message = GetMessage(res.status, res.data.result_code, res.data.message)
        if (res.data.result_code != undefined && res.status != SERVER_STATUS.SUCCESS) {
          return { status: res.data.result_code, message: message }
        } else if (res.status > 299) {
          return { status: SERVER_STATUS.SEVERERROR, message: message }
        } else {
          return { status: SERVER_STATUS.SUCCESS, message: message }
        }
      }

      const resRank = await AccountAPI.UpdateRank(f)
      if (resRank.status != 200 || resRank.data.result_code != 0) {
        const message = GetMessage(resRank.status, resRank.data.result_code, resRank.data.message)
        if (resRank.data.result_code != undefined && resRank.status != SERVER_STATUS.SUCCESS) {
          return { status: resRank.data.result_code, message: message }
        } else if (resRank.status > 299) {
          return { status: SERVER_STATUS.SEVERERROR, message: message }
        } else {
          return { status: SERVER_STATUS.SUCCESS, message: message }
        }
      }

      const resEmail = await AccountAPI.UpdateShopEmail(f)
      if (resEmail.status != 200 || resEmail.data.result_code != 0) {
        const message = GetMessage(resEmail.status, resEmail.data.result_code, resEmail.data.message)
        if (resEmail.data.result_code != undefined && resEmail.status != SERVER_STATUS.SUCCESS) {
          return { status: resEmail.data.result_code, message: message }
        } else if (resEmail.status > 299) {
          return { status: SERVER_STATUS.SEVERERROR, message: message }
        } else {
          return { status: SERVER_STATUS.SUCCESS, message: message }
        }
      }

      const resFee = await ShopBookingFeeApi.UpdateBookingFee(f.Id, f.WellbeFee)
      if (resFee.status != 200 || resFee.data.result_code != 0) {
        const message = GetMessage(resFee.status, resFee.data.result_code, resFee.data.message)
        if (resFee.data.result_code != undefined && resFee.status != SERVER_STATUS.SUCCESS) {
          return { status: resFee.data.result_code, message: message }
        } else if (resFee.status > 299) {
          return { status: SERVER_STATUS.SEVERERROR, message: message }
        } else {
          return { status: SERVER_STATUS.SUCCESS, message: message }
        }
      }

      return { status: SERVER_STATUS.SUCCESS, message: '' }
    } finally {
      setLoading(false)
    }
  }

  const UpdateShopUrl = async (shopId: string): Promise<{ status: number; message: string }> => {
    setLoading(true)
    const f = ShopUrlForm.getValues()
    const { data, status } = await AccountAPI.UpdateShopUrl(shopId, f.shopUrl)
    setLoading(false)
    if (status != 200 || data.result_code != 0) {
      const message = GetMessage(status, data.result_code, data.message)
      if (data.result_code != undefined && status != SERVER_STATUS.SUCCESS) {
        return { status: data.result_code, message: message }
      } else if (status > 299) {
        return { status: SERVER_STATUS.SEVERERROR, message: message }
      } else {
        return { status: SERVER_STATUS.SUCCESS, message: message }
      }
    }

    return { status: SERVER_STATUS.SUCCESS, message: '' }
  }

  return { Form, shop, ShopUrlForm, loading, Init, UpdateShop, UpdateShopUrl }
}

export default AccountService
