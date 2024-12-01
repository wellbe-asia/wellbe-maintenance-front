import { useForm } from 'react-hook-form'
import { useState } from 'react'

// ** hook
import { COUPON_TARGET_ATTR_CD, COUPON_TARGET_ATTR_VALUE } from '@/@core/utils/constant'
import { useLocale } from '@/@core/hooks/useLocal'

// ** API
import ShopCouponAPI from '@/@core/api/factoryShopCoupon'
import ShopMenuAPI from '@/@core/api/factoryShopMenu'
import {
  ShopCouponImageType,
  ShopCouponMenuResponseGetType,
  ShopCouponResponseGetType,
  ShopCouponTargetResponseGetType,
  ShopCouponType
} from '@/@core/api/type/shopCoupon'
import { dateFormatApi, dateFormatApi2Date, getCurrentDate } from '@/@core/utils/date'
import { ShopMenuQueryResponseGetType } from '@/@core/api/type/shopMenu'
import { removeCommas } from '@/@core/utils/amount'
import ShopCouponImageAPI from '@/@core/api/factoryShopCouponImage'

export type ShopCouponFormType = {
  ShopCoupon: ShopCouponType
}

const ShopCouponService = () => {
  const { t, GetMessage } = useLocale()

  const [shopCoupons, setShopCoupons] = useState<ShopCouponType[]>([])

  const [shopMenues, setShopMenes] = useState<ShopMenuQueryResponseGetType[]>([])

  const [loading, setLoading] = useState(false)
  const [submitLoading, setSubmitLoading] = useState(false)

  const ShopCouponForm = useForm<ShopCouponFormType>({
    mode: 'onChange',
    defaultValues: { ShopCoupon: {} }
  })

  const InitCoupon = async (shopId: string, languageCd: string, CouponCode: string) => {
    try {
      setLoading(true)
      const res = await ShopCouponAPI.GetWithShopId(shopId, languageCd, CouponCode)

      if (res.data && res.data.shop_coupons && res.data.shop_coupons.length > 0) {
        const c = SetCoupon(res.data.shop_coupons[0], languageCd)
        console.log('SetCoupon', c)
        ShopCouponForm.setValue('ShopCoupon', c)
      }
    } finally {
      setLoading(false)
    }
  }

  const InitCoupons = async (shopId: string, languageCd: string) => {
    try {
      setLoading(true)
      setShopCoupons([])
      const res = await ShopCouponAPI.GetWithShopId(shopId, languageCd, '')

      if (res.data && res.data.shop_coupons && res.data.shop_coupons.length > 0) {
        const shopCoupons = [] as ShopCouponType[]
        for (const d of res.data.shop_coupons) {
          shopCoupons.push(SetCoupon(d, languageCd))
          setShopCoupons(shopCoupons)
        }
      }
    } finally {
      setLoading(false)
    }
  }

  const InitEmptyCoupon = async (shopId: string, languageCd: string, menues?: ShopMenuQueryResponseGetType[]) => {
    try {
      setLoading(true)

      ShopCouponForm.setValue('ShopCoupon', {
        id: '',
        shop_id: shopId,
        coupon_rate_100: '',
        coupon_rate: '',
        coupon_amount: '',
        coupon_start_date: '',
        coupon_end_date: '',
        coupon_start_date_dt: getCurrentDate(),
        coupon_limit_amount: '',
        coupon_limit_count: '',
        coupon_code: '',
        language_cd: languageCd,
        coupon_title: '',
        coupon_description: '',
        new_customer: true,
        repeat_customer: true,
        shop_coupon_menues: [],
        shop_coupon_targets: [],
        shopCouponImage: { ShopCouponId: '' }
      })
      ShopCouponForm.setValue(
        'ShopCoupon.shop_coupon_menues',
        menues
          ? menues.map(v => {
              return v.id
            })
          : []
      )
    } finally {
      setLoading(false)
    }
  }

  const GetShopMenu = async (shopId: string, languageCd: string): Promise<ShopMenuQueryResponseGetType[]> => {
    const res = await ShopMenuAPI.GetPublishedWithShopId(shopId, languageCd)
    if (res.data?.shop_menues) {
      setShopMenes(res.data.shop_menues)

      return res.data.shop_menues
    }

    return []
  }

  const SetCoupon = (coupon: ShopCouponResponseGetType, languageCd: string): ShopCouponType => {
    return {
      id: coupon.id,
      shop_id: coupon.shop_id,
      coupon_rate: coupon.coupon_rate ? String(coupon.coupon_rate) : '',
      coupon_rate_100: coupon.coupon_rate ? String(coupon.coupon_rate && coupon.coupon_rate * 100) : '',
      coupon_amount: coupon.coupon_amount ? String(coupon.coupon_amount) : '',
      coupon_start_date: coupon.coupon_start_date,
      coupon_end_date: coupon.coupon_end_date,
      coupon_start_date_dt: coupon.coupon_start_date ? dateFormatApi2Date(coupon.coupon_start_date) : undefined,
      coupon_end_date_dt: coupon.coupon_end_date ? dateFormatApi2Date(coupon.coupon_end_date) : undefined,
      coupon_limit_amount: String(coupon.coupon_limit_amount),
      coupon_limit_count: String(coupon.coupon_limit_count),
      coupon_code: coupon.coupon_code,
      language_cd: languageCd,
      coupon_title: coupon.base_shop_coupon_name.coupon_title,
      coupon_description: coupon.base_shop_coupon_name.coupon_description,
      shopCouponImage: {
        ShopCouponId: coupon.id,
        ImagePath:
          (coupon.shop_coupon_images &&
            coupon.shop_coupon_images.length > 0 &&
            coupon.shop_coupon_images[0].image_path) ||
          ''
      },
      new_customer: GetNewCustomer(coupon.shop_coupon_targets),
      repeat_customer: GetRepeatCustomer(coupon.shop_coupon_targets),
      shop_coupon_menues: GetShopCouponMenus(coupon.shop_coupon_menus),
      shop_coupon_targets: []
    }
  }

  const GetNewCustomer = (coupon_targets: ShopCouponTargetResponseGetType[]): boolean => {
    if (coupon_targets) {
      for (const d of coupon_targets) {
        if (
          String(d.coupon_target_attr_cd) == COUPON_TARGET_ATTR_CD.ALL_CUSTOMER &&
          d.coupon_target_attr_value == COUPON_TARGET_ATTR_VALUE.TRUE
        ) {
          return true
        }
        if (
          String(d.coupon_target_attr_cd) == COUPON_TARGET_ATTR_CD.NEW_CUSTOMER &&
          d.coupon_target_attr_value == COUPON_TARGET_ATTR_VALUE.TRUE
        ) {
          return true
        }
      }
    }

    return false
  }

  const GetRepeatCustomer = (coupon_targets: ShopCouponTargetResponseGetType[]): boolean => {
    if (coupon_targets) {
      for (const d of coupon_targets) {
        if (
          String(d.coupon_target_attr_cd) == COUPON_TARGET_ATTR_CD.ALL_CUSTOMER &&
          d.coupon_target_attr_value == COUPON_TARGET_ATTR_VALUE.TRUE
        ) {
          return true
        }
        if (
          String(d.coupon_target_attr_cd) == COUPON_TARGET_ATTR_CD.REPEAT_CUSTOMER &&
          d.coupon_target_attr_value == COUPON_TARGET_ATTR_VALUE.TRUE
        ) {
          return true
        }
      }
    }

    return false
  }

  const GetShopCouponMenus = (menues: ShopCouponMenuResponseGetType[]): string[] => {
    if (menues) {
      return menues.map(v => {
        return v.shop_menu_id
      })
    }

    return []
  }

  const Submit = async (): Promise<{ message: string; coupon_code: string }> => {
    const start_date = ShopCouponForm.getValues('ShopCoupon.coupon_start_date_dt')
    ShopCouponForm.setValue('ShopCoupon.coupon_start_date', start_date ? dateFormatApi(start_date) : '')
    const end_date = ShopCouponForm.getValues('ShopCoupon.coupon_end_date_dt')
    ShopCouponForm.setValue('ShopCoupon.coupon_end_date', end_date ? dateFormatApi(end_date) : '')
    const coupon_rate_100 = ShopCouponForm.getValues('ShopCoupon.coupon_rate_100')
    ShopCouponForm.setValue('ShopCoupon.coupon_rate', coupon_rate_100 ? String(Number(coupon_rate_100) / 100) : '')
    const coupon_amount = ShopCouponForm.getValues('ShopCoupon.coupon_amount')
    ShopCouponForm.setValue('ShopCoupon.coupon_amount', removeCommas(coupon_amount))

    if (!coupon_rate_100 && !coupon_amount) {
      return { message: t.MESSAGE_COUPON_RATE_OR_AMOUNT_REQUIRED, coupon_code: '' }
    }
    const f = ShopCouponForm.getValues()
    setSubmitLoading(true)
    let coupon_code = ''
    let coupon_id = ''
    try {
      if (f.ShopCoupon.id == '') {
        const res = await ShopCouponAPI.CreateShopCoupon(f.ShopCoupon)
        if (res.status != 200) {
          const message = GetMessage(res.status, res.data.result_code, res.data.message)

          return { message, coupon_code: '' }
        }
        coupon_code = res.data.shop_coupon?.coupon_code || ''
        coupon_id = res.data.shop_coupon?.id || ''
      } else {
        const res = await ShopCouponAPI.UpdateShopCoupon(f.ShopCoupon)
        if (res.status != 200) {
          const message = GetMessage(res.status, res.data.result_code, res.data.message)

          return { message, coupon_code: '' }
        }
        coupon_code = res.data.shop_coupon?.coupon_code || ''
        coupon_id = res.data.shop_coupon?.id || ''
      }

      if (f.ShopCoupon.shopCouponImage?.Image) {
        const image = { ShopCouponId: coupon_id, Image: f.ShopCoupon.shopCouponImage.Image } as ShopCouponImageType
        const res = await ShopCouponImageAPI.UploadShopImage(image)
        if (res.status != 200) {
          const message = GetMessage(res.status, res.data.result_code, res.data.message)

          return { message, coupon_code: '' }
        }
      } else if (!f.ShopCoupon.shopCouponImage?.Image && !f.ShopCoupon.shopCouponImage?.ImagePath) {
        const res = await ShopCouponImageAPI.DeleteShopCouponImage(coupon_id)
        if (res.status != 200) {
          const message = GetMessage(res.status, res.data.result_code, res.data.message)

          return { message, coupon_code: '' }
        }
      }

      return { message: '', coupon_code: coupon_code }
    } finally {
      setSubmitLoading(false)
    }
  }

  const Hold = async (): Promise<{ message: string; coupon_code: string }> => {
    const start_date = ShopCouponForm.getValues('ShopCoupon.coupon_start_date_dt')
    const end_date = getCurrentDate()
    end_date.setDate(end_date.getDate() - 1)
    if (start_date) {
      if (dateFormatApi(start_date) > dateFormatApi(end_date)) {
        start_date.setDate(end_date.getDate())
      }
      ShopCouponForm.setValue('ShopCoupon.coupon_start_date', dateFormatApi(start_date))
    }
    if (end_date) {
      ShopCouponForm.setValue('ShopCoupon.coupon_end_date', dateFormatApi(end_date))
    }
    const f = ShopCouponForm.getValues()
    setSubmitLoading(true)
    try {
      const res = await ShopCouponAPI.UpdateShopCoupon(f.ShopCoupon)
      if (res.status != 200) {
        const message = GetMessage(res.status, res.data.result_code, res.data.message)

        return { message, coupon_code: '' }
      }

      return { message: '', coupon_code: res.data.shop_coupon?.coupon_code || '' }
    } finally {
      setSubmitLoading(false)
    }
  }

  return {
    ShopCouponForm,
    loading,
    submitLoading,
    shopCoupons,
    shopMenues,
    GetShopMenu,
    InitCoupon,
    InitCoupons,
    InitEmptyCoupon,
    Submit,
    Hold
  }
}

export default ShopCouponService
