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
import { dateFormatApi2DisplayYYYYMMDD } from '@/@core/utils/date'
import InvoiceService from '@/service/InvoiceService'
import Link from 'next/link'
import ExportToolbar from '@/views/maintenance/ExportToolbar'

const InvoiceList = () => {
  const { t } = useLocale()
  const { locale } = useRouter()

  // ** States
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 })
  const [hideNameColumn, setHideNameColumn] = useState<GridColumnVisibilityModel>({ full_name: true })

  // ** Service
  const invoiceService = InvoiceService()

  useEffect(() => {
    invoiceService.GetInvoiceList()

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [locale])

  const columns: GridColDef[] = [
    {
      width: 300,
      field: 'id',
      headerName: t.SCREEN_COL_INVOICE_LIST_ID,
      valueGetter: params => new Date(params.value),
      renderCell: (params: GridRenderCellParams) => (
        <Typography variant='body2' sx={{ color: 'text.primary' }}>
          <Link
            href={`/invoice/invoice-item/${params.row.id}?title=${params.row.shop_name}_${dateFormatApi2DisplayYYYYMMDD(
              params.row.billing_date
            )}&stat=${params.row.invoice_status_cd}`}
          >
            {params.row.id}
          </Link>
        </Typography>
      )
    },
    {
      width: 150,
      field: 'billing_date',
      headerName: t.SCREEN_COL_INVOICE_LIST_DATE,
      renderCell: (params: GridRenderCellParams) => (
        <Typography variant='body2' sx={{ color: 'text.primary' }}>
          {dateFormatApi2DisplayYYYYMMDD(params.row.billing_date)}
        </Typography>
      )
    },
    {
      width: 150,
      field: 'invoice_status_name',
      headerName: t.SCREEN_COL_INVOICE_LIST_STATUS,
      renderCell: (params: GridRenderCellParams) => (
        <Typography variant='body2' sx={{ color: 'text.primary' }}>
          {params.row.invoice_status_name}
        </Typography>
      )
    },
    {
      width: 300,
      field: 'billing_shop_id',
      headerName: t.SCREEN_COL_INVOICE_LIST_SHOP_ID,
      renderCell: (params: GridRenderCellParams) => (
        <Typography variant='body2' sx={{ color: 'text.primary' }}>
          {params.row.billing_shop_id}
        </Typography>
      )
    },
    {
      width: 200,
      field: 'shop_name',
      headerName: t.SCREEN_COL_INVOICE_LIST_SHOP_NAME,
      renderCell: (params: GridRenderCellParams) => (
        <Typography variant='body2' sx={{ color: 'text.primary' }}>
          {params.row.shop_name}
        </Typography>
      )
    },
    {
      width: 150,
      field: 'billing_amount',
      headerName: t.SCREEN_COL_INVOICE_LIST_AMOUNT,
      renderCell: (params: GridRenderCellParams) => (
        <Typography variant='body2' sx={{ color: 'text.primary' }}>
          {Number(params.row.billing_amount || '0').toLocaleString()}
        </Typography>
      )
    },
    {
      width: 300,
      field: 'billing_currency_cd_iso',
      headerName: t.SCREEN_COL_INVOICE_LIST_CURRENCY,
      renderCell: (params: GridRenderCellParams) => (
        <Typography variant='body2' sx={{ color: 'text.primary' }}>
          {params.row.billing_currency_cd_iso}
        </Typography>
      )
    }
  ]

  return (
    <Card>
      <CardHeader title={t.SCREEN_TITLE_INVOICE_LIST} />
      <DataGrid
        autoHeight
        slots={{ toolbar: ExportToolbar }}
        rows={invoiceService.invoiceList}
        columns={columns}
        disableRowSelectionOnClick
        pageSizeOptions={[7, 10, 25, 50]}
        paginationModel={paginationModel}
        columnVisibilityModel={hideNameColumn}
        onPaginationModelChange={setPaginationModel}
        onColumnVisibilityModelChange={newValue => setHideNameColumn(newValue)}
      />
      <Backdrop sx={{ color: '#fff', zIndex: theme => theme.zIndex.drawer + 1 }} open={invoiceService.loading}>
        <CircularProgress color='inherit' />
      </Backdrop>
    </Card>
  )
}

export default InvoiceList
