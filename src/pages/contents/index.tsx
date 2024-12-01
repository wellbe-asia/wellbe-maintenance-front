// ** React Imports
import { useEffect, useState } from 'react'
import Link from 'next/link'

// ** Hook
import { useLocale } from '@/@core/hooks/useLocal'

// ** MUI Imports
import Card from '@mui/material/Card'
import Typography from '@mui/material/Typography'
import CardHeader from '@mui/material/CardHeader'
import { Backdrop, Button, CircularProgress } from '@mui/material'
import { DataGrid, GridColDef, GridColumnVisibilityModel, GridRenderCellParams } from '@mui/x-data-grid'

// ** Data Import
import { useRouter } from 'next/router'
import ContentsService from '@/service/ContentsService'
import { getLanguageCdWithValue } from '@/configs/locales/locales'
import { dateFormatApi2DisplayYYYYMMDD } from '@/@core/utils/date'
import ExportToolbar from '@/views/maintenance/ExportToolbar'

const ContentsList = () => {
  const { t } = useLocale()
  const router = useRouter()

  // ** States
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 })
  const [hideNameColumn, setHideNameColumn] = useState<GridColumnVisibilityModel>({ full_name: true })

  // ** Service
  const contentsService = ContentsService()

  useEffect(() => {
    if (router.locale && getLanguageCdWithValue(router.locale)) {
      contentsService.InitList(getLanguageCdWithValue(router.locale))
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.locale])

  const onClickNew = () => {
    router.push('/contents/detail/new/')
  }

  const columns: GridColDef[] = [
    {
      width: 300,
      field: 'id',
      headerName: t.SCREEN_COL_CONTENTS_LIST_ID,
      valueGetter: params => new Date(params.value),
      renderCell: (params: GridRenderCellParams) => (
        <Link href={`/contents/detail/${params.row.id}`}>
          <Typography variant='body2' sx={{ color: 'text.primary' }}>
            {params.row.id}
          </Typography>
        </Link>
      )
    },
    {
      width: 100,
      field: 'contents_status_name',
      headerName: t.SCREEN_COL_CONTENTS_LIST_STATUS,
      renderCell: (params: GridRenderCellParams) => (
        <Typography variant='body2' sx={{ color: 'text.primary' }}>
          {params.row.contents_status_name}
        </Typography>
      )
    },
    {
      width: 150,
      field: 'publish_date',
      headerName: t.SCREEN_COL_CONTENTS_LIST_PUBLISHDATE,
      renderCell: (params: GridRenderCellParams) => (
        <Typography variant='body2' sx={{ color: 'text.primary' }}>
          {dateFormatApi2DisplayYYYYMMDD(params.row.publish_date || '')}
        </Typography>
      )
    },
    {
      width: 150,
      field: 'transition_all',
      headerName: t.SCREEN_COL_CONTENTS_LIST_TRANSITION_ALL,
      renderCell: (params: GridRenderCellParams) => (
        <Typography variant='body2' sx={{ color: 'text.primary' }}>
          {params.row.transition_all}
        </Typography>
      )
    },
    {
      width: 150,
      field: 'transition_last_month',
      headerName: t.SCREEN_COL_CONTENTS_LIST_TRANSITION_LAST_MONTH,
      renderCell: (params: GridRenderCellParams) => (
        <Typography variant='body2' sx={{ color: 'text.primary' }}>
          {params.row.transition_last_month}
        </Typography>
      )
    },
    {
      width: 350,
      field: 'title',
      headerName: t.SCREEN_COL_CONTENTS_LIST_TITLE,
      renderCell: (params: GridRenderCellParams) => (
        <Typography variant='body2' sx={{ color: 'text.primary' }}>
          {(params.row.contents_details &&
            params.row.contents_details.length > 0 &&
            params.row.contents_details[0].title) ||
            ''}
        </Typography>
      )
    }
  ]

  return (
    <Card>
      <CardHeader
        title={t.SCREEN_TITLE_CONTENTS_LIST}
        action={
          <Button onClick={onClickNew} variant='contained'>
            {t.BUTTON_NEW}
          </Button>
        }
      />
      <DataGrid
        autoHeight
        slots={{ toolbar: ExportToolbar }}
        rows={contentsService.contentsList}
        columns={columns}
        disableRowSelectionOnClick
        pageSizeOptions={[7, 10, 25, 50]}
        paginationModel={paginationModel}
        columnVisibilityModel={hideNameColumn}
        onPaginationModelChange={setPaginationModel}
        onColumnVisibilityModelChange={newValue => setHideNameColumn(newValue)}
      />
      <Backdrop sx={{ color: '#fff', zIndex: theme => theme.zIndex.drawer + 1 }} open={contentsService.loading}>
        <CircularProgress color='inherit' />
      </Backdrop>
    </Card>
  )
}

export default ContentsList
