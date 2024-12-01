import { useForm } from 'react-hook-form'
import { useRouter } from 'next/router'
import { useEffect } from 'react'

// ** Config
import { getLanguageCdWithValue } from '@/configs/locales/locales'

// ** API
import AccountAPI from '@/@core/api/factoryAccount'
import { SignupInfo, SignupTypeResponseType } from '@/@core/api/type/account'

// ** hook
import { useLocale } from '@/@core/hooks/useLocal'

// ** service
import CountryCdService from '@/service/CountryCdService'
import StateCdService from '@/service/StateCdService'
import TellCountryCdService from './TellCountryCdService'
import CurrencyCdService from './CurrencyCdService'
import LanguageCdService from './LanguageCdService'
import CurrencyForPaymentService from './CurrencyForPaymentService'
import BookingMethodCdService from './BookingMethodCdService'
import { CURRENCY } from '@/@core/utils/constant'

export type SignupFormType = {
  Signup: SignupInfo
}

const SignupService = () => {
  const { GetMessage } = useLocale()

  const Form = useForm<SignupFormType>({
    mode: 'onChange',
    defaultValues: {
      Signup: {
        ShopName: '',
        TellCountryNoCd: '',
        BasicalCurrencyCd: '',
        BasicalLanguageCd: '',
        BookingMethodCd: '',
        IdentifyNumber: '',
        PaymentCurrencyCd: CURRENCY.JPY,
        TellNo: '',
        MapUrl: '',
        ShopUrl: '',
        ShopAdminPicEmailAddress: '',
        ShopAdminPicName: '',
        ShopAdminPicTellCountryCd: '',
        ShopAdminPicTellNo: '',
        CountryCd: '',
        StateCd: '',
        ConfirmPassword: '',
        Address1: '',
        Address2: '',
        Address3: '',
        Latitude: '',
        Longitude: '',
        Email: ''
      }
    }
  })
  const { locale } = useRouter()

  const { watch, reset } = Form
  const { countryCd, FetchCountryCd } = CountryCdService()
  const { stateCd, FetchStateCd } = StateCdService()
  const { tellCountryCd, FetchTellCountryCd } = TellCountryCdService()
  const { currencyCd, FetchCurrencyCd } = CurrencyCdService()
  const { languageCd, Init: LanguageInit } = LanguageCdService()
  const { currencyCd: cfpCurrencyCd, FetchCurrencyCd: cfpFetchCurrencyCd } = CurrencyForPaymentService()
  const { bookingMethod, FetchBookingMethodCd } = BookingMethodCdService()

  const watchCountry = watch(`Signup.CountryCd`)

  useEffect(() => {
    if (locale) {
      const language = getLanguageCdWithValue(locale)
      FetchCountryCd(language)
      FetchTellCountryCd(language)
      FetchCurrencyCd(language)
      LanguageInit()
      cfpFetchCurrencyCd(language)
      FetchBookingMethodCd(language)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [locale])

  useEffect(() => {
    if (locale) {
      const language = getLanguageCdWithValue(locale)
      FetchStateCd(language, String(watchCountry))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [watchCountry, locale])

  const Init = async () => {
    reset()
  }

  const CreateShop = async (): Promise<{ email: string; message: string }> => {
    const f = Form.getValues()
    let email = ''
    if (f.Signup) {
      if (f.Signup.ShopName != '') {
        const res = await AccountAPI.CreateShop(f.Signup)
        const data = res.data as SignupTypeResponseType
        if (res.status !== 200) {
          const message = GetMessage(res.status, data?.result_code, data?.message)

          return { email: email, message: message }
        }

        email = data.shop?.shop_admin_email_address ? data.shop?.shop_admin_email_address : ''
      }
    }

    return { email: email, message: '' }
  }

  return {
    Form,
    Init,
    countryCd,
    stateCd,
    tellCountryCd,
    currencyCd,
    languageCd,
    cfpCurrencyCd,
    bookingMethod,
    CreateShop
  }
}

export default SignupService
