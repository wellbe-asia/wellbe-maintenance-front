import { useLocale } from '@/@core/hooks/useLocal'

export const ValidationRules = () => {
  const { t } = useLocale()

  return {
    shopName: {
      required: t.MESSAGE_REQUIRED_TEXTFIELD
    },
    contentTitle: {
      required: t.MESSAGE_REQUIRED_TEXTFIELD
    },
    contentBody: {
      required: t.MESSAGE_REQUIRED_TEXTFIELD
    },
    languageCd: {
      required: t.MESSAGE_REQUIRED_SELECT
    },
    shopImageAlt: {},
    shopImageDescription: {},
    shopImageCategory: {}
  }
}
