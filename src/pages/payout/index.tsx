// ** React Imports
import { useEffect, useState } from 'react'

// ** Hook
import { useLocale } from '@/@core/hooks/useLocal'

// ** MUI Imports
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import Typography from '@mui/material/Typography'
import CardHeader from '@mui/material/CardHeader'
import { Backdrop, CircularProgress } from '@mui/material'
import { DataGrid, GridColDef, GridColumnVisibilityModel, GridRenderCellParams } from '@mui/x-data-grid'
import { GridToolbarExport } from '@mui/x-data-grid'

// ** Data Import
import { useRouter } from 'next/router'
import { dateFormatApi2DisplayYYYYMMDD } from '@/@core/utils/date'
import PayoutService from '@/service/PayoutService'
import Link from 'next/link'
import toast from 'react-hot-toast'

const PayoutList = () => {
  const { t } = useLocale()
  const { locale } = useRouter()

  // ** States
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 })
  const [hideNameColumn, setHideNameColumn] = useState<GridColumnVisibilityModel>({ full_name: true })
  const [selectedRowIds, setSelectedRowIds] = useState<string[]>([])

  // ** Service
  const payoutService = PayoutService()

  useEffect(() => {
    payoutService.GetPayoutList()

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [locale])

  const handleDownloadNotification = async () => {
    const result = await payoutService.DownloadPayoutNotification(selectedRowIds)
    if (result.message) {
      toast.error(result.message)
    } else {
      toast.success('ダウンロードを開始しました。')
    }
  }

  const columns: GridColDef[] = [
    {
      flex: 1,
      minWidth: 2,
      field: 'id',
      headerName: t.SCREEN_COL_PAYOUT_LIST_ID,
      valueGetter: params => new Date(params.value),
      renderCell: (params: GridRenderCellParams) => (
        <Typography variant='body2' sx={{ color: 'text.primary' }}>
          <Link
            href={`/payout/payout-item/${params.row.id}?title=${
              params.row.payout_shop_name
            }_${dateFormatApi2DisplayYYYYMMDD(params.row.payout_date)}`}
          >
            {params.row.id}
          </Link>
        </Typography>
      )
    },
    {
      flex: 0.7,
      width: 1,
      field: 'payout_date',
      headerName: t.SCREEN_COL_PAYOUT_LIST_DATE,
      renderCell: (params: GridRenderCellParams) => (
        <Typography variant='body2' sx={{ color: 'text.primary' }}>
          {dateFormatApi2DisplayYYYYMMDD(params.row.payout_date)}
        </Typography>
      )
    },
    {
      flex: 0.4,
      minWidth: 1,
      field: 'payout_status_name',
      headerName: t.SCREEN_COL_PAYOUT_LIST_STATUS,
      renderCell: (params: GridRenderCellParams) => (
        <Typography variant='body2' sx={{ color: 'text.primary' }}>
          {params.row.payout_status_name}
        </Typography>
      )
    },
    {
      flex: 1,
      minWidth: 3,
      field: 'payout_shop_id',
      headerName: t.SCREEN_COL_PAYOUT_LIST_SHOP_ID,
      renderCell: (params: GridRenderCellParams) => (
        <Typography variant='body2' sx={{ color: 'text.primary' }}>
          {params.row.payout_shop_id}
        </Typography>
      )
    },
    {
      flex: 1,
      width: 1,
      field: 'payout_shop_name',
      headerName: t.SCREEN_COL_PAYOUT_LIST_SHOP_NAME,
      renderCell: (params: GridRenderCellParams) => (
        <Typography variant='body2' sx={{ color: 'text.primary' }}>
          {params.row.payout_shop_name}
        </Typography>
      )
    },
    {
      flex: 0.5,
      width: 1,
      field: 'payout_amount',
      headerName: t.SCREEN_COL_PAYOUT_LIST_AMOUNT,
      renderCell: (params: GridRenderCellParams) => (
        <Typography variant='body2' sx={{ color: 'text.primary' }}>
          {Number(params.row.payout_amount || '0').toLocaleString()}
        </Typography>
      )
    },
    {
      flex: 0.5,
      width: 1,
      field: 'payout_wellbe_fee_amount',
      headerName: t.SCREEN_COL_PAYOUT_LIST_WELLBE_FEE,
      renderCell: (params: GridRenderCellParams) => (
        <Typography variant='body2' sx={{ color: 'text.primary' }}>
          {Number(params.row.payout_wellbe_fee_amount || '0').toLocaleString()}
        </Typography>
      )
    },
    {
      flex: 0.5,
      width: 1,
      field: 'payout_paypal_fee_amount',
      headerName: t.SCREEN_COL_PAYOUT_LIST_PAYPAL_FEE,
      renderCell: (params: GridRenderCellParams) => (
        <Typography variant='body2' sx={{ color: 'text.primary' }}>
          {Number(params.row.payout_paypal_fee_amount || '0').toLocaleString()}
        </Typography>
      )
    },
    {
      flex: 0.3,
      width: 1,
      field: 'payout_currency_cd_iso',
      headerName: t.SCREEN_COL_PAYOUT_LIST_CURRENCY,
      renderCell: (params: GridRenderCellParams) => (
        <Typography variant='body2' sx={{ color: 'text.primary' }}>
          {params.row.payout_currency_cd_iso}
        </Typography>
      )
    }
  ]

  return (
    <Card>
      <CardHeader title={t.SCREEN_TITLE_PAYOUT_LIST} />
      <DataGrid
        autoHeight
        slots={{
          toolbar: () => (
            <Box
              sx={{
                gap: 2,
                display: 'flex',
                flexWrap: 'wrap',
                alignItems: 'center',
                justifyContent: 'space-between',
                p: theme => theme.spacing(2, 5, 4, 5)
              }}
            >
              <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                <GridToolbarExport csvOptions={{ utf8WithBom: true }} printOptions={{ disableToolbarButton: false }} />
                <Button
                  variant='contained'
                  size='small'
                  disabled={selectedRowIds.length === 0}
                  onClick={handleDownloadNotification}
                >
                  通知書ダウンロード（Excel/PDF）
                </Button>
              </Box>
            </Box>
          )
        }}
        rows={payoutService.payoutList}
        columns={columns}
        checkboxSelection
        disableRowSelectionOnClick
        pageSizeOptions={[7, 10, 25, 50]}
        paginationModel={paginationModel}
        rowSelectionModel={selectedRowIds}
        onRowSelectionModelChange={ids => setSelectedRowIds(ids as string[])}
        columnVisibilityModel={hideNameColumn}
        onPaginationModelChange={setPaginationModel}
        onColumnVisibilityModelChange={newValue => setHideNameColumn(newValue)}
      />
      <Backdrop sx={{ color: '#fff', zIndex: theme => theme.zIndex.drawer + 1 }} open={payoutService.loading}>
        <CircularProgress color='inherit' />
      </Backdrop>
    </Card>
  )
}

export default PayoutList
