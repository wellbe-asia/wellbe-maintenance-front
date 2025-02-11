import { useLocale } from '@/@core/hooks/useLocal'

export const ValidationRules = () => {
  const { t } = useLocale()

  return {
    shopTellCountryNo: {
      required: t.MESSAGE_REQUIRED_SELECT
    },
    shopTellNo: {
      required: t.MESSAGE_REQUIRED_TEXTFIELD
    },
    shopEmailAddress: {
      required: t.MESSAGE_REQUIRED_TEXTFIELD
    },
    country: {
      required: t.MESSAGE_REQUIRED_SELECT
    },
    state: {
      required: t.MESSAGE_REQUIRED_SELECT
    },
    address1: {
      required: t.MESSAGE_REQUIRED_TEXTFIELD
    },
    address2: {},
    address3: {},
    latitude: {
      required: t.MESSAGE_REQUIRED_TEXTFIELD
    },
    longitude: {
      required: t.MESSAGE_REQUIRED_TEXTFIELD
    },
    mapUrl: {
      required: t.MESSAGE_REQUIRED_TEXTFIELD
    },
    googleMapEmbeddTag: {
      required: t.MESSAGE_REQUIRED_TEXTFIELD
    },
    quantity: {
      required: t.MESSAGE_REQUIRED_TEXTFIELD
    },
    service: {}
  }
}
