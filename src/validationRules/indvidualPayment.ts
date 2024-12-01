import { useLocale } from '@/@core/hooks/useLocal'

export const ValidationRules = () => {
  const { t } = useLocale()

  return {
    closingDate: {
      required: t.MESSAGE_REQUIRED_TEXTFIELD
    },
    paymentDate: {
      required: t.MESSAGE_REQUIRED_TEXTFIELD
    }
  }
}
