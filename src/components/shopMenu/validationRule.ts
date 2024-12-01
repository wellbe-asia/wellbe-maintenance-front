import { useLocale } from '@/@core/hooks/useLocal'

export const ValidationRules = () => {
  const { t } = useLocale()

  return {
    menuName: {
      required: t.MESSAGE_REQUIRED_TEXTFIELD
    },
    menuDescription: {
      required: t.MESSAGE_REQUIRED_TEXTFIELD
    },
    treatmentTime: {
      required: t.MESSAGE_REQUIRED_TEXTFIELD
    },
    requiredTime: {
      required: t.MESSAGE_REQUIRED_TEXTFIELD
    },
    currencyCd: {
      required: t.MESSAGE_REQUIRED_SELECT
    },
    ammount: {
      required: t.MESSAGE_REQUIRED_TEXTFIELD
    },
    menuLabelCd: {}
  }
}
