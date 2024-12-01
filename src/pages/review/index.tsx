// ** React Imports
import { useEffect, useState } from 'react'

// ** Hook
import { useLocale } from '@/@core/hooks/useLocal'

// ** MUI Imports
import Card from '@mui/material/Card'
import Typography from '@mui/material/Typography'
import CardHeader from '@mui/material/CardHeader'
import { Alert, AlertColor, Backdrop, Button, CircularProgress, Snackbar } from '@mui/material'
import { DataGrid, GridColDef, GridColumnVisibilityModel, GridRenderCellParams } from '@mui/x-data-grid'

// ** Data Import
import { useRouter } from 'next/router'
import ReviewService from '@/service/ReviewService'
import Link from 'next/link'
import { REVIEW_STATUS } from '@/@core/utils/constant'

const PayoutList = () => {
  const { t } = useLocale()
  const { locale } = useRouter()

  // ** States
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 })
  const [hideNameColumn, setHideNameColumn] = useState<GridColumnVisibilityModel>({ full_name: true })

  const [openError, setOpenError] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [severity] = useState<AlertColor | undefined>('error')

  // ** Service
  const reviewService = ReviewService()

  useEffect(() => {
    reviewService.GetReviewList()

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [locale])

  const onApprove = async (id: string) => {
    const res = await reviewService.Approve(id)
    if (res.message != '') {
      setOpenError(true)
      setErrorMessage(res.message)
    } else {
      reviewService.GetReviewList()
    }
  }

  const onDeny = async (id: string) => {
    const res = await reviewService.Deny(id)
    if (res.message != '') {
      setOpenError(true)
      setErrorMessage(res.message)
    } else {
      reviewService.GetReviewList()
    }
  }

  const handleCloseSnackbar = () => {
    setOpenError(false)
  }

  const columns: GridColDef[] = [
    {
      flex: 0.3,
      minWidth: 2,
      field: 'id',
      headerName: 'ID',
      valueGetter: params => new Date(params.value),
      renderCell: (params: GridRenderCellParams) => (
        <Typography variant='body2' sx={{ color: 'text.primary' }}>
          <Link href={`/review/detail/${params.row.id}`}>{params.row.id}</Link>
        </Typography>
      )
    },
    {
      flex: 0.3,
      width: 1,
      field: 'review_status_name',
      headerName: t.SCREEN_REVIEW_COL_STATUS,
      renderCell: (params: GridRenderCellParams) => (
        <Typography variant='body2' sx={{ color: 'text.primary' }}>
          {params.row.review_status_name} {params.row.review_status_cd}
        </Typography>
      )
    },
    {
      flex: 0.4,
      minWidth: 1,
      field: 'review_datetime',
      headerName: t.SCREEN_REVIEW_COL_REVIEW,
      renderCell: (params: GridRenderCellParams) => (
        <Typography variant='body2' sx={{ color: 'text.primary' }}>
          {params.row.review_datetime}
        </Typography>
      )
    },
    {
      flex: 0.5,
      width: 1,
      field: 'shop_name',
      headerName: t.SCREEN_REVIEW_COL_SHOP_NAME,
      renderCell: (params: GridRenderCellParams) => (
        <Typography variant='body2' sx={{ color: 'text.primary' }}>
          {params.row.shop_name}
        </Typography>
      )
    },
    {
      flex: 0.2,
      width: 1,
      field: 'review_evaluation_value',
      headerName: t.SCREEN_REVIEW_COL_RATING,
      renderCell: (params: GridRenderCellParams) => (
        <Typography variant='body2' sx={{ color: 'text.primary' }}>
          {params.row.review_contents &&
            params.row.review_contents.length > 0 &&
            params.row.review_contents[0].review_evaluation_value}
        </Typography>
      )
    },
    {
      flex: 0.5,
      width: 1,
      field: 'review_comment',
      headerName: t.SCREEN_REVIEW_COL_REVIEW_COMMENT,
      renderCell: (params: GridRenderCellParams) => (
        <Typography variant='body2' sx={{ color: 'text.primary' }}>
          {params.row.review_contents &&
            params.row.review_contents.length > 0 &&
            params.row.review_contents[0].review_comment}
        </Typography>
      )
    },
    {
      flex: 0.3,
      width: 1,
      field: 'shop_status_cd',
      headerName: 'Actions',
      renderCell: (params: GridRenderCellParams) => (
        <>
          {String(params.row.review_status_cd) == REVIEW_STATUS.NOT_APPROVED && (
            <Button
              size='small'
              variant='contained'
              color='primary'
              onClick={() => onApprove(params.row.id)}
              sx={{ mr: 2 }}
            >
              {t.BUTTON_REVIEW_APPROVE}
            </Button>
          )}
          <Button size='small' variant='contained' color='error' onClick={() => onDeny(params.row.id)} sx={{ mr: 2 }}>
            {t.BUTTON_REVIEW_DENY}
          </Button>
        </>
      )
    }
  ]

  return (
    <Card>
      <CardHeader title={t.SCREEN_TITLE_REVIEW} />
      <DataGrid
        autoHeight
        rows={reviewService.reviewList}
        columns={columns}
        disableRowSelectionOnClick
        pageSizeOptions={[7, 10, 25, 50]}
        paginationModel={paginationModel}
        columnVisibilityModel={hideNameColumn}
        onPaginationModelChange={setPaginationModel}
        onColumnVisibilityModelChange={newValue => setHideNameColumn(newValue)}
      />
      <Backdrop sx={{ color: '#fff', zIndex: theme => theme.zIndex.drawer + 1 }} open={reviewService.loading}>
        <CircularProgress color='inherit' />
      </Backdrop>
      <Snackbar
        anchorOrigin={{ horizontal: 'center', vertical: 'top' }}
        open={openError}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
      >
        <Alert
          onClose={handleCloseSnackbar}
          variant='filled'
          severity={severity}
          sx={{ width: '100%', fontSize: '1.2rem' }}
        >
          {errorMessage}
        </Alert>
      </Snackbar>
    </Card>
  )
}

export default PayoutList
