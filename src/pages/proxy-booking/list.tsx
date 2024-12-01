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
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  Grid,
  TextField
} from '@mui/material'
import { DataGrid, GridColDef, GridColumnVisibilityModel, GridRenderCellParams } from '@mui/x-data-grid'

// ** Data Import
import { useRouter } from 'next/router'
import BookingService from '@/service/BookingService'
import Link from 'next/link'
import { getLanguageCdWithValue } from '@/configs/locales/locales'
import { BOOKING_STATUS, DEFAULT_LANGUAGE } from '@/@core/utils/constant'
import { BookingType } from '@/@core/api/type/booking'

import styles from 'styles/booking.module.scss'
import { dateFormatApi2DisplayYYYYMMDD } from '@/@core/utils/date'
import ShopBookingService from '@/service/ShopBookingService'
import ExportToolbar from '@/views/maintenance/ExportToolbar'

const BookingList = () => {
  const { t } = useLocale()
  const router = useRouter()

  // ** States
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 })
  const [hideNameColumn, setHideNameColumn] = useState<GridColumnVisibilityModel>({ full_name: true })
  const [values, setValues] = useState<BookingType>()
  const [cancelReason, setCancelReason] = useState('')
  const [candidateToggle, setCandidateToggle] = useState(false)
  const [cancelErrorMessage, setCancelErrorMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [approvalErrorMessage, setApprovalErrorMessage] = useState('')

  // ** Service
  const bookingService = BookingService()
  const shopBookingService = ShopBookingService()

  const onApproveReschedule = async (shopBookingId: string, dateOfBooking: string, timeOfBooking: string) => {
    try {
      setLoading(true)
      const res = await shopBookingService.Approve(shopBookingId, dateOfBooking, timeOfBooking)

      if (res.message) {
        setApprovalErrorMessage(res.message)
      } else {
        const varLanguageCd = getLanguageCdWithValue(router.locale || DEFAULT_LANGUAGE)
        if (varLanguageCd) {
          bookingService.GetProxyBookingList(varLanguageCd)
        }
        setCandidateToggle(false)
      }
    } finally {
      setLoading(false)
    }
  }

  const onCancel = async (shopBookingId: string) => {
    try {
      setLoading(true)
      if (!cancelReason) {
        setCancelErrorMessage(t.MESSAGE_REQUIRED_TEXTFIELD)

        return
      }
      const res = await shopBookingService.Cancel(shopBookingId, cancelReason)
      if (res.message) {
        setCancelErrorMessage(res.message)

        return
      } else {
        const varLanguageCd = getLanguageCdWithValue(router.locale || DEFAULT_LANGUAGE)
        if (varLanguageCd) {
          bookingService.GetProxyBookingList(varLanguageCd)
        }

        setCandidateToggle(false)
      }
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const varLanguageCd = getLanguageCdWithValue(router.locale || DEFAULT_LANGUAGE)
    if (varLanguageCd) {
      bookingService.GetProxyBookingList(varLanguageCd)
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.locale])

  const onClickCandidate = (booking: BookingType) => {
    setValues(booking)
    setCandidateToggle(true)
  }

  const columns: GridColDef[] = [
    {
      width: 150,
      field: 'shop_status_cd',
      headerName: 'Actions',
      renderCell: (params: GridRenderCellParams) => {
        return (
          <>
            {params.row?.bookingStatusCd == BOOKING_STATUS.REQUEST && (
              <Button
                onClick={() => {
                  onClickCandidate(params.row)
                }}
                size='small'
                variant='outlined'
                color='secondary'
                sx={{ mr: 2 }}
              >
                {t.BUTTON_APPROVE}
              </Button>
            )}
            {params.row?.bookingStatusCd == BOOKING_STATUS.FIXED && (
              <Button
                onClick={() => {
                  onClickCandidate(params.row)
                }}
                size='small'
                variant='outlined'
                color='secondary'
                sx={{ mr: 2 }}
              >
                {t.BUTTON_CANCEL}
              </Button>
            )}
          </>
        )
      }
    },
    {
      width: 180,
      field: 'bookingNo',
      headerName: t.SCREEN_COL_BOOKING_LIST_BOOKING_NO,
      renderCell: (params: GridRenderCellParams) => (
        <Link href={`/booking/detail/${params.row.bookingNo}`}>{params.row.bookingNo}</Link>
      )
    },
    {
      width: 180,
      field: 'bookingDatetime',
      headerName: t.SCREEN_COL_BOOKING_LIST_BOOKING_DATETIME,
      renderCell: (params: GridRenderCellParams) => (
        <Typography variant='body2' sx={{ color: 'text.primary' }}>
          {params.row.bookingDatetime}
        </Typography>
      )
    },
    {
      width: 150,
      field: 'bookingStatusName',
      headerName: t.SCREEN_COL_BOOKING_LIST_STATUS,
      renderCell: (params: GridRenderCellParams) => (
        <Typography variant='body2' sx={{ color: 'text.primary' }}>
          {params.row.bookingStatusName}
        </Typography>
      )
    },
    {
      width: 150,
      field: 'checkoutStatusName',
      headerName: t.SCREEN_COL_BOOKING_LIST_CHECKOUT_STATUS,
      renderCell: (params: GridRenderCellParams) => (
        <Typography variant='body2' sx={{ color: 'text.primary' }}>
          {params.row.checkoutStatusName}
        </Typography>
      )
    },
    {
      width: 150,
      field: 'bookingAmountBasicalCurrencyBase',
      headerName: t.SCREEN_COL_BOOKING_LIST_BOOKING_AMOUNT,
      renderCell: (params: GridRenderCellParams) => (
        <Typography variant='body2' sx={{ color: 'text.primary' }}>
          {params.row.bookingAmountBasicalCurrencyBase}
        </Typography>
      )
    },
    {
      width: 150,
      field: 'adminFeeBasicalCurrencyBase',
      headerName: t.SCREEN_COL_BOOKING_LIST_ADMIN_FEE,
      renderCell: (params: GridRenderCellParams) => (
        <Typography variant='body2' sx={{ color: 'text.primary' }}>
          {params.row.adminFeeBasicalCurrencyBase}
        </Typography>
      )
    },
    {
      width: 100,
      field: 'basicalCurrencyCdIso',
      headerName: t.SCREEN_COL_BOOKING_LIST_BASE_CURRENCY,
      renderCell: (params: GridRenderCellParams) => (
        <Typography variant='body2' sx={{ color: 'text.primary' }}>
          {params.row.basicalCurrencyCdIso}
        </Typography>
      )
    },
    {
      width: 150,
      field: 'bookingAmountPaymentCurrencyBase',
      headerName: t.SCREEN_COL_BOOKING_LIST_BOOKING_AMOUNT_PAYMENT,
      renderCell: (params: GridRenderCellParams) => (
        <Typography variant='body2' sx={{ color: 'text.primary' }}>
          {params.row.bookingAmountPaymentCurrencyBase}
        </Typography>
      )
    },
    {
      width: 150,
      field: 'adminFeePaymentCurrencyBase',
      headerName: t.SCREEN_COL_BOOKING_LIST_ADMIN_FEE_PAYMENT,
      renderCell: (params: GridRenderCellParams) => (
        <Typography variant='body2' sx={{ color: 'text.primary' }}>
          {params.row.adminFeePaymentCurrencyBase}
        </Typography>
      )
    },
    {
      width: 100,
      field: 'paymentCurrencyCdIso',
      headerName: t.SCREEN_COL_BOOKING_LIST_PAYMENT_CURRENCY,
      renderCell: (params: GridRenderCellParams) => (
        <Typography variant='body2' sx={{ color: 'text.primary' }}>
          {params.row.paymentCurrencyCdIso}
        </Typography>
      )
    },
    {
      width: 300,
      field: 'shopId',
      headerName: t.SCREEN_COL_BOOKING_LIST_SHOP_ID,
      renderCell: (params: GridRenderCellParams) => (
        <Typography variant='body2' sx={{ color: 'text.primary' }}>
          {params.row.shopId}
        </Typography>
      )
    },
    {
      width: 150,
      field: 'shopName',
      headerName: t.SCREEN_COL_BOOKING_LIST_SHOP_NAME,
      renderCell: (params: GridRenderCellParams) => (
        <Typography variant='body2' sx={{ color: 'text.primary' }}>
          {params.row.shopName}
        </Typography>
      )
    },
    {
      width: 180,
      field: 'createDateTimeJst',
      headerName: t.SCREEN_COL_BOOKING_LIST_CREATE_DATETIME_JST,
      renderCell: (params: GridRenderCellParams) => (
        <Typography variant='body2' sx={{ color: 'text.primary' }}>
          {params.row.createDateTimeJst}
        </Typography>
      )
    },
    {
      width: 180,
      field: 'requestAproveDueDateTimeJst',
      headerName: t.SCREEN_COL_BOOKING_LIST_APPROVE_DUE_DATETIME_JST,
      renderCell: (params: GridRenderCellParams) => (
        <Typography variant='body2' sx={{ color: 'text.primary' }}>
          {params.row.requestAproveDueDateTimeJst}
        </Typography>
      )
    },
    {
      width: 180,
      field: 'checkoutDueDateTimeJst',
      headerName: t.SCREEN_COL_BOOKING_LIST_CHECKOUT_DUE_DATETIME_JST,
      renderCell: (params: GridRenderCellParams) => (
        <Typography variant='body2' sx={{ color: 'text.primary' }}>
          {params.row.checkoutDueDateTimeJst}
        </Typography>
      )
    },
    {
      width: 180,
      field: 'bookingDateTimeJst',
      headerName: t.SCREEN_COL_BOOKING_LIST_BOOKING_DATETIME_JST,
      renderCell: (params: GridRenderCellParams) => (
        <Typography variant='body2' sx={{ color: 'text.primary' }}>
          {params.row.bookingDateTimeJst}
        </Typography>
      )
    },
    {
      width: 180,
      field: 'cancelDateTimeJst',
      headerName: t.SCREEN_COL_BOOKING_LIST_CANCEL_DATETIME_JST,
      renderCell: (params: GridRenderCellParams) => (
        <Typography variant='body2' sx={{ color: 'text.primary' }}>
          {params.row.cancelDateTimeJst}
        </Typography>
      )
    }
  ]

  return (
    <Card>
      <CardHeader title={t.SCREEN_TITLE_PROXY_BOOKING_LIST} />
      <DataGrid
        autoHeight
        slots={{ toolbar: ExportToolbar }}
        rows={bookingService.bookings}
        columns={columns}
        disableRowSelectionOnClick
        pageSizeOptions={[7, 10, 25, 50]}
        paginationModel={paginationModel}
        columnVisibilityModel={hideNameColumn}
        onPaginationModelChange={setPaginationModel}
        onColumnVisibilityModelChange={newValue => setHideNameColumn(newValue)}
      />
      <Backdrop sx={{ color: '#fff', zIndex: theme => theme.zIndex.drawer + 1 }} open={bookingService.loading}>
        <CircularProgress color='inherit' />
      </Backdrop>
      <Dialog
        open={candidateToggle}
        onClose={() => {
          setCandidateToggle(false)
        }}
      >
        <DialogTitle>{t.BUTTON_CONFIRM_BOOKING_CANDIDATES}</DialogTitle>
        <DialogContent>
          {values?.bookingStatusCd == BOOKING_STATUS.REQUEST && (
            <>
              <DialogContentText>{t.SCREEN_COL_BOOKING_SELECT_CANDIDATES}</DialogContentText>
              <Box className={styles.candidates}>
                <Box>
                  <Box sx={{ mt: 5 }}>{t.SCREEN_COL_BOOKING_DATE_FIRST_PRIORITY}</Box>
                  <Grid container spacing={1}>
                    {values &&
                      values.firstPriorityRequestCandidates &&
                      values.firstPriorityRequestCandidates.map((v, i) => {
                        return (
                          <Grid key={i} item xs={12} sm={6} md={4}>
                            <Button
                              variant='contained'
                              sx={{ mr: 5 }}
                              onClick={() => {
                                onApproveReschedule(values.id || '', v.bookingRequestDate, v.bookingRequestTimeStart)
                              }}
                              disabled={loading}
                            >
                              {(v.bookingRequestDate ? dateFormatApi2DisplayYYYYMMDD(v.bookingRequestDate) : '') +
                                ' ' +
                                v.bookingRequestTimeStart +
                                '~' +
                                v.bookingRequestTimeEnd}
                            </Button>
                          </Grid>
                        )
                      })}
                  </Grid>
                </Box>
                <Box>
                  <Box sx={{ mt: 5 }}>{t.SCREEN_COL_BOOKING_DATE_SECOND_PRIORITY}</Box>
                  <Grid container spacing={2}>
                    {values &&
                      values.secondPriorityRequestCandidates &&
                      values.secondPriorityRequestCandidates.map((v, i) => {
                        return (
                          <Grid key={i} item xs={12} sm={6} md={4}>
                            <Button
                              variant='contained'
                              sx={{ mr: 5 }}
                              onClick={() => {
                                onApproveReschedule(values.id || '', v.bookingRequestDate, v.bookingRequestTimeStart)
                              }}
                              disabled={loading}
                            >
                              {(v.bookingRequestDate ? dateFormatApi2DisplayYYYYMMDD(v.bookingRequestDate) : '') +
                                ' ' +
                                v.bookingRequestTimeStart +
                                '~' +
                                v.bookingRequestTimeEnd}
                            </Button>
                          </Grid>
                        )
                      })}
                  </Grid>
                </Box>
                <Box>
                  <Box sx={{ mt: 5 }}>{t.SCREEN_COL_BOOKING_DATE_THIRD_PRIORITY}</Box>
                  <Grid container spacing={2}>
                    {values &&
                      values.thirdPriorityRequestCandidates &&
                      values.thirdPriorityRequestCandidates.map((v, i) => {
                        return (
                          <Grid key={i} item xs={12} sm={6} md={4}>
                            <Button
                              variant='contained'
                              sx={{ mr: 5 }}
                              disabled={loading}
                              onClick={() => {
                                onApproveReschedule(values.id || '', v.bookingRequestDate, v.bookingRequestTimeStart)
                              }}
                            >
                              {(v.bookingRequestDate ? dateFormatApi2DisplayYYYYMMDD(v.bookingRequestDate) : '') +
                                ' ' +
                                v.bookingRequestTimeStart +
                                '~' +
                                v.bookingRequestTimeEnd}
                            </Button>
                          </Grid>
                        )
                      })}
                  </Grid>
                </Box>
                <Typography variant='subtitle1' color='error'>
                  {approvalErrorMessage}
                </Typography>
              </Box>
            </>
          )}
          <Divider sx={{ mt: 10 }} />
          <Box sx={{ mt: 2 }}>
            <DialogContentText>{t.SCREEN_COL_BOOKING_SELECT_CANDIDATES_OR_CANCEL}</DialogContentText>
            <TextField
              autoFocus
              margin='dense'
              required
              id='name'
              label={t.SCREEN_COL_BOOKING_CANCEL_MODAL_REASON}
              type='text'
              fullWidth
              onBlur={e => {
                setCancelReason(e.target.value)
              }}
              variant='standard'
            />
            <Typography variant='subtitle1' color='error'>
              {cancelErrorMessage}
            </Typography>
            <div style={{ width: '100%', display: 'flex', flexDirection: 'row-reverse' }}>
              <Button
                color='error'
                variant='contained'
                type='submit'
                sx={{ mt: 2 }}
                disabled={loading}
                onClick={() => {
                  onCancel((values && values.id) || '')
                }}
              >
                {t.SCREEN_COL_BOOKING_CANCEL_MODAL_CONFIRM}
              </Button>
            </div>
          </Box>
        </DialogContent>
        <Box className='sidebar-body' sx={{ p: theme => theme.spacing(5, 6) }}></Box>
      </Dialog>
    </Card>
  )
}

export default BookingList
