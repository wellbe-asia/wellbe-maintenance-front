import axios from '@/@core/api/BaseAxios'
import { InvoiceItemResponseType } from '../type/invoiceItem'

const InvoiceItemAPI = {
  getInvoiceItemFilter: async (
    invoiceId: string,
    languageCd: string
  ): Promise<{ status: number; data: InvoiceItemResponseType }> => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_SERVER_PAYMENT_URL}/payment/invoice_item/filter?invoice_id=${invoiceId}&language_cd=${languageCd}`,
        {
          headers: {
            'Content-Type': 'application/json',
            Wellbe_Apikey: process.env.NEXT_PUBLIC_API_KEY_PAYMENT_MAINTENANCE
          }
        }
      )

      return response
    } catch (error: any) {
      return error
    }
  },
  delete: async (id: string): Promise<{ status: number; data: InvoiceItemResponseType }> => {
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER_PAYMENT_URL}/payment/invoice_item/delete`,
        JSON.stringify({ id: id }),
        {
          headers: {
            'Content-Type': 'application/json',
            Wellbe_Apikey: process.env.NEXT_PUBLIC_API_KEY_PAYMENT_MAINTENANCE
          }
        }
      )

      return response
    } catch (error: any) {
      return error
    }
  }
}

export default InvoiceItemAPI
