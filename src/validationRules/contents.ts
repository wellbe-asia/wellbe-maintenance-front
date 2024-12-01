import { useLocale } from '@/@core/hooks/useLocal'

export const ValidationRules = () => {
  const { t } = useLocale()

  return {
    title: {
      required: t.MESSAGE_REQUIRED_TEXTFIELD
    },
    summary: {
      required: t.MESSAGE_REQUIRED_TEXTFIELD
    },
    isDisplay: {},
    publishDate: {},
    url: {
      required: t.MESSAGE_REQUIRED_TEXTFIELD,
      pattern: {
        value: /^[0-9a-z\-]+$/,
        message: t.MESSAGE_PATTERN_URL
      }
    },
    contents: {
      required: t.MESSAGE_REQUIRED_TEXTFIELD
    },
    languageCd: {
      required: t.MESSAGE_REQUIRED_SELECT
    }
  }
}
