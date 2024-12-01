import { useLocale } from '@/@core/hooks/useLocal'

export const ValidationRules = () => {
  const { t } = useLocale()

  return {
    couponStartDateDt: {
      required: t.MESSAGE_REQUIRED_TEXTFIELD
    },
    couponTitle: {
      required: t.MESSAGE_REQUIRED_TEXTFIELD
    },
    couponDescription: {
      required: t.MESSAGE_REQUIRED_TEXTFIELD
    },
    shopCouponMenues: {
      required: t.MESSAGE_REQUIRED_SELECT
    },
    couponRate: {
      min: {
        value: 1,
        message: t.MESSAGE_COUPON_RATE_RANGE
      },
      max: {
        value: 100,
        message: t.MESSAGE_COUPON_RATE_RANGE
      }
    },
    languageCd: {
      required: t.MESSAGE_REQUIRED_SELECT
    }
  }
}
