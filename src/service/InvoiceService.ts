import { useState } from 'react'

// ** Config
import { useRouter } from 'next/router'
import { getLanguageCdWithValue } from '@/configs/locales/locales'

// ** hook
import { DEFAULT_LANGUAGE, SERVER_STATUS } from '@/@core/utils/constant'
import { useLocale } from '@/@core/hooks/useLocal'

// ** service
import InvoiceAPI from '@/@core/api/factoryInvoice'
import { InvoiceResponseGetType } from '@/@core/api/type/invoice'

const InvoiceService = () => {
  const { GetMessage } = useLocale()

  const [loading, setLoading] = useState(false)
  const [invoiceList, setInvoiceList] = useState<InvoiceResponseGetType[]>([])

  const { locale } = useRouter()

  const GetInvoiceList = async (): Promise<{ message: string }> => {
    try {
      setLoading(true)
      const language = getLanguageCdWithValue(locale || DEFAULT_LANGUAGE)
      const res = await InvoiceAPI.getInvoiceFilter('', language)
      if (res.status != 200) {
        const message = GetMessage(
          res.status,
          res.data?.result_code || SERVER_STATUS.SEVERERROR,
          res.data?.message || ''
        )

        setInvoiceList([])

        return { message: message }
      }
      setInvoiceList(res.data.invoices || [])

      return { message: '' }
    } finally {
      setLoading(false)
    }
  }

  const CreateInvoice = async (
    shopId: string,
    invoiceDate: string,
    closingDate: string
  ): Promise<{ message: string }> => {
    try {
      setLoading(true)
      const res = await InvoiceAPI.createInvoice(shopId, invoiceDate, closingDate)
      if (res.status != 200) {
        const message = GetMessage(
          res.status,
          res.data?.result_code || SERVER_STATUS.SEVERERROR,
          res.data?.message || ''
        )

        return { message: message }
      }

      return { message: '' }
    } finally {
      setLoading(false)
    }
  }

  const CraimeInvoice = async (invoiceId: string): Promise<{ message: string }> => {
    try {
      setLoading(true)
      const res = await InvoiceAPI.craime(invoiceId)
      if (res.status != 200) {
        const message = GetMessage(
          res.status,
          res.data?.result_code || SERVER_STATUS.SEVERERROR,
          res.data?.message || ''
        )

        return { message: message }
      }

      return { message: '' }
    } finally {
      setLoading(false)
    }
  }

  const DepoisitInvoice = async (invoiceId: string): Promise<{ message: string }> => {
    try {
      setLoading(true)
      const res = await InvoiceAPI.deposit(invoiceId)
      if (res.status != 200) {
        const message = GetMessage(
          res.status,
          res.data?.result_code || SERVER_STATUS.SEVERERROR,
          res.data?.message || ''
        )

        return { message: message }
      }

      return { message: '' }
    } finally {
      setLoading(false)
    }
  }

  const WithdrawInvoice = async (invoiceId: string): Promise<{ message: string }> => {
    try {
      setLoading(true)
      const res = await InvoiceAPI.withdraw(invoiceId)
      if (res.status != 200) {
        const message = GetMessage(
          res.status,
          res.data?.result_code || SERVER_STATUS.SEVERERROR,
          res.data?.message || ''
        )

        return { message: message }
      }

      return { message: '' }
    } finally {
      setLoading(false)
    }
  }

  return {
    invoiceList,
    GetInvoiceList,
    CreateInvoice,
    CraimeInvoice,
    DepoisitInvoice,
    WithdrawInvoice,
    loading
  }
}

export default InvoiceService
