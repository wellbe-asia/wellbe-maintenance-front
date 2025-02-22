// ** React Imports
import { useEffect, useState } from 'react'

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
import { useRouter } from 'next/router'
import ExportToolbar from '@/views/maintenance/ExportToolbar'
import MaintenanceAccountService from '@/service/MaintenanceAccountService'
import { MaintenanceAccountResponseGetType } from '@/@core/api/type/account'
import { getLanguageCdWithValue } from '@/configs/locales/locales'

const StoreList = () => {
  const { t } = useLocale()
  const router = useRouter()

  // ** States
  const [accounts, setAccounts] = useState<MaintenanceAccountResponseGetType[]>([])
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 })
  const [hideNameColumn, setHideNameColumn] = useState<GridColumnVisibilityModel>({ full_name: true })

  // ** Service
  const maintenanceAccountService = MaintenanceAccountService()

  useEffect(() => {
    const languageCd = getLanguageCdWithValue(router.locale || '')
    if (languageCd) {
      GetAccount(languageCd)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.locale])
  const GetAccount = async (languageCd: string) => {
    const accounts = await maintenanceAccountService.GetAccount(languageCd)
    setAccounts(accounts)
  }

  const onClickNew = () => {
    router.push('/maintenance-account/new/')
  }

  const columns: GridColDef[] = [
    {
      width: 300,
      field: 'id',
      headerName: t.SCREEN_COL_MAINTENANCE_ACCOUNT_ID,
      valueGetter: params => new Date(params.value),
      renderCell: (params: GridRenderCellParams) => (
        <Typography variant='body2' sx={{ color: 'text.primary' }}>
          {params.row.id}
        </Typography>
      )
    },
    {
      width: 200,
      field: 'name',
      headerName: t.SCREEN_COL_MAINTENANCE_ACCOUNT_NAME,
      renderCell: (params: GridRenderCellParams) => (
        <Typography variant='body2' sx={{ color: 'text.primary' }}>
          {params.row.name}
        </Typography>
      )
    },
    {
      width: 200,
      field: 'cognito_user_name',
      headerName: t.SCREEN_COL_MAINTENANCE_ACCOUNT_USER_NAME,
      renderCell: (params: GridRenderCellParams) => (
        <Typography variant='body2' sx={{ color: 'text.primary' }}>
          {params.row.cognito_user_name}
        </Typography>
      )
    },
    {
      width: 250,
      field: 'account_group_name',
      headerName: t.SCREEN_COL_MAINTENANCE_ACCOUNT_ACCOUNT_GROUP,
      renderCell: (params: GridRenderCellParams) => (
        <Typography variant='body2' sx={{ color: 'text.primary' }}>
          {params.row.account_group_name}
        </Typography>
      )
    }
  ]

  return (
    <Card>
      <CardHeader
        title={t.SCREEN_TITLE_MAINTENANCE_ACCOUNT_LIST}
        action={
          <Button onClick={onClickNew} variant='contained'>
            {t.BUTTON_NEW}
          </Button>
        }
      />
      <DataGrid
        autoHeight
        slots={{ toolbar: ExportToolbar }}
        rows={accounts}
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
        open={maintenanceAccountService.loading}
      >
        <CircularProgress color='inherit' />
      </Backdrop>
    </Card>
  )
}

export default StoreList
