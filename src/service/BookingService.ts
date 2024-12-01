import { useState } from 'react'

// ** API
import BookingAPI from '@/@core/api/factoryBooking'
import { BookingMenuType, BookingRequestCandidate, BookingResponseGetType, BookingType } from '@/@core/api/type/booking'

const BookingService = () => {
  const [bookings, setBookings] = useState<BookingType[]>([])
  const [loading, setLoading] = useState(false)

  const GetBookingList = async (languageCd: string): Promise<{ data: BookingType[] | null }> => {
    setLoading(true)
    try {
      const { data } = await BookingAPI.GetBookingList(languageCd)
      const varBookings = [] as BookingType[]
      if (data && data?.bookings) {
        for (const b of data.bookings) {
          varBookings.push(setBookingFromApi(b))
        }
      }
      setBookings(varBookings)

      return { data: varBookings }
    } finally {
      setLoading(false)
    }

    return { data: null }
  }

  const GetProxyBookingList = async (languageCd: string): Promise<{ data: BookingType[] | null }> => {
    setLoading(true)
    try {
      const { data } = await BookingAPI.GetProxyBookingList(languageCd)
      const varBookings = [] as BookingType[]
      if (data && data?.bookings) {
        for (const b of data.bookings) {
          varBookings.push(setBookingFromApi(b))
        }
      }
      setBookings(varBookings)

      return { data: varBookings }
    } finally {
      setLoading(false)
    }

    return { data: null }
  }

  const GetBooking = async (bookingNo: string, languageCd: string): Promise<{ data: BookingType | null }> => {
    setLoading(true)
    try {
      const { data } = await BookingAPI.GetBookingBookingNo(languageCd, bookingNo)
      setBookings([])
      if (data && data?.booking) {
        setBookings([setBookingFromApi(data.booking)])

        return { data: setBookingFromApi(data.booking) }
      }
    } finally {
      setLoading(false)
    }

    return { data: null }
  }

  const setBookingFromApi = (v: BookingResponseGetType): BookingType => {
    const bookingMenues = [] as BookingMenuType[]
    const bookingRequestCandidates = [] as BookingRequestCandidate[]
    const firstPriorityRequestCandidates = [] as BookingRequestCandidate[]
    const secondPriorityRequestCandidates = [] as BookingRequestCandidate[]
    const thirdPriorityRequestCandidates = [] as BookingRequestCandidate[]
    v.booking_menues?.map(m => {
      bookingMenues.push({
        id: m.id,
        bookingMenuId: m.booking_menu_id,
        treatmentTime: String(m.treatment_time),
        prepareTime: String(m.prepare_time),
        currencyCd: String(m.currency_cd),
        amount: m.amount?.toLocaleString(),
        currencyName: m.currency_name,
        currencyCdIso: m.currency_cd_iso,
        menuName: m.menu_name,
        menuDescription: m.menu_description,
        numberOfFemale: String(m.number_of_female),
        numberOfMale: String(m.number_of_male)
      })
    })

    v.booking_request_candidates?.map(m => {
      bookingRequestCandidates.push({
        id: m.id,
        bookingPriority: m.booking_priority,
        priority: m.priority,
        bookingRequestDate: m.booking_request_date,
        bookingRequestTimeStart: m.booking_request_time_start,
        bookingRequestTimeEnd: m.booking_request_time_end
      })
    })

    v.first_priority_request_candidates?.map(m => {
      firstPriorityRequestCandidates.push({
        id: m.id,
        bookingPriority: m.booking_priority,
        priority: m.priority,
        bookingRequestDate: m.booking_request_date,
        bookingRequestTimeStart: m.booking_request_time_start,
        bookingRequestTimeEnd: m.booking_request_time_end
      })
    })

    v.second_priority_request_candidates?.map(m => {
      secondPriorityRequestCandidates.push({
        id: m.id,
        bookingPriority: m.booking_priority,
        priority: m.priority,
        bookingRequestDate: m.booking_request_date,
        bookingRequestTimeStart: m.booking_request_time_start,
        bookingRequestTimeEnd: m.booking_request_time_end
      })
    })

    v.third_priority_request_candidates?.map(m => {
      thirdPriorityRequestCandidates.push({
        id: m.id,
        bookingPriority: m.booking_priority,
        priority: m.priority,
        bookingRequestDate: m.booking_request_date,
        bookingRequestTimeStart: m.booking_request_time_start,
        bookingRequestTimeEnd: m.booking_request_time_end
      })
    })

    return {
      id: v.id,
      bookingNo: v.booking_no,
      shopId: v.shop_id,
      accountId: v.account_id,
      bookingStatusCd: String(v.booking_status_cd),
      dateOfBooking: v.date_of_booking,
      timeOfBooking: v.time_of_booking,
      bookingDatetime: v.booking_datetime,
      bookingDatetimeUtc: v.booking_datetime_utc,
      request: v.request,
      cancelDatetime: v.cancel_datetime,
      basicalCurrencyCd: String(v.basical_currency_cd),
      bookingAmountBasicalCurrencyBase: v.booking_amount_basical_currency_base?.toLocaleString(),
      adminFeeBasicalCurrencyBase: v.admin_fee_basical_currency_base?.toLocaleString(),
      paymentCurrencyCd: String(v.payment_currency_cd),
      bookingAmountPaymentCurrencyBase: v.booking_amount_payment_currency_base?.toLocaleString(),
      adminFeePaymentCurrencyBase: v.admin_fee_payment_currency_base?.toLocaleString(),
      checkoutDueDatetime: v.checkout_due_datetime,
      checkoutDueDatetimeUtc: v.checkout_due_datetime_utc,
      shopName: v.shop_name,
      countryCd: String(v.country_cd),
      countryName: v.country_name,
      stateCd: String(v.state_cd),
      stateName: v.state_name,
      address1: v.address1,
      address2: v.address2,
      address3: v.address3,
      latitude: v.latitude,
      longitude: v.longitude,
      mapUrl: v.map_url,
      bookingStatusName: v.booking_status_name,
      basicalCurrencyName: v.basical_currency_name,
      basicalCurrencyCdIso: v.basical_currency_cd_iso,
      paymentCurrencyName: v.payment_currency_name,
      paymentCurrencyCdIso: v.payment_currency_cd_iso,
      totalPerson: String(v.total_person),
      numberOfFemale: String(v.number_of_female),
      numberOfMale: String(v.number_of_male),
      internationalTellNo: v.international_tell_no,
      shopEmailAddress: v.shop_email_address,
      shopTellCountryNoCd: String(v.shop_tell_country_no_cd),
      shopTellNo: v.shop_tell_no,
      tellCountryName: v.tell_country_name,
      tellCountryNo: v.tell_country_no,
      shopImagePath: v.shop_image_path,
      shopImageAlt: v.shop_image_alt,
      shopImageDescription: v.shop_image_description,
      totalAmountBasicalCurrencyBase: v.total_amount_basical_currency_base?.toLocaleString(),
      totalAmountPaymentCurrencyBase: v.total_amount_payment_currency_base?.toLocaleString(),
      checkoutStatusCd: String(v.checkout_status_cd),
      checkoutStatusName: v.checkout_status_name,
      canCancel: v.can_cancel,
      bookingDateTimeJst: v.booking_date_time_jst,
      cancelDateTimeJst: v.cancel_date_time_jst,
      checkoutDueDateTimeJst: v.checkout_due_date_time_jst,
      createDateTimeJst: v.create_date_time_jst,
      requestAproveDueDateTimeJst: v.request_aprove_due_date_time_jst,
      bookingMenues: bookingMenues,
      bookingRequestCandidates: bookingRequestCandidates,
      firstPriorityRequestCandidates: firstPriorityRequestCandidates,
      secondPriorityRequestCandidates: secondPriorityRequestCandidates,
      thirdPriorityRequestCandidates: thirdPriorityRequestCandidates
    }
  }

  return {
    GetBooking,
    GetBookingList,
    GetProxyBookingList,
    bookings,
    loading
  }
}

export default BookingService
