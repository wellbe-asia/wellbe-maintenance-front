import { useState } from 'react'
import CBookingMethodAPI from '@/@core/api/factoryCBookingMethod'
import { BookingMethodType } from '@/@core/api/type/cBookingMethod'

const BookingMethodCdService = () => {
  const [bookingMethod, setBookingMethodCd] = useState([] as BookingMethodType[])
  const FetchBookingMethodCd = async (language: string) => {
    const { data } = await CBookingMethodAPI.GetCBookingMethod(Number(language))
    if (data?.c_booking_methods) {
      setBookingMethodCd(data.c_booking_methods)
    }
  }

  return { bookingMethod, setBookingMethodCd, FetchBookingMethodCd }
}

export default BookingMethodCdService
