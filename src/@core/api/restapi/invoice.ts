import axios from '@/@core/api/BaseAxios'
import { InvoiceResponseType } from '../type/invoice'

const InvoiceAPI = {
  getInvoiceFilter: async (
    shopId: string,
    languageCd: string
  ): Promise<{ status: number; data: InvoiceResponseType }> => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_SERVER_PAYMENT_URL}/payment/invoice/filter?shop_id=${shopId}&language_cd=${languageCd}`,
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
  createInvoice: async (
    shopId: string,
    invoiceDate: string,
    closingDate: string
  ): Promise<{ status: number; data: InvoiceResponseType }> => {
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER_PAYMENT_URL}/payment/batch/invoice/create`,
        JSON.stringify({ shop_id: shopId, invoice_date: invoiceDate, invoice_closing_date: closingDate }),
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
  craime: async (invoiceId: string): Promise<{ status: number; data: InvoiceResponseType }> => {
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER_PAYMENT_URL}/payment/invoice/craime`,
        JSON.stringify({ invoice_id: invoiceId }),
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
  deposit: async (invoiceId: string): Promise<{ status: number; data: InvoiceResponseType }> => {
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER_PAYMENT_URL}/payment/invoice/deposit`,
        JSON.stringify({ invoice_id: invoiceId }),
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
  withdraw: async (invoiceId: string): Promise<{ status: number; data: InvoiceResponseType }> => {
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER_PAYMENT_URL}/payment/invoice/withdraw`,
        JSON.stringify({ invoice_id: invoiceId }),
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

export default InvoiceAPI
