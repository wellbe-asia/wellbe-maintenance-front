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
import ShopForMaintenanceService from '@/service/ShopForMaintenanceService'
import { useRouter } from 'next/router'
import ExportToolbar from '@/views/maintenance/ExportToolbar'

const StoreList = () => {
  const { t } = useLocale()
  const router = useRouter()

  // ** States
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 })
  const [hideNameColumn, setHideNameColumn] = useState<GridColumnVisibilityModel>({ full_name: true })

  // ** Service
  const shopForMaintenanceService = ShopForMaintenanceService()

  useEffect(() => {
    shopForMaintenanceService.GetShopListReviewing()

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.locale])

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
      width: 150,
      field: 'shop_status_name',
      headerName: t.SCREEN_COL_SHOP_LIST_STATUS,
      renderCell: (params: GridRenderCellParams) => (
        <Typography variant='body2' sx={{ color: 'text.primary' }}>
          {params.row.shop_status_name}
        </Typography>
      )
    },
    {
      width: 300,
      field: 'shop_status_cd',
      headerName: 'Actions',
      renderCell: (params: GridRenderCellParams) => {
        return (
          <>
            <Link href={`/account/settings?shop_id=${params.row.id}`}>
              <Button size='small' variant='outlined' color='secondary' sx={{ mr: 2 }}>
                {t.BUTTON_SHOP_ACCOUNT}
              </Button>
            </Link>
          </>
        )
      }
    }
  ]

  return (
    <Card>
      <CardHeader title={t.SCREEN_TITLE_SHOP_LIST_REVIEWING} />
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
    </Card>
  )
}

export default StoreList
