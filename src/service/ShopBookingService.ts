// ** hook
import { useLocale } from '@/@core/hooks/useLocal'

// ** API
import ShopBookingAPI from '@/@core/api/factoryShopBooking'

// ** config
import { SERVER_STATUS } from '@/@core/utils/constant'

const ShopBookingService = () => {
  const { GetMessage } = useLocale()

  const Approve = async (
    bookingId: string,
    dateOfBooking: string,
    timeOfBooking: string
  ): Promise<{ message: string }> => {
    const res = await ShopBookingAPI.ApprovalBooking(bookingId, dateOfBooking, timeOfBooking)
    if (res.status != 200) {
      const message = GetMessage(res.status, res.data?.result_code || SERVER_STATUS.SEVERERROR, res.data?.message || '')

      return { message }
    }

    return { message: '' }
  }

  const Reschedule = async (
    bookingId: string,
    dateOfBooking: string,
    timeOfBooking: string
  ): Promise<{ message: string }> => {
    const res = await ShopBookingAPI.RescheduleBooking(bookingId, dateOfBooking, timeOfBooking)
    if (res.status != 200) {
      const message = GetMessage(res.status, res.data?.result_code || SERVER_STATUS.SEVERERROR, res.data?.message || '')

      return { message }
    }

    return { message: '' }
  }

  const Cancel = async (bookingId: string, cancelReason: string): Promise<{ message: string }> => {
    const res = await ShopBookingAPI.CancelShopBookingByShop(bookingId, cancelReason)
    if (res.status != 200) {
      const message = GetMessage(res.status, res.data?.result_code || SERVER_STATUS.SEVERERROR, res.data?.message || '')

      return { message }
    }

    return { message: '' }
  }

  return {
    Approve,
    Reschedule,
    Cancel
  }
}

export default ShopBookingService
