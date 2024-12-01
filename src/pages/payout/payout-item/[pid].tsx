// ** React Imports
import { useEffect, useState } from 'react'

// ** Hook
import { useLocale } from '@/@core/hooks/useLocal'
import Head from 'next/head'

// ** MUI Imports
import Card from '@mui/material/Card'
import Typography from '@mui/material/Typography'
import CardHeader from '@mui/material/CardHeader'
import { Backdrop, CircularProgress } from '@mui/material'
import { DataGrid, GridColDef, GridColumnVisibilityModel, GridRenderCellParams } from '@mui/x-data-grid'
import ExportToolbar from 'src/views/maintenance/ExportToolbar'

// ** Data Import
import { useRouter } from 'next/router'
import { dateFormatApi2DisplayYYYYMMDD } from '@/@core/utils/date'
import PayoutItemService from '@/service/PayoutItemService'
import Link from 'next/link'

const PayoutList = () => {
  const { t, locale } = useLocale()
  const router = useRouter()
  const { pid, title } = router.query
  const payoutId = pid && [pid].flat(1).length > 0 ? [pid].flat(1)[0] : ''
  const titleMeta = title && [title].flat(1).length > 0 ? [title].flat(1)[0] : ''

  // ** States
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 100 })
  const [hideNameColumn, setHideNameColumn] = useState<GridColumnVisibilityModel>({ full_name: true })

  // ** Service
  const payoutItemService = PayoutItemService()

  useEffect(() => {
    if (payoutId) {
      payoutItemService.GetPayoutItemList(payoutId)
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [payoutId, locale])

  const columns: GridColDef[] = [
    {
      width: 300,
      field: 'id',
      headerName: t.SCREEN_COL_PAYOUT_ITEM_LIST_ID,
      renderCell: (params: GridRenderCellParams) => (
        <Typography variant='body2' sx={{ color: 'text.primary' }}>
          {params.row.id}
        </Typography>
      )
    },
    {
      minWidth: 390,
      field: 'content',
      headerName: t.SCREEN_COL_PAYOUT_ITEM_LIST_CONTENT,
      renderCell: (params: GridRenderCellParams) => (
        <Typography variant='body2' sx={{ color: 'text.primary' }}>
          {params.row.content}
        </Typography>
      )
    },
    {
      minWidth: 170,
      field: 'booking_no',
      headerName: t.SCREEN_COL_PAYOUT_ITEM_LIST_BOOKING_NO,
      renderCell: (params: GridRenderCellParams) => (
        <Link href={`/booking/detail/${params.row.booking_no}`}>{params.row.booking_no}</Link>
      )
    },
    {
      width: 150,
      field: 'amount',
      headerName: t.SCREEN_COL_PAYOUT_ITEM_LIST_AMOUNT,
      valueGetter: params => Number(params.value || '0').toLocaleString(),
      renderCell: (params: GridRenderCellParams) => (
        <Typography variant='body2' sx={{ color: 'text.primary' }}>
          {Number(params.row.amount || '0').toLocaleString()}
        </Typography>
      )
    },
    {
      width: 150,
      field: 'wellbe_fee_amount',
      headerName: t.SCREEN_COL_PAYOUT_ITEM_LIST_WELLBE_FEE,
      valueGetter: params => Number(params.value || '0').toLocaleString(),
      renderCell: (params: GridRenderCellParams) => (
        <Typography variant='body2' sx={{ color: 'text.primary' }}>
          {Number(params.row.wellbe_fee_amount || '0').toLocaleString()}
        </Typography>
      )
    },
    {
      width: 50,
      field: 'payout_item_currency_cd_iso',
      headerName: t.SCREEN_COL_PAYOUT_ITEM_LIST_CURRENCY,
      renderCell: (params: GridRenderCellParams) => (
        <Typography variant='body2' sx={{ color: 'text.primary' }}>
          {params.row.payout_item_currency_cd_iso}
        </Typography>
      )
    },
    {
      width: 120,
      field: 'booking_date',
      headerName: t.SCREEN_COL_PAYOUT_ITEM_LIST_BOOKING_DATE,
      valueGetter: params => dateFormatApi2DisplayYYYYMMDD(params.row.booking_date),
      renderCell: (params: GridRenderCellParams) => (
        <Typography variant='body2' sx={{ color: 'text.primary' }}>
          {dateFormatApi2DisplayYYYYMMDD(params.row.booking_date)}
        </Typography>
      )
    },
    {
      width: 150,
      field: 'cancel_datetime',
      headerName: t.SCREEN_COL_PAYOUT_ITEM_LIST_CANCEL_DATE,
      renderCell: (params: GridRenderCellParams) => (
        <Typography variant='body2' sx={{ color: 'text.primary' }}>
          {params.row.cancel_datetime}
        </Typography>
      )
    },
    {
      width: 180,
      field: 'account_name',
      headerName: t.SCREEN_COL_PAYOUT_ITEM_LIST_ACCOUNT_NAME,
      renderCell: (params: GridRenderCellParams) => (
        <Typography variant='body2' sx={{ color: 'text.primary' }}>
          {params.row.account_name}
        </Typography>
      )
    },
    {
      width: 500,
      field: 'booking_menu',
      headerName: t.SCREEN_COL_PAYOUT_ITEM_LIST_BOOKING_MENU,
      renderCell: (params: GridRenderCellParams) => (
        <Typography variant='body2' sx={{ color: 'text.primary' }}>
          {params.row.booking_menu}
        </Typography>
      )
    },
    {
      width: 150,
      field: 'booking_amount',
      headerName: t.SCREEN_COL_PAYOUT_ITEM_LIST_BOOKING_AMOUNT_SUMMARY,
      valueGetter: params => Number(params.value || '0').toLocaleString(),
      renderCell: (params: GridRenderCellParams) => (
        <Typography variant='body2' sx={{ color: 'text.primary' }}>
          {Number(params.row.booking_amount || '0').toLocaleString()}
        </Typography>
      )
    },
    {
      width: 150,
      field: 'exchange_rate',
      headerName: t.SCREEN_COL_PAYOUT_ITEM_LIST_BOOKING_AMOUNT_EXCHANGE_RATE,
      valueGetter: params => Number(params.value || '0').toLocaleString(),
      renderCell: (params: GridRenderCellParams) => (
        <Typography variant='body2' sx={{ color: 'text.primary' }}>
          {Number(params.row.exchange_rate || '0').toLocaleString()}
        </Typography>
      )
    },
    {
      width: 100,
      field: 'exchange_paire',
      headerName: t.SCREEN_COL_PAYOUT_ITEM_LIST_BOOKING_AMOUNT_EXCHANGE_PAIRE,
      renderCell: (params: GridRenderCellParams) => (
        <Typography variant='body2' sx={{ color: 'text.primary' }}>
          {params.row.exchange_paire}
        </Typography>
      )
    }
  ]

  return (
    <Card>
      <Head>
        <title>{titleMeta}</title>
      </Head>
      <CardHeader title={t.SCREEN_TITLE_PAYOUT_ITEM_LIST} />
      <DataGrid
        autoHeight
        rows={payoutItemService.payoutList}
        columns={columns}
        slots={{ toolbar: ExportToolbar }}
        disableRowSelectionOnClick
        pageSizeOptions={[7, 10, 25, 50]}
        paginationModel={paginationModel}
        columnVisibilityModel={hideNameColumn}
        onPaginationModelChange={setPaginationModel}
        onColumnVisibilityModelChange={newValue => setHideNameColumn(newValue)}
        initialState={{
          columns: {
            columnVisibilityModel: {}
          }
        }}
      />
      <Backdrop sx={{ color: '#fff', zIndex: theme => theme.zIndex.drawer + 1 }} open={payoutItemService.loading}>
        <CircularProgress color='inherit' />
      </Backdrop>
    </Card>
  )
}

export default PayoutList
