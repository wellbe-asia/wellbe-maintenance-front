// ** React Imports
import { useEffect, useState } from 'react'

// ** Hook
import { useLocale } from '@/@core/hooks/useLocal'

// ** MUI Imports
import Card from '@mui/material/Card'
import Typography from '@mui/material/Typography'
import CardHeader from '@mui/material/CardHeader'
import { Backdrop, CircularProgress } from '@mui/material'
import { DataGrid, GridColDef, GridColumnVisibilityModel, GridRenderCellParams } from '@mui/x-data-grid'

// ** Data Import
import { useRouter } from 'next/router'
import BookingService from '@/service/BookingService'
import Link from 'next/link'
import { getLanguageCdWithValue } from '@/configs/locales/locales'
import { DEFAULT_LANGUAGE } from '@/@core/utils/constant'
import ExportToolbar from '@/views/maintenance/ExportToolbar'

const BookingList = () => {
  const { t } = useLocale()
  const { locale } = useRouter()

  // ** States
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 })
  const [hideNameColumn, setHideNameColumn] = useState<GridColumnVisibilityModel>({ full_name: true })

  // ** Service
  const bookingService = BookingService()

  useEffect(() => {
    const varLanguageCd = getLanguageCdWithValue(locale || DEFAULT_LANGUAGE)
    if (varLanguageCd) {
      console.log(varLanguageCd)
      bookingService.GetBookingList(varLanguageCd)
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [locale])

  const columns: GridColDef[] = [
    {
      width: 180,
      field: 'bookingNo',
      headerName: t.SCREEN_COL_BOOKING_LIST_BOOKING_NO,
      renderCell: (params: GridRenderCellParams) => (
        <Link href={`/booking/detail/${params.row.bookingNo}`}>{params.row.bookingNo}</Link>
      )
    },
    {
      width: 180,
      field: 'bookingDatetime',
      headerName: t.SCREEN_COL_BOOKING_LIST_BOOKING_DATETIME,
      renderCell: (params: GridRenderCellParams) => (
        <Typography variant='body2' sx={{ color: 'text.primary' }}>
          {params.row.bookingDatetime}
        </Typography>
      )
    },
    {
      width: 150,
      field: 'bookingStatusName',
      headerName: t.SCREEN_COL_BOOKING_LIST_STATUS,
      renderCell: (params: GridRenderCellParams) => (
        <Typography variant='body2' sx={{ color: 'text.primary' }}>
          {params.row.bookingStatusName}
        </Typography>
      )
    },
    {
      width: 150,
      field: 'checkoutStatusName',
      headerName: t.SCREEN_COL_BOOKING_LIST_CHECKOUT_STATUS,
      renderCell: (params: GridRenderCellParams) => (
        <Typography variant='body2' sx={{ color: 'text.primary' }}>
          {params.row.checkoutStatusName}
        </Typography>
      )
    },
    {
      width: 150,
      field: 'bookingAmountBasicalCurrencyBase',
      headerName: t.SCREEN_COL_BOOKING_LIST_BOOKING_AMOUNT,
      renderCell: (params: GridRenderCellParams) => (
        <Typography variant='body2' sx={{ color: 'text.primary' }}>
          {params.row.bookingAmountBasicalCurrencyBase}
        </Typography>
      )
    },
    {
      width: 150,
      field: 'adminFeeBasicalCurrencyBase',
      headerName: t.SCREEN_COL_BOOKING_LIST_ADMIN_FEE,
      renderCell: (params: GridRenderCellParams) => (
        <Typography variant='body2' sx={{ color: 'text.primary' }}>
          {params.row.adminFeeBasicalCurrencyBase}
        </Typography>
      )
    },
    {
      width: 100,
      field: 'basicalCurrencyCdIso',
      headerName: t.SCREEN_COL_BOOKING_LIST_BASE_CURRENCY,
      renderCell: (params: GridRenderCellParams) => (
        <Typography variant='body2' sx={{ color: 'text.primary' }}>
          {params.row.basicalCurrencyCdIso}
        </Typography>
      )
    },
    {
      width: 150,
      field: 'bookingAmountPaymentCurrencyBase',
      headerName: t.SCREEN_COL_BOOKING_LIST_BOOKING_AMOUNT_PAYMENT,
      renderCell: (params: GridRenderCellParams) => (
        <Typography variant='body2' sx={{ color: 'text.primary' }}>
          {params.row.bookingAmountPaymentCurrencyBase}
        </Typography>
      )
    },
    {
      width: 150,
      field: 'adminFeePaymentCurrencyBase',
      headerName: t.SCREEN_COL_BOOKING_LIST_ADMIN_FEE_PAYMENT,
      renderCell: (params: GridRenderCellParams) => (
        <Typography variant='body2' sx={{ color: 'text.primary' }}>
          {params.row.adminFeePaymentCurrencyBase}
        </Typography>
      )
    },
    {
      width: 100,
      field: 'paymentCurrencyCdIso',
      headerName: t.SCREEN_COL_BOOKING_LIST_PAYMENT_CURRENCY,
      renderCell: (params: GridRenderCellParams) => (
        <Typography variant='body2' sx={{ color: 'text.primary' }}>
          {params.row.paymentCurrencyCdIso}
        </Typography>
      )
    },
    {
      width: 300,
      field: 'shopId',
      headerName: t.SCREEN_COL_BOOKING_LIST_SHOP_ID,
      renderCell: (params: GridRenderCellParams) => (
        <Typography variant='body2' sx={{ color: 'text.primary' }}>
          {params.row.shopId}
        </Typography>
      )
    },
    {
      width: 150,
      field: 'shopName',
      headerName: t.SCREEN_COL_BOOKING_LIST_SHOP_NAME,
      renderCell: (params: GridRenderCellParams) => (
        <Typography variant='body2' sx={{ color: 'text.primary' }}>
          {params.row.shopName}
        </Typography>
      )
    },
    {
      width: 180,
      field: 'createDateTimeJst',
      headerName: t.SCREEN_COL_BOOKING_LIST_CREATE_DATETIME_JST,
      renderCell: (params: GridRenderCellParams) => (
        <Typography variant='body2' sx={{ color: 'text.primary' }}>
          {params.row.createDateTimeJst}
        </Typography>
      )
    },
    {
      width: 180,
      field: 'requestAproveDueDateTimeJst',
      headerName: t.SCREEN_COL_BOOKING_LIST_APPROVE_DUE_DATETIME_JST,
      renderCell: (params: GridRenderCellParams) => (
        <Typography variant='body2' sx={{ color: 'text.primary' }}>
          {params.row.requestAproveDueDateTimeJst}
        </Typography>
      )
    },
    {
      width: 180,
      field: 'checkoutDueDateTimeJst',
      headerName: t.SCREEN_COL_BOOKING_LIST_CHECKOUT_DUE_DATETIME_JST,
      renderCell: (params: GridRenderCellParams) => (
        <Typography variant='body2' sx={{ color: 'text.primary' }}>
          {params.row.checkoutDueDateTimeJst}
        </Typography>
      )
    },
    {
      width: 180,
      field: 'bookingDateTimeJst',
      headerName: t.SCREEN_COL_BOOKING_LIST_BOOKING_DATETIME_JST,
      renderCell: (params: GridRenderCellParams) => (
        <Typography variant='body2' sx={{ color: 'text.primary' }}>
          {params.row.bookingDateTimeJst}
        </Typography>
      )
    },
    {
      width: 180,
      field: 'cancelDateTimeJst',
      headerName: t.SCREEN_COL_BOOKING_LIST_CANCEL_DATETIME_JST,
      renderCell: (params: GridRenderCellParams) => (
        <Typography variant='body2' sx={{ color: 'text.primary' }}>
          {params.row.cancelDateTimeJst}
        </Typography>
      )
    }
  ]

  return (
    <Card>
      <CardHeader title={t.SCREEN_TITLE_BOOKING_LIST} />
      <DataGrid
        autoHeight
        slots={{ toolbar: ExportToolbar }}
        rows={bookingService.bookings}
        columns={columns}
        disableRowSelectionOnClick
        pageSizeOptions={[7, 10, 25, 50]}
        paginationModel={paginationModel}
        columnVisibilityModel={hideNameColumn}
        onPaginationModelChange={setPaginationModel}
        onColumnVisibilityModelChange={newValue => setHideNameColumn(newValue)}
      />
      <Backdrop sx={{ color: '#fff', zIndex: theme => theme.zIndex.drawer + 1 }} open={bookingService.loading}>
        <CircularProgress color='inherit' />
      </Backdrop>
    </Card>
  )
}

export default BookingList
