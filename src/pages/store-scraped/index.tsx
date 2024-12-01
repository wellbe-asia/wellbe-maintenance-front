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
import { Backdrop, CircularProgress, Dialog, DialogActions, DialogTitle } from '@mui/material'
import { DataGrid, GridColDef, GridColumnVisibilityModel, GridRenderCellParams } from '@mui/x-data-grid'

// ** Data Import
import ShopForMaintenanceService from '@/service/ShopForMaintenanceService'
import { useRouter } from 'next/router'
import { SHOP_STATUS } from '@/@core/utils/constant'
import ExportToolbar from '@/views/maintenance/ExportToolbar'

const StoreList = () => {
  const { t } = useLocale()
  const router = useRouter()

  // ** States
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 })
  const [hideNameColumn, setHideNameColumn] = useState<GridColumnVisibilityModel>({ full_name: true })
  const [openModal, setOpenModal] = useState(false)
  const [shopId, setShopId] = useState('')

  // ** Service
  const shopForMaintenanceService = ShopForMaintenanceService()

  useEffect(() => {
    shopForMaintenanceService.GetShopScrapedList()

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.locale])

  const onDelete = () => {
    shopForMaintenanceService.Delete(shopId)
    shopForMaintenanceService.GetShopScrapedList()
    setOpenModal(false)
  }

  const onOpenModal = (inShopId: string) => {
    setShopId(inShopId)
    setOpenModal(true)
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
      width: 350,
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
            <Link href={`/store-maintenance?shop_id=${params.row.id}`} target='_blank'>
              <Button size='small' variant='outlined' color='secondary'>
                {t.BUTTON_SHOP_ARTICLE}
              </Button>
            </Link>
            {params.row.shop_status_cd != SHOP_STATUS.APPROVED && (
              <Button
                size='small'
                variant='contained'
                onClick={() => {
                  onOpenModal(params.row.id)
                }}
                color='error'
                sx={{ ml: 10 }}
              >
                {t.BUTTON_DELETE}
              </Button>
            )}
          </>
        )
      }
    }
  ]

  return (
    <Card>
      <CardHeader title={t.SCREEN_TITLE_SHOP_LIST} />
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
      <Dialog
        open={openModal}
        onClose={() => {
          setOpenModal(false)
        }}
        aria-labelledby='alert-dialog-title'
        aria-describedby='alert-dialog-description'
        sx={{ zIndex: '99999' }}
      >
        <DialogTitle id='alert-dialog-title'>{t.MESSAGE_DELETE_CONFIRM}</DialogTitle>
        <DialogActions>
          <Button onClick={onDelete} variant='contained'>
            {t.BUTTON_DELETE}
          </Button>
        </DialogActions>
      </Dialog>
    </Card>
  )
}

export default StoreList
