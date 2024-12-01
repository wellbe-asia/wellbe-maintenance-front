// ** React Imports
import { useEffect, useState } from 'react'

// ** Hook
import { useLocale } from '@/@core/hooks/useLocal'

// ** MUI Imports
import Card from '@mui/material/Card'
import Typography from '@mui/material/Typography'
import CardHeader from '@mui/material/CardHeader'
import {
  Backdrop,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField
} from '@mui/material'
import { DataGrid, GridColDef, GridColumnVisibilityModel, GridRenderCellParams } from '@mui/x-data-grid'

// ** Data Import
import { useRouter } from 'next/router'
import { getLanguageCdWithValue } from '@/configs/locales/locales'
import { dateFormatApi2DisplayYYYYMMDD } from '@/@core/utils/date'
import ShopScrapingKeywordQueService from '@/service/ShopScrapingKeywordQue'

const ContentsList = () => {
  const { t } = useLocale()
  const router = useRouter()

  // ** States
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 })
  const [hideNameColumn, setHideNameColumn] = useState<GridColumnVisibilityModel>({ full_name: true })
  const [openModal, setOpenModal] = useState(false)
  const [keyword, setKeyword] = useState('')
  const [errMessage, setErrMessage] = useState('')

  const closeModal = () => {
    setOpenModal(false)
  }

  // ** Service
  const shopScrapingKeywordQueService = ShopScrapingKeywordQueService()

  const onCreate = async () => {
    const res = await shopScrapingKeywordQueService.Create(keyword)
    if (res.message) {
      setErrMessage(res.message)
    } else {
      setOpenModal(false)
      shopScrapingKeywordQueService.GetQueList('99991231')
    }
  }

  useEffect(() => {
    if (router.locale && getLanguageCdWithValue(router.locale)) {
      shopScrapingKeywordQueService.GetQueList('99991231')
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.locale])

  const onClickNew = () => {
    setOpenModal(true)
  }

  const columns: GridColDef[] = [
    {
      flex: 0.1,
      minWidth: 2,
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
      flex: 0.2,
      minWidth: 3,
      field: 'keyword',
      headerName: t.SCREEN_COL_SCRAPING_KEYWORD_LIST_TITLE,
      renderCell: (params: GridRenderCellParams) => (
        <Typography variant='body2' sx={{ color: 'text.primary' }}>
          {params.row.keyword}
        </Typography>
      )
    },
    {
      flex: 0.1,
      minWidth: 1,
      field: 'last_scraping_date',
      headerName: t.SCREEN_COL_SCRAPING_KEYWORD_LIST_LAST_SCRAPINGDATE,
      renderCell: (params: GridRenderCellParams) => (
        <Typography variant='body2' sx={{ color: 'text.primary' }}>
          {dateFormatApi2DisplayYYYYMMDD(params.row.last_scraping_date || '')}
        </Typography>
      )
    }
  ]

  return (
    <Card>
      <CardHeader
        title={t.SCREEN_TITLE_SCRAPING_KEYWORD_LIST}
        action={
          <Button onClick={onClickNew} variant='contained'>
            {t.BUTTON_NEW}
          </Button>
        }
      />
      <DataGrid
        autoHeight
        rows={shopScrapingKeywordQueService.queList}
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
        open={shopScrapingKeywordQueService.loading}
      >
        <CircularProgress color='inherit' />
      </Backdrop>
      <Dialog
        open={openModal}
        onClose={closeModal}
        aria-labelledby='alert-dialog-title'
        aria-describedby='alert-dialog-description'
        sx={{ zIndex: '99999' }}
      >
        <DialogTitle id='alert-dialog-title'>{t.SCREEN_COL_SCRAPING_KEYWORD_LIST_TITLE}</DialogTitle>
        <DialogContent sx={{ width: 500 }}>
          <TextField
            value={keyword}
            fullWidth
            placeholder='銀座 ヘッドスパ'
            onChange={e => {
              setKeyword(e.target.value)
            }}
          ></TextField>
          <Typography color={'red'}>{errMessage}</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={onCreate} variant='contained'>
            {t.BUTTON_NEW}
          </Button>
        </DialogActions>
      </Dialog>
    </Card>
  )
}

export default ContentsList
