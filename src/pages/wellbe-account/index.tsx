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
import WellbeAccountService from '@/service/WellbeAccountService'
import { getLanguageCdWithValue } from '@/configs/locales/locales'
import { DEFAULT_LANGUAGE } from '@/@core/utils/constant'
import { dateFormatApi2DisplayYYYYMMDD } from '@/@core/utils/date'

const AccountList = () => {
  const { t } = useLocale()
  const { locale } = useRouter()

  // ** States
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 })
  const [hideNameColumn, setHideNameColumn] = useState<GridColumnVisibilityModel>({ full_name: true })

  // ** Service
  const wellbeAccountService = WellbeAccountService()

  useEffect(() => {
    const varLanguageCd = getLanguageCdWithValue(locale || DEFAULT_LANGUAGE)
    if (varLanguageCd) {
      console.log(varLanguageCd)
      wellbeAccountService.GetAccountList(varLanguageCd)
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [locale])

  const columns: GridColDef[] = [
    {
      width: 300,
      field: 'id',
      headerName: t.SCREEN_COL_ACCOUNT_LIST_ID,
      valueGetter: params => new Date(params.value),
      renderCell: (params: GridRenderCellParams) => (
        <Typography variant='body2' sx={{ color: 'text.primary' }}>
          {params.row.id}
        </Typography>
      )
    },
    {
      width: 180,
      field: 'account_no',
      headerName: t.SCREEN_COL_ACCOUNT_LIST_NO,
      renderCell: (params: GridRenderCellParams) => (
        <Typography variant='body2' sx={{ color: 'text.primary' }}>
          {params.row.account_no}
        </Typography>
      )
    },
    {
      width: 100,
      field: 'account_status_name',
      headerName: t.SCREEN_COL_ACCOUNT_LIST_STATUS,
      renderCell: (params: GridRenderCellParams) => (
        <Typography variant='body2' sx={{ color: 'text.primary' }}>
          {params.row.account_status_name}
        </Typography>
      )
    },
    {
      width: 150,
      field: 'family_name',
      headerName: t.SCREEN_COL_ACCOUNT_LIST_FAMILY_NAME,
      renderCell: (params: GridRenderCellParams) => (
        <Typography variant='body2' sx={{ color: 'text.primary' }}>
          {params.row.family_name}
        </Typography>
      )
    },
    {
      width: 150,
      field: 'given_name',
      headerName: t.SCREEN_COL_ACCOUNT_LIST_GIVEN_NAME,
      renderCell: (params: GridRenderCellParams) => (
        <Typography variant='body2' sx={{ color: 'text.primary' }}>
          {params.row.given_name}
        </Typography>
      )
    },
    {
      width: 200,
      field: 'email_address',
      headerName: t.SCREEN_COL_ACCOUNT_LIST_EMAIL,
      renderCell: (params: GridRenderCellParams) => (
        <Typography variant='body2' sx={{ color: 'text.primary' }}>
          {params.row.email_address}
        </Typography>
      )
    },
    {
      width: 100,
      field: 'birth_date',
      headerName: t.SCREEN_COL_ACCOUNT_LIST_BIRTH_DATE,
      renderCell: (params: GridRenderCellParams) => (
        <Typography variant='body2' sx={{ color: 'text.primary' }}>
          {dateFormatApi2DisplayYYYYMMDD(params.row.birth_date)}
        </Typography>
      )
    },
    {
      width: 150,
      field: 'country_name',
      headerName: t.SCREEN_COL_ACCOUNT_LIST_COUNTRY,
      renderCell: (params: GridRenderCellParams) => (
        <Typography variant='body2' sx={{ color: 'text.primary' }}>
          {params.row.country_name}
        </Typography>
      )
    },
    {
      width: 150,
      field: 'international_tell_no',
      headerName: t.SCREEN_COL_ACCOUNT_LIST_TELL,
      renderCell: (params: GridRenderCellParams) => (
        <Typography variant='body2' sx={{ color: 'text.primary' }}>
          {params.row.international_tell_no}
        </Typography>
      )
    }
  ]

  return (
    <Card>
      <CardHeader title={t.SCREEN_TITLE_ACCOUNT_LIST} />
      <DataGrid
        autoHeight
        rows={wellbeAccountService.accounts}
        columns={columns}
        disableRowSelectionOnClick
        pageSizeOptions={[7, 10, 25, 50]}
        paginationModel={paginationModel}
        columnVisibilityModel={hideNameColumn}
        onPaginationModelChange={setPaginationModel}
        onColumnVisibilityModelChange={newValue => setHideNameColumn(newValue)}
      />
      <Backdrop sx={{ color: '#fff', zIndex: theme => theme.zIndex.drawer + 1 }} open={wellbeAccountService.loading}>
        <CircularProgress color='inherit' />
      </Backdrop>
    </Card>
  )
}

export default AccountList
