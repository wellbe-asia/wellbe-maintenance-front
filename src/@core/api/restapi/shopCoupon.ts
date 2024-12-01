import axios from '@/@core/api/BaseAxios'
import { ShopCouponResponseType, ShopCouponType } from '../type/shopCoupon'
import { COUPON_TARGET_ATTR_CD, COUPON_TARGET_ATTR_VALUE } from '@/@core/utils/constant'

const ShopCouponAPI = {
  GetWithShopId: async (
    shopId: string,
    languageCd: string,
    couponCode: string
  ): Promise<{ status: number; data: ShopCouponResponseType }> => {
    try {
      const response = await axios.get(
        `${
          process.env.NEXT_PUBLIC_SERVER_SHOP_URL
        }/query/shop_coupons/filter_maintenance?shop_id=${shopId}&language_cd=${languageCd}&coupon_code=${couponCode}&limit=${10000}&offset=${0}`,
        {
          headers: {
            Wellbe_Apikey: process.env.NEXT_PUBLIC_API_KEY_SHOP_MAINTENANCE
          }
        }
      )

      return response
    } catch (error: any) {
      return error
    }
  },
  CreateShopCoupon: async (
    shopCouponType: ShopCouponType
  ): Promise<{ status: number; data: ShopCouponResponseType }> => {
    try {
      for (let i = 0; i < shopCouponType.shop_coupon_targets.length; i++) {
        shopCouponType.shop_coupon_targets.pop()
      }
      shopCouponType.shop_coupon_targets.push({
        coupon_target_attr_cd: COUPON_TARGET_ATTR_CD.ALL_CUSTOMER,
        coupon_target_attr_value:
          shopCouponType.new_customer && shopCouponType.repeat_customer
            ? COUPON_TARGET_ATTR_VALUE.TRUE
            : COUPON_TARGET_ATTR_VALUE.FALSE
      })
      shopCouponType.shop_coupon_targets.push({
        coupon_target_attr_cd: COUPON_TARGET_ATTR_CD.NEW_CUSTOMER,
        coupon_target_attr_value: shopCouponType.new_customer
          ? COUPON_TARGET_ATTR_VALUE.TRUE
          : COUPON_TARGET_ATTR_VALUE.FALSE
      })
      shopCouponType.shop_coupon_targets.push({
        coupon_target_attr_cd: COUPON_TARGET_ATTR_CD.REPEAT_CUSTOMER,
        coupon_target_attr_value: shopCouponType.repeat_customer
          ? COUPON_TARGET_ATTR_VALUE.TRUE
          : COUPON_TARGET_ATTR_VALUE.FALSE
      })

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER_SHOP_URL}/shop/shop_coupon/create`,
        JSON.stringify(shopCouponType),
        {
          headers: {
            'Content-Type': 'application/json',
            Wellbe_Apikey: process.env.NEXT_PUBLIC_API_KEY_SHOP_MAINTENANCE
          }
        }
      )

      return response
    } catch (error: any) {
      return error
    }
  },
  UpdateShopCoupon: async (
    shopCouponType: ShopCouponType
  ): Promise<{ status: number; data: ShopCouponResponseType }> => {
    try {
      for (let i = 0; i < shopCouponType.shop_coupon_targets.length; i++) {
        shopCouponType.shop_coupon_targets.pop()
      }
      shopCouponType.shop_coupon_targets.push({
        coupon_target_attr_cd: COUPON_TARGET_ATTR_CD.ALL_CUSTOMER,
        coupon_target_attr_value:
          shopCouponType.new_customer && shopCouponType.repeat_customer
            ? COUPON_TARGET_ATTR_VALUE.TRUE
            : COUPON_TARGET_ATTR_VALUE.FALSE
      })
      shopCouponType.shop_coupon_targets.push({
        coupon_target_attr_cd: COUPON_TARGET_ATTR_CD.NEW_CUSTOMER,
        coupon_target_attr_value: shopCouponType.new_customer
          ? COUPON_TARGET_ATTR_VALUE.TRUE
          : COUPON_TARGET_ATTR_VALUE.FALSE
      })
      shopCouponType.shop_coupon_targets.push({
        coupon_target_attr_cd: COUPON_TARGET_ATTR_CD.REPEAT_CUSTOMER,
        coupon_target_attr_value: shopCouponType.repeat_customer
          ? COUPON_TARGET_ATTR_VALUE.TRUE
          : COUPON_TARGET_ATTR_VALUE.FALSE
      })
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER_SHOP_URL}/shop/shop_coupon/update`,
        JSON.stringify(shopCouponType),
        {
          headers: {
            'Content-Type': 'application/json',
            Wellbe_Apikey: process.env.NEXT_PUBLIC_API_KEY_SHOP_MAINTENANCE
          }
        }
      )

      return response
    } catch (error: any) {
      return error
    }
  }
}

export default ShopCouponAPI
