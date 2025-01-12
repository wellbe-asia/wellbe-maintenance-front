import { useRouter } from 'next/router'
import en from '@/configs/locales/en'
import ja from '@/configs/locales/ja'
import vi from '@/configs/locales/vi'
import { SERVER_STATUS } from '../utils/constant'
import { HttpStatusCode } from 'axios'

export const useLocale = () => {
  const router = useRouter()
  let t = en
  if (router.locale && router.locale != '') {
    if (router.locale == 'ja') {
      t = ja
    } else if (router.locale == 'vi') {
      t = vi
    }
  }

  const GetMessage = (httpStatus: number, serverStatus: number, message: string): string => {
    if (httpStatus == HttpStatusCode.InternalServerError) {
      switch (serverStatus) {
        case SERVER_STATUS.NEED_LOGIN:
          return t.MESSAGE_NEED_LOGIN
        case SERVER_STATUS.CANNOT_SIGNUP:
          return t.MESSAGE_CANNOT_SIGNUP + message
        case SERVER_STATUS.EMAIL_DUPPLICATE:
          return t.MESSAGE_CANNOT_SIGNUP_EMAIL_DUPPLICATE
        case SERVER_STATUS.LOGIC_ERROR_CODE_SHOP_URL_NOT_REGISTERED:
          return t.MESSAGE_SHOP_URL_ISNOT_REGISTERED
        case SERVER_STATUS.LOGIC_ERROR_CODE_CONTENTS_URL_DUPPLICATE:
          return t.MESSAGE_CANNOT_CONTENTS_URL_DUPPLICATE
        case SERVER_STATUS.URL_DUPPLICATE:
          return t.MESSAGE_CANNOT_SIGNUP_URL_DUPPLICATE
        case SERVER_STATUS.LOGIC_ERROR_CODE_CHECKOUT_TIMING_NOT_REGISTERED:
          return t.MESSAGE_CHECKOUT_TIMING_ISNOT_REGISTERED
        case SERVER_STATUS.LOGIC_ERROR_CODE_SHOP_NOTEXISTS_EXTERNAL_CONNECTION:
          return t.MESSAGE_ACCOUNT_SETTING_NOTEXISTS_EXTERNAL_CONNECTION
        default:
          return t.MESSAGE_ETC_ERROR + ' ' + message
      }
    } else if (httpStatus > HttpStatusCode.MultipleChoices) {
      return t.MESSAGE_ETC_ERROR
    }

    return ''
  }

  return { locale: router.locale, t, GetMessage }
}
