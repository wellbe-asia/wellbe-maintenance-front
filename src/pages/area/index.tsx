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
import { AreaType } from '@/@core/api/type/cArea'
import AreaApi from '@/@core/api/factoryArea'
import { getLanguageCdWithValue } from '@/configs/locales/locales'
import Link from 'next/link'

const AreaList = () => {
  const { t } = useLocale()
  const router = useRouter()

  // ** States
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 })
  const [hideNameColumn, setHideNameColumn] = useState<GridColumnVisibilityModel>({ full_name: true })
  const [areas, setAreas] = useState<AreaType[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    Init()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.locale])

  const Init = async () => {
    if (router.locale) {
      setLoading(true)
      try {
        const languageCd = getLanguageCdWithValue(router.locale)
        const res = await AreaApi.GetCareasWithLanguage(languageCd)
        if (res.data.c_areas && res.data.c_areas.length > 0) {
          setAreas(res.data.c_areas)
        }
      } finally {
        setLoading(false)
      }
    }
  }

  const onClickNew = () => {
    router.push('/area/new/')
  }

  const columns: GridColDef[] = [
    {
      width: 100,
      field: 'id',
      headerName: t.SCREEN_TITLE_AREA_LIST_AREA_CD,
      valueGetter: params => new Date(params.value),
      renderCell: (params: GridRenderCellParams) => (
        <Link href={`/area/${params.row.area_cd}`} target='_blank'>
          <Typography variant='body2' sx={{ color: 'text.primary' }}>
            {params.row.area_cd}
          </Typography>
        </Link>
      )
    },
    {
      width: 200,
      field: 'area_name',
      headerName: t.SCREEN_TITLE_AREA_LIST_AREA_NAME,
      renderCell: (params: GridRenderCellParams) => (
        <Typography variant='body2' sx={{ color: 'text.primary' }}>
          {params.row.area_name}
        </Typography>
      )
    },
    {
      width: 150,
      field: 'search_area_name_seo',
      headerName: t.SCREEN_TITLE_AREA_LIST_URL,
      renderCell: (params: GridRenderCellParams) => (
        <Typography variant='body2' sx={{ color: 'text.primary' }}>
          {params.row.search_area_name_seo}
        </Typography>
      )
    },
    {
      width: 150,
      field: 'west_longitude',
      headerName: t.SCREEN_TITLE_AREA_LIST_WEST,
      renderCell: (params: GridRenderCellParams) => (
        <Typography variant='body2' sx={{ color: 'text.primary' }}>
          {params.row.west_longitude}
        </Typography>
      )
    },
    {
      width: 150,
      field: 'east_longitude',
      headerName: t.SCREEN_TITLE_AREA_LIST_EAST,
      renderCell: (params: GridRenderCellParams) => (
        <Typography variant='body2' sx={{ color: 'text.primary' }}>
          {params.row.east_longitude}
        </Typography>
      )
    },
    {
      width: 150,
      field: 'north_latitude',
      headerName: t.SCREEN_TITLE_AREA_LIST_NORTH,
      renderCell: (params: GridRenderCellParams) => (
        <Typography variant='body2' sx={{ color: 'text.primary' }}>
          {params.row.north_latitude}
        </Typography>
      )
    },
    {
      width: 150,
      field: 'south_latitude',
      headerName: t.SCREEN_TITLE_AREA_LIST_SOUTH,
      renderCell: (params: GridRenderCellParams) => (
        <Typography variant='body2' sx={{ color: 'text.primary' }}>
          {params.row.south_latitude}
        </Typography>
      )
    },
    {
      width: 100,
      field: 'state_cd',
      headerName: t.SCREEN_TITLE_AREA_LIST_STATE,
      valueGetter: params => new Date(params.value),
      renderCell: (params: GridRenderCellParams) => (
        <Typography variant='body2' sx={{ color: 'text.primary' }}>
          {params.row.state_cd}
        </Typography>
      )
    },
    {
      width: 100,
      field: 'summary_area_flg',
      headerName: t.SCREEN_TITLE_AREA_LIST_SUMMARY,
      valueGetter: params => new Date(params.value),
      renderCell: (params: GridRenderCellParams) => (
        <Typography variant='body2' sx={{ color: 'text.primary' }}>
          {params.row.summary_area_flg ? 'YES' : 'NO'}
        </Typography>
      )
    },
    {
      width: 200,
      field: 'botpress_kb_id',
      headerName: t.SCREEN_TITLE_AREA_LIST_KBID,
      valueGetter: params => new Date(params.value),
      renderCell: (params: GridRenderCellParams) => (
        <Typography variant='body2' sx={{ color: 'text.primary' }}>
          {params.row.botpress_kb_id}
        </Typography>
      )
    }
  ]

  return (
    <Card>
      <CardHeader
        title={t.SCREEN_TITLE_AREA_LIST}
        action={
          <Button onClick={onClickNew} variant='contained'>
            {t.BUTTON_NEW}
          </Button>
        }
      />
      <DataGrid
        autoHeight
        slots={{ toolbar: ExportToolbar }}
        getRowId={row => row.area_cd}
        rows={areas}
        columns={columns}
        disableRowSelectionOnClick
        pageSizeOptions={[7, 10, 25, 50]}
        paginationModel={paginationModel}
        columnVisibilityModel={hideNameColumn}
        onPaginationModelChange={setPaginationModel}
        onColumnVisibilityModelChange={newValue => setHideNameColumn(newValue)}
      />
      <Backdrop sx={{ color: '#fff', zIndex: theme => theme.zIndex.drawer + 1 }} open={loading}>
        <CircularProgress color='inherit' />
      </Backdrop>
    </Card>
  )
}

export default AreaList
