/* eslint-disable react-hooks/exhaustive-deps */
// ** React
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'

// ** MUI Imports
import Card from '@mui/material/Card'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import { Alert, AlertColor, Backdrop, CircularProgress, Snackbar } from '@mui/material'
import { DataGrid, GridColDef, GridColumnVisibilityModel, GridRenderCellParams } from '@mui/x-data-grid'

// ** Component
import ShopLocationGoogleService from '@/service/ShopLocationGoogleService'
import { getLanguageCdWithValue } from '@/configs/locales/locales'
import { useLocale } from '@/@core/hooks/useLocal'
import ExportToolbar from '@/views/maintenance/ExportToolbar'

export default function ShopLocationPage() {
  const { t, locale } = useLocale()
  const router = useRouter()

  // ** States
  const [snackbarOpen, setSnackbarOpen] = useState(false)
  const [message, setMessage] = useState('')
  const [severity, setSeverity] = useState<AlertColor>('error')
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 })
  const [hideNameColumn, setHideNameColumn] = useState<GridColumnVisibilityModel>({ full_name: true })

  const { shop_id } = router.query
  const shopId = shop_id && [shop_id].flat(1).length > 0 ? [shop_id].flat(1)[0] : ''

  const shopLocationGoogleService = ShopLocationGoogleService()
  useEffect(() => {
    const languageCd = getLanguageCdWithValue(locale || '')
    shopLocationGoogleService.GetFromGoogleWithShopId(shopId, languageCd)
  }, [shopId, locale])

  const onClickConfirm = async (placeId: string) => {
    const res = await shopLocationGoogleService.Submit(shopId, placeId)
    if (res.message != '') {
      setSnackbarOpen(true)
      setMessage(res.message)
      setSeverity('error')
    } else {
      setSnackbarOpen(true)
      setMessage(t.MESSAGE_UPDATED)
      setSeverity('success')
    }
  }

  const handleClose = () => {
    setSnackbarOpen(false)
  }

  const columns: GridColDef[] = [
    {
      width: 100,
      field: 'place_id',
      headerName: 'Place ID',
      valueGetter: params => new Date(params.value),
      renderCell: (params: GridRenderCellParams) => (
        <Typography variant='body2' sx={{ color: 'text.primary' }}>
          {params.row.place_id}
        </Typography>
      )
    },
    {
      width: 200,
      field: 'formatted_address',
      headerName: 'Formatted Address',
      valueGetter: params => new Date(params.value),
      renderCell: (params: GridRenderCellParams) => (
        <Typography variant='body2' sx={{ color: 'text.primary' }}>
          {params.row.formatted_address}
        </Typography>
      )
    },
    {
      width: 200,
      field: 'google_map_uri',
      headerName: 'Google Map URI',
      valueGetter: params => new Date(params.value),
      renderCell: (params: GridRenderCellParams) => (
        <Typography variant='body2' sx={{ color: 'text.primary' }}>
          {params.row.google_map_uri}
        </Typography>
      )
    },
    {
      width: 200,
      field: 'website_uri',
      headerName: 'Website URI',
      valueGetter: params => new Date(params.value),
      renderCell: (params: GridRenderCellParams) => (
        <Typography variant='body2' sx={{ color: 'text.primary' }}>
          {params.row.website_uri}
        </Typography>
      )
    },
    {
      width: 100,
      field: 'actions',
      headerName: 'Actions',
      renderCell: (params: GridRenderCellParams) => {
        return (
          <>
            <Button
              size='small'
              variant='outlined'
              color='secondary'
              sx={{ mr: 2 }}
              onClick={() => onClickConfirm(params.row.place_id)}
            >
              {t.BUTTON_CONFIRM}
            </Button>
          </>
        )
      }
    }
  ]

  return (
    <Card>
      <DataGrid
        autoHeight
        slots={{ toolbar: ExportToolbar }}
        rows={shopLocationGoogleService.shopLocationGoogleList}
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
        open={shopLocationGoogleService.loading}
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
