export type localeType = {
  value: string
  name: string
  languageCd: string
}
const locales: localeType[] = [
  { value: 'en', name: 'English', languageCd: '1' },
  { value: 'ja', name: '日本語', languageCd: '2' },
  { value: 'vi', name: 'Tiếng Việt', languageCd: '3' }
]

export const getLanguageCdWithValue = (value: string) => {
  const locale = locales.find(v => {
    return v.value == value
  })

  return locale?.languageCd ? locale.languageCd : ''
}

export const isListedLangageValue = (tmpValue: string) => {
  const value = tmpValue.substring(0, 2)
  const locale = locales.find(v => {
    return v.value == value
  })

  return locale?.languageCd ? true : false
}

export const getLocaleFromWindowsLanguage = (tmpValue: string) => {
  return tmpValue.substring(0, 2)
}

export const getDefaultLanguageCd = () => {
  return '1'
}
export const getDefaultLanguageValue = () => {
  return 'en'
}

export default locales
