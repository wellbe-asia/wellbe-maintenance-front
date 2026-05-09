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
import { Alert, AlertColor, Backdrop, CircularProgress, Snackbar } from '@mui/material'
import { DataGrid, GridColDef, GridColumnVisibilityModel, GridRenderCellParams } from '@mui/x-data-grid'

// ** Data Import
import ShopForMaintenanceService from '@/service/ShopForMaintenanceService'
import ShopLocationGoogleService from '@/service/ShopLocationGoogleService'
import { useRouter } from 'next/router'
import ExportToolbar from '@/views/maintenance/ExportToolbar'

const StoreList = () => {
  const { t } = useLocale()
  const router = useRouter()

  // ** States
  const [snackbarOpen, setSnackbarOpen] = useState(false)
  const [message, setMessage] = useState('')
  const [severity, setSeverity] = useState<AlertColor>('error')
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 })
  const [hideNameColumn, setHideNameColumn] = useState<GridColumnVisibilityModel>({ full_name: true })

  // ** Service
  const shopForMaintenanceService = ShopForMaintenanceService()
  const shopLocationGoogleService = ShopLocationGoogleService()

  useEffect(() => {
    shopForMaintenanceService.GetShopContractedList(true)

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.locale])

  const onClickNew = () => {
    router.push('/store/new/')
  }

  const handleClose = () => {
    setSnackbarOpen(false)
  }

  const handleDisconnectGoogleMap = async (shopId: string) => {
    if (!shopId) return
    if (!window.confirm(t.MESSAGE_DELETE_CONFIRM)) return

    const res = await shopLocationGoogleService.DeleteWithShopId(shopId)
    if (res.message != '') {
      setSnackbarOpen(true)
      setMessage(res.message)
      setSeverity('error')

      return
    }

    setSnackbarOpen(true)
    setMessage(t.MESSAGE_UPDATED)
    setSeverity('success')
    shopForMaintenanceService.GetShopContractedList(true)
  }

  const columns: GridColDef[] = [
    {
      width: 300,
      field: 'id',
      headerName: t.SCREEN_COL_SHOP_LIST_ID,
      valueGetter: params => new Date(params.value),
      renderCell: (params: GridRenderCellParams) => (
        <Typography variant='body2' sx={{ color: 'text.primary' }}>
          {params.row.id}
        </Typography>
      )
    },
    {
      width: 200,
      field: 'shop_no',
      headerName: t.SCREEN_COL_SHOP_LIST_NO,
      renderCell: (params: GridRenderCellParams) => (
        <Typography variant='body2' sx={{ color: 'text.primary' }}>
          {params.row.shop_no}
        </Typography>
      )
    },
    {
      width: 250,
      field: 'shop_name',
      headerName: t.SCREEN_COL_SHOP_LIST_NAME,
      renderCell: (params: GridRenderCellParams) => (
        <Typography variant='body2' sx={{ color: 'text.primary' }}>
          {params.row.shop_name}
        </Typography>
      )
    },
    {
      width: 100,
      field: 'shop_status_name',
      headerName: t.SCREEN_COL_SHOP_LIST_STATUS,
      renderCell: (params: GridRenderCellParams) => (
        <Typography variant='body2' sx={{ color: 'text.primary' }}>
          {params.row.shop_status_name}
        </Typography>
      )
    },
    {
      width: 120,
      field: 'transition_all',
      headerName: t.SCREEN_COL_SHOP_LIST_TRANSITION_ALL,
      renderCell: (params: GridRenderCellParams) => (
        <Typography variant='body2' sx={{ color: 'text.primary' }}>
          {params.row.transition_all}
        </Typography>
      )
    },
    {
      width: 120,
      field: 'transition_last_month',
      headerName: t.SCREEN_COL_SHOP_LIST_TRANSITION_LAST_MONTH,
      renderCell: (params: GridRenderCellParams) => (
        <Typography variant='body2' sx={{ color: 'text.primary' }}>
          {params.row.transition_last_month}
        </Typography>
      )
    },
    {
      width: 120,
      field: 'booking_method_name',
      headerName: t.SCREEN_COL_SHOP_LIST_BOOKING_METHOD,
      renderCell: (params: GridRenderCellParams) => (
        <Typography variant='body2' sx={{ color: 'text.primary' }}>
          {params.row.booking_method_name}
        </Typography>
      )
    },
    {
      width: 250,
      field: 'shop_admin_email_address',
      headerName: t.SCREEN_COL_SHOP_LIST_EMAIL,
      renderCell: (params: GridRenderCellParams) => (
        <Typography variant='body2' sx={{ color: 'text.primary' }}>
          {params.row.shop_admin_email_address}
        </Typography>
      )
    },

    /*     {
      width: 120,
      field: 'reservation_limit_total_day',
      headerName: t.SCREEN_COL_SHOP_LIST_RESERVATION_LIMIT_TOTAL_DAY,
      renderCell: (params: GridRenderCellParams) => (
        <Typography variant='body2' sx={{ color: 'text.primary' }}>
          {params.row.reservation_limit_total_day}
        </Typography>
      )
    },
    {
      width: 120,
      field: 'shop_booking_available_day',
      headerName: t.SCREEN_COL_SHOP_LIST_BOOKING_AVAILABLE_DAY,
      renderCell: (params: GridRenderCellParams) => (
        <Typography variant='body2' sx={{ color: 'text.primary' }}>
          {params.row.shop_booking_available_day}
        </Typography>
      )
    }, */
    {
      width: 120,
      field: 'external_connect_is_confirmed',
      headerName: t.SCREEN_COL_SHOP_LIST_SALONBOARD_CONNECT,
      renderCell: (params: GridRenderCellParams) => (
        <Typography variant='body2' sx={{ color: 'text.primary' }}>
          {params.row.external_connect_is_confirmed == null
            ? '未設定'
            : params.row.external_connect_is_confirmed == false
            ? 'ログイン不可'
            : '連携済'}
        </Typography>
      )
    },
    {
      width: 250,
      field: 'shop_location_googles',
      headerName: t.SCREEN_COL_SHOP_LIST_SHOP_LOCATION_GOOGLES,
      renderCell: (params: GridRenderCellParams) => (
        <Typography variant='body2' sx={{ color: 'text.primary' }}>
          {params.row.shop_location_googles && params.row.shop_location_googles.length > 0 ? '設定済' : '未設定'}
        </Typography>
      )
    },
    {
      width: 600,
      field: 'shop_status_cd',
      headerName: 'Actions',
      renderCell: (params: GridRenderCellParams) => {
        return (
          <>
            <Link href={`/account/settings?shop_id=${params.row.id}`} target='_blank'>
              <Button size='small' variant='outlined' color='secondary' sx={{ mr: 2 }}>
                {t.BUTTON_SHOP_ACCOUNT}
              </Button>
            </Link>
            <Link href={`/store-location?shop_id=${params.row.id}`} target='_blank'>
              <Button size='small' variant='outlined' color='secondary' sx={{ mr: 2 }}>
                {t.BUTTON_STORE_LOCATION}
              </Button>
            </Link>
            <Button
              size='small'
              variant='outlined'
              color='error'
              sx={{ mr: 2 }}
              onClick={() => handleDisconnectGoogleMap(params.row.id)}
              disabled={shopLocationGoogleService.loading}
            >
              {t.BUTTON_GOOGLE_MAP_DISCONNECT}
            </Button>
            <Link href={`/store-maintenance?shop_id=${params.row.id}`} target='_blank'>
              <Button size='small' variant='outlined' color='secondary' sx={{ mr: 2 }}>
                {t.BUTTON_SHOP_ARTICLE}
              </Button>
            </Link>
            <Link href={`/booking-limit?shop_id=${params.row.id}`} target='_blank'>
              <Button size='small' variant='outlined' color='secondary'>
                {t.BUTTON_LIMIT_SETTING}
              </Button>
            </Link>
          </>
        )
      }
    }
  ]

  return (
    <Card>
      <CardHeader
        title={t.SCREEN_TITLE_SHOP_LIST}
        action={
          <Button onClick={onClickNew} variant='contained'>
            {t.BUTTON_NEW}
          </Button>
        }
      />
      <DataGrid
        autoHeight
        slots={{ toolbar: ExportToolbar }}
        rows={shopForMaintenanceService.shopList}
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
        open={shopForMaintenanceService.loading}
      >
        <CircularProgress color='inherit' />
      </Backdrop>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={5000}
        onClose={() => setSnackbarOpen(false)}
        message={message}
        anchorOrigin={{ horizontal: 'center', vertical: 'top' }}
      >
        <Alert onClose={handleClose} severity={severity} variant='filled' sx={{ width: '100%' }}>
          {message}
        </Alert>
      </Snackbar>
    </Card>
  )
}

export default StoreList
