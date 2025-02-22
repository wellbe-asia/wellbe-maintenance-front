import { useLocale } from '@/@core/hooks/useLocal'

export const ValidationRules = () => {
  const { t } = useLocale()

  return {
    emailAddress: {
      required: t.MESSAGE_REQUIRED_TEXTFIELD
    },
    accountGroupCd: {
      required: t.MESSAGE_REQUIRED_SELECT
    }
  }
}
