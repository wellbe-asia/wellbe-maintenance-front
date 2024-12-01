// ** React Imports
import { useEffect, useState } from 'react'
import Link from 'next/link'

// ** Hook
import { useLocale } from '@/@core/hooks/useLocal'

// ** MUI Imports
import Card from '@mui/material/Card'
import Typography from '@mui/material/Typography'
import CardHeader from '@mui/material/CardHeader'
import { Backdrop, Button, CircularProgress, Dialog, DialogActions, DialogTitle } from '@mui/material'
import { DataGrid, GridColDef, GridColumnVisibilityModel, GridRenderCellParams } from '@mui/x-data-grid'

// ** Data Import
import { useRouter } from 'next/router'
import { getLanguageCdWithValue } from '@/configs/locales/locales'
import { dateFormatApi2DisplayYYYYMMDD, sleep } from '@/@core/utils/date'
import ShopScrapingQueService from '@/service/ShopScrapingQue'

const ContentsList = () => {
  const { t } = useLocale()
  const router = useRouter()

  // ** States
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 })
  const [hideNameColumn, setHideNameColumn] = useState<GridColumnVisibilityModel>({ full_name: true })
  const [openModal, setOpenModal] = useState(false)
  const [id, setId] = useState('')

  // ** Service
  const shopScrapingQueService = ShopScrapingQueService()

  useEffect(() => {
    if (router.locale && getLanguageCdWithValue(router.locale)) {
      shopScrapingQueService.GetQueList('99991231')
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.locale])

  const onDelete = async () => {
    shopScrapingQueService.Delete(id)
    await sleep(100)
    await shopScrapingQueService.GetQueList('99991231')
    setOpenModal(false)
  }

  const onOpenModal = (inId: string) => {
    setId(inId)
    setOpenModal(true)
  }

  const columns: GridColDef[] = [
    {
      width: 100,
      field: 'delete',
      headerName: 'Actions',
      renderCell: (params: GridRenderCellParams) => {
        return (
          <Button
            size='small'
            variant='contained'
            onClick={() => {
              onOpenModal(params.row.id)
            }}
            color='error'
          >
            {t.BUTTON_DELETE}
          </Button>
        )
      }
    },
    {
      width: 300,
      field: 'id',
      headerName: t.SCREEN_COL_SCRAPING_KEYWORD_LIST_ID,
      valueGetter: params => new Date(params.value),
      renderCell: (params: GridRenderCellParams) => (
        <Typography variant='body2' sx={{ color: 'text.primary' }}>
          {params.row.id}
        </Typography>
      )
    },
    {
      width: 300,
      field: 'shop_name',
      headerName: t.SCREEN_COL_SCRAPING_LIST_SHOP_NAME,
      renderCell: (params: GridRenderCellParams) => (
        <Typography variant='body2' sx={{ color: 'text.primary' }}>
          {params.row.shop_name}
        </Typography>
      )
    },
    {
      width: 300,
      field: 'shop_url',
      headerName: t.SCREEN_COL_SCRAPING_LIST_URL,
      renderCell: (params: GridRenderCellParams) => (
        <Link href={params.row.shop_url} target='_blank'>
          <Typography variant='body2' sx={{ color: 'text.primary' }}>
            {params.row.shop_url}
          </Typography>
        </Link>
      )
    },
    {
      width: 100,
      field: 'shop_recognize_id',
      headerName: t.SCREEN_COL_SCRAPING_LIST_RECOGNITION_ID,
      renderCell: (params: GridRenderCellParams) => (
        <Typography variant='body2' sx={{ color: 'text.primary' }}>
          {params.row.shop_recognize_id}
        </Typography>
      )
    },
    {
      width: 100,
      field: 'last_scraping_date',
      headerName: t.SCREEN_COL_SCRAPING_LIST_LAST_SCRAPINGDATE,
      renderCell: (params: GridRenderCellParams) => (
        <Typography variant='body2' sx={{ color: 'text.primary' }}>
          {dateFormatApi2DisplayYYYYMMDD(params.row.last_scraping_date || '')}
        </Typography>
      )
    }
  ]

  return (
    <Card>
      <CardHeader title={t.SCREEN_TITLE_SCRAPING_LIST} />
      <DataGrid
        autoHeight
        rows={shopScrapingQueService.queList}
        columns={columns}
        disableRowSelectionOnClick
        pageSizeOptions={[7, 10, 25, 50]}
        paginationModel={paginationModel}
        columnVisibilityModel={hideNameColumn}
        onPaginationModelChange={setPaginationModel}
        onColumnVisibilityModelChange={newValue => setHideNameColumn(newValue)}
      />
      <Backdrop sx={{ color: '#fff', zIndex: theme => theme.zIndex.drawer + 1 }} open={shopScrapingQueService.loading}>
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

export default ContentsList
