// ** React Import
import { useEffect } from 'react'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Third Party Import
import { useTranslation } from 'react-i18next'

// ** Custom Components Imports
import OptionsMenu from 'src/@core/components/option-menu'

// ** locales
import locales, { getLanguageCdWithValue, getDefaultLanguageCd, localeType } from 'src/configs/locales/locales'

// ** Type Import
import { Settings } from 'src/@core/context/settingsContext'
import { useRouter } from 'next/router'
import { useLocalStorage } from '@/@core/hooks/useLocalStorage'
import { SESSION_STORAGE_KEY_KEYWORD } from '@/@core/utils/constant'

interface Props {
  settings: Settings
  saveSettings: (values: Settings) => void
}

const LanguageDropdown = ({ settings, saveSettings }: Props) => {
  // ** Hook
  const { i18n } = useTranslation()
  const router = useRouter()

  // ** Vars
  const { layout } = settings
  const languageCd = useLocalStorage(SESSION_STORAGE_KEY_KEYWORD.LANGUAGE, getDefaultLanguageCd())

  useEffect(() => {
    languageCd.setSessionValue(getLanguageCdWithValue(router.locale ? router.locale : ''))

    // Only first time
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.locale])

  const handleLangItemClick = (lang: string) => {
    router.push(router.pathname, router.asPath, { locale: lang })
    i18n.changeLanguage(lang)
  }

  // ** Change html `lang` attribute when changing locale
  useEffect(() => {
    document.documentElement.setAttribute('lang', i18n.language)
  }, [i18n.language])

  return (
    <OptionsMenu
      icon={<Icon icon='mdi:translate' />}
      menuProps={{ sx: { '& .MuiMenu-paper': { mt: 4, minWidth: 130 } } }}
      iconButtonProps={{ color: 'inherit', sx: { ...(layout === 'vertical' ? { mr: 0.75 } : { mx: 0.75 }) } }}
      options={locales.map((v: localeType) => {
        return {
          text: v.name,
          menuItemProps: {
            sx: { py: 2 },
            selected: i18n.language === v.value,
            onClick: () => {
              handleLangItemClick(v.value)
              saveSettings({ ...settings, direction: 'ltr' })
            }
          }
        }
      })}
    />
  )
}

export default LanguageDropdown
