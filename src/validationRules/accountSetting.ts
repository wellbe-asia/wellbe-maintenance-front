import { useLocale } from '@/@core/hooks/useLocal'

export const ValidationRules = () => {
  const { t } = useLocale()

  return {
    shopName: {
      required: t.MESSAGE_REQUIRED_TEXTFIELD
    },
    shopIdentifyNumber: {},
    shopAdminTellNo: {
      required: t.MESSAGE_REQUIRED_TEXTFIELD,
      pattern: {
        value: /^[0-9-]+$/,
        message: t.MESSAGE_PATTERN_NUMBER_HYPHEM
      }
    },
    shopUrl: {
      required: t.MESSAGE_REQUIRED_TEXTFIELD
    },
    shopAdminTellCountryNoCd: {
      required: t.MESSAGE_REQUIRED_SELECT
    },
    bookingMethodCd: {
      required: t.MESSAGE_REQUIRED_SELECT
    },
    checkoutTimingCd: {
      required: t.MESSAGE_REQUIRED_SELECT
    },
    shopCountryCd: {
      required: t.MESSAGE_REQUIRED_SELECT
    },
    languageCd: {
      required: t.MESSAGE_REQUIRED_SELECT
    },
    picMame: {
      required: t.MESSAGE_REQUIRED_TEXTFIELD
    },
    picTellCountry: {
      required: t.MESSAGE_REQUIRED_SELECT
    },
    picTellNo: {
      required: t.MESSAGE_REQUIRED_TEXTFIELD
    },
    picEmailAddress: {
      required: t.MESSAGE_REQUIRED_TEXTFIELD,
      pattern: {
        value: /^[a-zA-Z0-9_.+-]+@([a-zA-Z0-9][a-zA-Z0-9-]*[a-zA-Z0-9]*\.)+[a-zA-Z]{2,}$/,
        message: t.MESSAGE_PATTERN_EMAIL
      }
    },
    rank: {
      required: t.MESSAGE_REQUIRED_TEXTFIELD
    },
    wellbefee: {
      required: t.MESSAGE_REQUIRED_TEXTFIELD,
      max: {
        value: 1,
        message: t.MESSAGE_PATTERN_MAX + 1
      }
    },
    emailAddress: {
      required: t.MESSAGE_REQUIRED_TEXTFIELD,
      pattern: {
        value: /^[a-zA-Z0-9_.+-]+@([a-zA-Z0-9][a-zA-Z0-9-]*[a-zA-Z0-9]*\.)+[a-zA-Z]{2,}$/,
        message: t.MESSAGE_PATTERN_EMAIL
      }
    },
    password: {
      required: t.MESSAGE_REQUIRED_TEXTFIELD,
      pattern: /^(?=.*\d)(?=.*[A-Z])(?=.*[a-z])[A-Za-z0-9!@#$%^&*()]{8,}$/,
      message: t.MESSAGE_PATTERN_PASSWORD
    },
    confirmCode: {
      required: t.MESSAGE_REQUIRED_TEXTFIELD
    },
    ShopMaintenanceLabelValue: {
      required: t.MESSAGE_REQUIRED_SELECT
    }
  }
}
