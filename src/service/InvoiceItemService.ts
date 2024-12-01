import { useState } from 'react'

// ** Config
import { useRouter } from 'next/router'
import { getLanguageCdWithValue } from '@/configs/locales/locales'

// ** hook
import { DEFAULT_LANGUAGE, SERVER_STATUS } from '@/@core/utils/constant'
import { useLocale } from '@/@core/hooks/useLocal'

// ** service
import InvoiceItemAPI from '@/@core/api/factoryInvoiceItem'
import { InvoiceItemResponseGetType } from '@/@core/api/type/invoiceItem'

const InvoiceItemService = () => {
  const { GetMessage } = useLocale()

  const [loading, setLoading] = useState(false)
  const [invoiceList, setInvoiceList] = useState<InvoiceItemResponseGetType[]>([])

  const { locale } = useRouter()

  const GetInvoiceItemList = async (invoiceId: string): Promise<{ message: string }> => {
    try {
      setLoading(true)
      const language = getLanguageCdWithValue(locale || DEFAULT_LANGUAGE)
      const res = await InvoiceItemAPI.getInvoiceItemFilter(invoiceId, language)
      if (res.status != 200) {
        const message = GetMessage(
          res.status,
          res.data?.result_code || SERVER_STATUS.SEVERERROR,
          res.data?.message || ''
        )

        setInvoiceList([])

        return { message: message }
      }
      setInvoiceList(res.data.invoice_items || [])

      return { message: '' }
    } finally {
      setLoading(false)
    }
  }

  const DeleteInvoiceItem = async (id: string): Promise<{ message: string }> => {
    try {
      setLoading(true)
      const res = await InvoiceItemAPI.delete(id)
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
    GetInvoiceItemList,
    DeleteInvoiceItem,
    loading
  }
}

export default InvoiceItemService
