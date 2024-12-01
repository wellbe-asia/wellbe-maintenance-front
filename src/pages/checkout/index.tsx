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
import CheckoutService from '@/service/CheckoutService'
import { dateFormatApi2DisplayYYYYMMDD, dateFormatHyphen2Hyphen } from '@/@core/utils/date'
import Link from 'next/link'
import ExportToolbar from '@/views/maintenance/ExportToolbar'

const CheckoutList = () => {
  const { t } = useLocale()
  const { locale } = useRouter()

  // ** States
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 })
  const [hideNameColumn, setHideNameColumn] = useState<GridColumnVisibilityModel>({ full_name: true })

  // ** Service
  const checkoutService = CheckoutService()

  useEffect(() => {
    checkoutService.GetCheckoutList()

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [locale])

  const columns: GridColDef[] = [
    {
      width: 300,
      field: 'id',
      headerName: t.SCREEN_COL_CHECKOUT_LIST_ID,
      valueGetter: params => new Date(params.value),
      renderCell: (params: GridRenderCellParams) => (
        <Typography variant='body2' sx={{ color: 'text.primary' }}>
          {params.row.id}
        </Typography>
      )
    },
    {
      width: 150,
      field: 'contract_execute_date',
      headerName: t.SCREEN_COL_CHECKOUT_LIST_BOOKING_DATE,
      renderCell: (params: GridRenderCellParams) => (
        <Typography variant='body2' sx={{ color: 'text.primary' }}>
          {dateFormatApi2DisplayYYYYMMDD(params.row.contract_execute_date)}
        </Typography>
      )
    },
    {
      width: 150,
      field: 'checkout_status_name',
      headerName: t.SCREEN_COL_CHECKOUT_LIST_STATUS,
      renderCell: (params: GridRenderCellParams) => (
        <Typography variant='body2' sx={{ color: 'text.primary' }}>
          {params.row.checkout_status_name}
        </Typography>
      )
    },
    {
      width: 150,
      field: 'checkout_amount',
      headerName: t.SCREEN_COL_CHECKOUT_LIST_CHECKOUT_AMOUNT,
      renderCell: (params: GridRenderCellParams) => (
        <Typography variant='body2' sx={{ color: 'text.primary' }}>
          {(Number(params.row.checkout_amount || '0') + Number(params.row.admin_fee_amount || '0')).toLocaleString()}
        </Typography>
      )
    },
    {
      width: 150,
      field: 'admin_fee_amount',
      headerName: t.SCREEN_COL_CHECKOUT_LIST_ADMIN_FEE,
      renderCell: (params: GridRenderCellParams) => (
        <Typography variant='body2' sx={{ color: 'text.primary' }}>
          {Number(params.row.admin_fee_amount || '0').toLocaleString()}
        </Typography>
      )
    },
    {
      width: 100,
      field: 'currency_cd_iso',
      headerName: t.SCREEN_COL_CHECKOUT_LIST_CURRENCY,
      renderCell: (params: GridRenderCellParams) => (
        <Typography variant='body2' sx={{ color: 'text.primary' }}>
          {params.row.currency_cd_iso}
        </Typography>
      )
    },
    {
      width: 180,
      field: 'booking_no',
      headerName: t.SCREEN_COL_CHECKOUT_LIST_BOOKING_NO,
      renderCell: (params: GridRenderCellParams) => (
        <Link href={`/booking/detail/${params.row.booking_no}`}>{params.row.booking_no}</Link>
      )
    },
    {
      width: 500,
      field: '',
      headerName: t.SCREEN_COL_CHECKOUT_LIST_MENU_NAME,
      renderCell: (params: GridRenderCellParams) => (
        <Typography variant='body2' sx={{ color: 'text.primary' }}>
          {params.row.menu}
        </Typography>
      )
    },
    {
      width: 300,
      field: 'shop_id',
      headerName: t.SCREEN_COL_CHECKOUT_LIST_SHOP_ID,
      renderCell: (params: GridRenderCellParams) => (
        <Typography variant='body2' sx={{ color: 'text.primary' }}>
          {params.row.shop_id}
        </Typography>
      )
    },
    {
      width: 150,
      field: 'shop_name',
      headerName: t.SCREEN_COL_CHECKOUT_LIST_SHOP_NAME,
      renderCell: (params: GridRenderCellParams) => (
        <Typography variant='body2' sx={{ color: 'text.primary' }}>
          {params.row.shop_name}
        </Typography>
      )
    },
    {
      width: 300,
      field: 'account_id',
      headerName: t.SCREEN_COL_CHECKOUT_LIST_ACCOUNT_ID,
      renderCell: (params: GridRenderCellParams) => (
        <Typography variant='body2' sx={{ color: 'text.primary' }}>
          {params.row.account_id}
        </Typography>
      )
    },
    {
      width: 150,
      field: 'account_name',
      headerName: t.SCREEN_COL_CHECKOUT_LIST_ACCOUNT_NAME,
      renderCell: (params: GridRenderCellParams) => (
        <Typography variant='body2' sx={{ color: 'text.primary' }}>
          {params.row.account_name}
        </Typography>
      )
    },
    {
      width: 150,
      field: 'checkout_actual_datetime',
      headerName: t.SCREEN_COL_CHECKOUT_LIST_CHECKOUT_ACTUAL_DATE,
      renderCell: (params: GridRenderCellParams) => (
        <Typography variant='body2' sx={{ color: 'text.primary' }}>
          {dateFormatHyphen2Hyphen(params.row.checkout_actual_datetime)}
        </Typography>
      )
    }
  ]

  return (
    <Card>
      <CardHeader title={t.SCREEN_TITLE_CHECKOUT_LIST} />
      <DataGrid
        autoHeight
        slots={{ toolbar: ExportToolbar }}
        rows={checkoutService.checkoutList}
        columns={columns}
        disableRowSelectionOnClick
        pageSizeOptions={[7, 10, 25, 50]}
        paginationModel={paginationModel}
        columnVisibilityModel={hideNameColumn}
        onPaginationModelChange={setPaginationModel}
        onColumnVisibilityModelChange={newValue => setHideNameColumn(newValue)}
      />
      <Backdrop sx={{ color: '#fff', zIndex: theme => theme.zIndex.drawer + 1 }} open={checkoutService.loading}>
        <CircularProgress color='inherit' />
      </Backdrop>
    </Card>
  )
}

export default CheckoutList
