import { useLocale } from '@/@core/hooks/useLocal'

export const ValidationRules = () => {
  const { t } = useLocale()

  return {
    storeName: {
      required: t.MESSAGE_REQUIRED_TEXTFIELD
    },
    email: {
      required: t.MESSAGE_REQUIRED_TEXTFIELD,
      pattern: {
        value: /^[a-zA-Z0-9_.+-]+@([a-zA-Z0-9][a-zA-Z0-9-]*[a-zA-Z0-9]*\.)+[a-zA-Z]{2,}$/,
        message: t.MESSAGE_PATTERN_EMAIL
      }
    },
    tellCountryCd: {
      required: t.MESSAGE_REQUIRED_SELECT
    },
    tellNo: {
      required: t.MESSAGE_REQUIRED_TEXTFIELD
    },
    basicalCurrencyCd: {
      required: t.MESSAGE_REQUIRED_SELECT
    },
    paymentCurrencyCd: {
      required: t.MESSAGE_REQUIRED_SELECT
    },
    bookingMethodCd: {
      required: t.MESSAGE_REQUIRED_SELECT
    },
    basicalLanguageCd: {
      required: t.MESSAGE_REQUIRED_SELECT
    },
    picName: {
      required: t.MESSAGE_REQUIRED_TEXTFIELD
    },
    picTellCountryNo: {
      required: t.MESSAGE_REQUIRED_SELECT
    },
    picTellNo: {
      required: t.MESSAGE_REQUIRED_TEXTFIELD
    },
    shopUrl: {
      required: t.MESSAGE_REQUIRED_TEXTFIELD,
      pattern: {
        value: /^[0-9a-z\-]+$/,
        message: t.MESSAGE_PATTERN_URL
      }
    },
    picEmail: {
      required: t.MESSAGE_REQUIRED_TEXTFIELD,
      pattern: {
        value: /^[a-zA-Z0-9_.+-]+@([a-zA-Z0-9][a-zA-Z0-9-]*[a-zA-Z0-9]*\.)+[a-zA-Z]{2,}$/,
        message: t.MESSAGE_PATTERN_EMAIL
      }
    },
    identifyNumber: {},
    address1: {
      required: t.MESSAGE_REQUIRED_TEXTFIELD
    },
    address2: {},
    address3: {},
    country: {
      required: t.MESSAGE_REQUIRED_SELECT
    },
    state: {
      required: t.MESSAGE_REQUIRED_SELECT
    },
    latitude: {
      required: t.MESSAGE_REQUIRED_TEXTFIELD
    },
    longitude: {
      required: t.MESSAGE_REQUIRED_TEXTFIELD
    },
    mapUrl: {
      required: t.MESSAGE_REQUIRED_TEXTFIELD
    }
  }
}
