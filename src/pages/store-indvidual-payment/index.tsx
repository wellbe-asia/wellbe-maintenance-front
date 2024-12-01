// ** React Imports
import { useEffect, useState } from 'react'
import Link from 'next/link'

// ** Hook
import { useLocale } from '@/@core/hooks/useLocal'

// ** MUI Imports
import Card from '@mui/material/Card'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import CardHeader from '@mui/material/CardHeader'
import { Backdrop, CircularProgress } from '@mui/material'
import { DataGrid, GridColDef, GridColumnVisibilityModel, GridRenderCellParams } from '@mui/x-data-grid'

// ** Data Import
import ShopPaymentForMaintenanceService from '@/service/ShopPaymentForMaintenanceService'
import { useRouter } from 'next/router'

const StoreList = () => {
  const { t } = useLocale()
  const { locale } = useRouter()

  // ** States
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 })
  const [hideNameColumn, setHideNameColumn] = useState<GridColumnVisibilityModel>({ full_name: true })

  // ** Service
  const shopPaymentForMaintenanceService = ShopPaymentForMaintenanceService()

  useEffect(() => {
    shopPaymentForMaintenanceService.GetShopList()

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [locale])

  const columns: GridColDef[] = [
    {
      flex: 0.1,
      minWidth: 2,
      field: 'id',
      headerName: t.SCREEN_COL_SHOP_INDVIDUAL_PAYMENT_LIST_ID,
      valueGetter: params => new Date(params.value),
      renderCell: (params: GridRenderCellParams) => (
        <Typography variant='body2' sx={{ color: 'text.primary' }}>
          {params.row.id}
        </Typography>
      )
    },
    {
      flex: 0.1,
      minWidth: 1,
      field: 'shop_no',
      headerName: t.SCREEN_COL_SHOP_INDVIDUAL_PAYMENT_LIST_NO,
      renderCell: (params: GridRenderCellParams) => (
        <Typography variant='body2' sx={{ color: 'text.primary' }}>
          {params.row.shop_no}
        </Typography>
      )
    },
    {
      flex: 0.125,
      minWidth: 3,
      field: 'shop_name',
      headerName: t.SCREEN_COL_SHOP_INDVIDUAL_PAYMENT_LIST_NAME,
      renderCell: (params: GridRenderCellParams) => (
        <Typography variant='body2' sx={{ color: 'text.primary' }}>
          {params.row.shop_name}
        </Typography>
      )
    },
    {
      flex: 0.075,
      width: 1,
      field: 'shop_status_name',
      headerName: t.SCREEN_COL_SHOP_INDVIDUAL_PAYMENT_LIST_STATUS,
      renderCell: (params: GridRenderCellParams) => (
        <Typography variant='body2' sx={{ color: 'text.primary' }}>
          {params.row.shop_status_name}
        </Typography>
      )
    },
    {
      flex: 0.075,
      width: 1,
      field: 'checkout_count',
      headerName: t.SCREEN_COL_SHOP_INDVIDUAL_PAYMENT_LIST_CHECKOUT_COUNT,
      renderCell: (params: GridRenderCellParams) => (
        <Typography variant='body2' sx={{ color: 'text.primary' }}>
          {params.row.checkout_count}
        </Typography>
      )
    },
    {
      flex: 0.075,
      width: 1,
      field: 'checkout_amount',
      headerName: t.SCREEN_COL_SHOP_INDVIDUAL_PAYMENT_LIST_CHECKOUT_AMOUNT,
      renderCell: (params: GridRenderCellParams) => (
        <Typography variant='body2' sx={{ color: 'text.primary' }}>
          {params.row.checkout_amount.toLocaleString()}
        </Typography>
      )
    },
    {
      flex: 0.075,
      width: 1,
      field: 'currency_cd_iso',
      headerName: t.SCREEN_COL_SHOP_INDVIDUAL_PAYMENT_LIST_CHECKOUT_CURRENCY,
      renderCell: (params: GridRenderCellParams) => (
        <Typography variant='body2' sx={{ color: 'text.primary' }}>
          {params.row.currency_cd_iso}
        </Typography>
      )
    },
    {
      flex: 0.15,
      minWidth: 3,
      field: 'ACTION',
      headerName: 'Actions',
      renderCell: (params: GridRenderCellParams) => {
        return (
          <>
            <Link href={`/store-indvidual-payment/pay/${params.row.id}`}>
              <Button size='small' variant='outlined' color='secondary' sx={{ mr: 2 }}>
                {t.BUTTON_CREATE_INDIVIDUAL_PAYMENT}
              </Button>
            </Link>
          </>
        )
      }
    }
  ]

  return (
    <Card>
      <CardHeader title={t.SCREEN_TITLE_SHOP_INDVIDUAL_PAYMENT_LIST} />
      <DataGrid
        autoHeight
        rows={shopPaymentForMaintenanceService.shopList}
        columns={columns}
        disableRowSelectionOnClick
        pageSizeOptions={[7, 10, 25, 50]}
        paginationModel={paginationModel}
        columnVisibilityModel={hideNameColumn}
        onPaginationModelChange={setPaginationModel}
        onColumnVisibilityModelChange={newValue => setHideNameColumn(newValue)}
      />
      <Backdrop
        sx={{ color: '#fff', zIndex: theme => theme.zIndex.drawer + 1 }}
        open={shopPaymentForMaintenanceService.loading}
      >
        <CircularProgress color='inherit' />
      </Backdrop>
    </Card>
  )
}

export default StoreList
