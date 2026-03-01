// ** MUI Imports
import Box from '@mui/material/Box'
import {
  Button,
  Dialog,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Paper,
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography
} from '@mui/material'

// ** css
import styles from 'styles/booking.module.scss'

// ** service
import BookingService from '@/service/BookingService'

// ** API
import BookingAPI from '@/@core/api/factoryBooking'
import { BookingEventType } from '@/@core/api/type/booking'

// ** hook
import { useLocale } from 'src/@core/hooks/useLocal'
import { useCallback, useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { getLanguageCdWithValue } from '@/configs/locales/locales'
import ListErrors from '@/@core/components/list-errors'
import WellbeAccountService from '@/service/WellbeAccountService'
import ShopBookingService from '@/service/ShopBookingService'
import { BOOKING_STATUS, DEFAULT_LANGUAGE } from '@/@core/utils/constant'
import { dateFormatApi2DisplayYYYYMMDD } from '@/@core/utils/date'

export default function BookingDetail() {
  const { t } = useLocale()
  const router = useRouter()
  const [bookingNo, setShopNo] = useState<string | undefined>(
    [router.query.pid].flat(1).length > 0 ? [router.query.pid].flat(1)[0] : ''
  )
  const [errors, setErrors] = useState<string[]>([])
  const [bookingEvents, setBookingEvents] = useState<BookingEventType[]>([])
  const [eventsLoading, setEventsLoading] = useState(false)
  const [detailDialogOpen, setDetailDialogOpen] = useState(false)
  const [selectedEventDetail, setSelectedEventDetail] = useState<string>('')
  const [approvalDialogOpen, setApprovalDialogOpen] = useState(false)
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false)
  const [cancelReason, setCancelReason] = useState('')
  const [approvalErrorMessage, setApprovalErrorMessage] = useState('')
  const [cancelErrorMessage, setCancelErrorMessage] = useState('')
  const [actionLoading, setActionLoading] = useState(false)
  const [rescheduleDialogOpen, setRescheduleDialogOpen] = useState(false)
  const [newDateOfBooking, setNewDateOfBooking] = useState('')
  const [newTimeOfBooking, setNewTimeOfBooking] = useState('')
  const [rescheduleErrorMessage, setRescheduleErrorMessage] = useState('')

  // Service
  const bookingService = BookingService()
  const wellbeAccountService = WellbeAccountService()
  const shopBookingService = ShopBookingService()

  const fetchBookingEvents = useCallback(async (bookingId: string) => {
    setEventsLoading(true)
    try {
      const res = await BookingAPI.GetBookingEventsByBookingId(bookingId)
      if (res?.data?.result_code === 0 && res.data.booking_events) {
        setBookingEvents(res.data.booking_events)
      } else {
        setBookingEvents([])
      }
    } catch {
      setBookingEvents([])
    } finally {
      setEventsLoading(false)
    }
  }, [])

  const openDetailDialog = (eventDetail: string) => {
    setSelectedEventDetail(eventDetail)
    setDetailDialogOpen(true)
  }

  const openApprovalDialog = () => {
    setApprovalErrorMessage('')
    setApprovalDialogOpen(true)
  }

  const openCancelDialog = () => {
    setCancelReason('')
    setCancelErrorMessage('')
    setCancelDialogOpen(true)
  }

  const onApprove = async () => {
    const booking = bookingService.bookings?.[0]
    if (!booking?.id || !booking.dateOfBooking || !booking.timeOfBooking) {
      setApprovalErrorMessage(t.MESSAGE_REQUIRED_TEXTFIELD)

      return
    }
    try {
      setActionLoading(true)
      setApprovalErrorMessage('')
      const res = await shopBookingService.Approve(
        booking.id,
        booking.dateOfBooking,
        booking.timeOfBooking
      )
      if (res.message) {
        setApprovalErrorMessage(res.message)
      } else {
        const varLanguageCd = getLanguageCdWithValue(router.locale || DEFAULT_LANGUAGE)
        if (varLanguageCd && bookingNo) {
          GetBooking(bookingNo, varLanguageCd)
        }
        setApprovalDialogOpen(false)
      }
    } finally {
      setActionLoading(false)
    }
  }

  const onCancel = async () => {
    try {
      setActionLoading(true)
      if (!cancelReason) {
        setCancelErrorMessage(t.MESSAGE_REQUIRED_TEXTFIELD)

        return
      }
      const bookingId = bookingService.bookings?.[0]?.id
      if (!bookingId) {
        return
      }
      const res = await shopBookingService.Cancel(bookingId, cancelReason)
      if (res.message) {
        setCancelErrorMessage(res.message)

        return
      }
      const varLanguageCd = getLanguageCdWithValue(router.locale || DEFAULT_LANGUAGE)
      if (varLanguageCd && bookingNo) {
        GetBooking(bookingNo, varLanguageCd)
      }
      setCancelDialogOpen(false)
    } finally {
      setActionLoading(false)
    }
  }

  const openRescheduleDialog = () => {
    const booking = bookingService.bookings?.[0]
    if (booking) {
      const dateForInput =
        booking.dateOfBooking?.length === 8
          ? `${booking.dateOfBooking.slice(0, 4)}-${booking.dateOfBooking.slice(4, 6)}-${booking.dateOfBooking.slice(6, 8)}`
          : ''
      setNewDateOfBooking(dateForInput)
      setNewTimeOfBooking(booking.timeOfBooking || '')
    }
    setRescheduleErrorMessage('')
    setRescheduleDialogOpen(true)
  }

  const onReschedule = async () => {
    try {
      setActionLoading(true)
      setRescheduleErrorMessage('')
      if (!newDateOfBooking || !newTimeOfBooking) {
        setRescheduleErrorMessage(t.MESSAGE_REQUIRED_TEXTFIELD)

        return
      }
      const bookingId = bookingService.bookings?.[0]?.id
      if (!bookingId) {
        return
      }
      const dateOfBooking = newDateOfBooking.replace(/-/g, '')
      const res = await shopBookingService.Reschedule(bookingId, dateOfBooking, newTimeOfBooking)
      if (res.message) {
        setRescheduleErrorMessage(res.message)

        return
      }
      const varLanguageCd = getLanguageCdWithValue(router.locale || DEFAULT_LANGUAGE)
      if (varLanguageCd && bookingNo) {
        GetBooking(bookingNo, varLanguageCd)
      }
      setRescheduleDialogOpen(false)
    } finally {
      setActionLoading(false)
    }
  }

  const formatDetailForDisplay = (raw: string): string => {
    if (!raw) return ''
    try {
      const parsed = JSON.parse(raw)

      return JSON.stringify(parsed, null, 2)
    } catch {
      return raw
    }
  }

  useEffect(() => {
    if ([router.query.pid].flat(1).length > 0) {
      setShopNo([router.query.pid].flat(1).length > 0 ? [router.query.pid].flat(1)[0] : '')
    }
  }, [router.query.pid])

  useEffect(() => {
    if (router.locale && getLanguageCdWithValue(router.locale) && bookingNo) {
      const varLanguageCd = getLanguageCdWithValue(router.locale)
      GetBooking(bookingNo, varLanguageCd)
    }

    // Only first time
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.locale, bookingNo])

  useEffect(() => {
    const bookingId = bookingService.bookings?.[0]?.id
    if (bookingId) {
      fetchBookingEvents(bookingId)
    } else {
      setBookingEvents([])
    }
  }, [bookingService.bookings, fetchBookingEvents])

  // get Booking
  const GetBooking = async (inBookingNo: string, languageCd: string) => {
    if (inBookingNo && languageCd) {
      const res = await bookingService.GetBooking(inBookingNo, languageCd)
      if (res.data && res.data.accountId) {
        await wellbeAccountService.GetAccount(res.data.accountId)
      }
    }
  }

  return (
    <>
      <Box>
        <Box sx={{ maxWidth: '1000px', margin: '0 auto 20px auto', display: 'flex', alignItems: 'center', gap: 2 }}>
          <h2 style={{ margin: 0, flex: 1 }}>{t.SCREEN_ACCOUNT_RESERVATION_DETAILS}</h2>
          {bookingService.bookings?.[0]?.bookingStatusCd === BOOKING_STATUS.REQUEST && (
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button variant="contained" color="primary" onClick={openApprovalDialog}>
                {t.BUTTON_APPROVE}
              </Button>
              <Button variant="outlined" color="error" onClick={openCancelDialog}>
                {t.BUTTON_CANCEL}
              </Button>
            </Box>
          )}
          {bookingService.bookings?.[0]?.bookingStatusCd === BOOKING_STATUS.FIXED && (
            <Button variant="contained" color="primary" onClick={openRescheduleDialog}>
              {t.SCREEN_BUTTON_CHANGE_BOOKING_DATETIME}
            </Button>
          )}
        </Box>
        <ListErrors errors={errors} setErrors={setErrors} />
        <Box className={styles.account_wrapper_gray_flex}>
          <Box className={styles.account_flex_wrapper_left}>
            <Box className={styles.reserve_conf_box}>
              {bookingService.bookings && bookingService.bookings.length > 0 && (
                <>
                  <dl style={{ marginBottom: 0 }}>
                    <dt>{t.SCREEN_RESERVATION_NUMBER}</dt>
                    <dd>
                      {bookingService.loading ||
                      bookingService.bookings == undefined ||
                      bookingService.bookings.length == 0 ? (
                        <Skeleton width={'100%'} />
                      ) : (
                        bookingService.bookings[0].bookingNo
                      )}
                    </dd>
                    <dt>{t.SCREEN_ACCOUNT_RESERVATION_STATUS}</dt>
                    <dd>
                      {bookingService.loading ||
                      bookingService.bookings == undefined ||
                      bookingService.bookings.length == 0 ? (
                        <Skeleton width={'100%'} />
                      ) : (
                        bookingService.bookings[0].bookingStatusName +
                        ' (' +
                        bookingService.bookings[0].checkoutStatusName +
                        ')'
                      )}
                    </dd>
                    <dt>{t.SCREEN_SETTLEMENT_DATE}</dt>
                    <dd style={{ whiteSpace: 'pre-wrap' }}>
                      {bookingService.bookings[0].checkoutDueDatetime}
                      <br className={styles.disp_sp} />
                      {t.SCREEN_CHECKOUT_CHECKOUT_DUE_DATE_LOCALTIME}
                    </dd>
                  </dl>
                  <dl>
                    <dt>{t.SCREEN_RESERVATION_DATE_AND_TIME}</dt>
                    <dd>
                      {bookingService.loading ||
                      bookingService.bookings == undefined ||
                      bookingService.bookings.length == 0 ? (
                        <Skeleton width={'100%'} />
                      ) : (
                        bookingService.bookings[0].bookingDatetime
                      )}
                    </dd>
                    <dt>{t.SCREEN_ACCOUNT_RESERVATION_SALON}</dt>
                    <dd>
                      {bookingService.loading ||
                      bookingService.bookings == undefined ||
                      bookingService.bookings.length == 0 ? (
                        <Skeleton width={'100%'} />
                      ) : (
                        <Box sx={{ width: '100%' }}>{bookingService.bookings[0].shopId}</Box>
                      )}
                      {bookingService.loading ||
                      bookingService.bookings == undefined ||
                      bookingService.bookings.length == 0 ? (
                        <Skeleton width={'100%'} />
                      ) : (
                        <Box sx={{ width: '100%' }}>{bookingService.bookings[0].shopName}</Box>
                      )}
                      <Box sx={{ width: '100%' }}>
                        {bookingService.loading ||
                        bookingService.bookings == undefined ||
                        bookingService.bookings.length == 0 ? (
                          <Skeleton width={'100%'} />
                        ) : (
                          bookingService.bookings[0].countryName +
                          ' ' +
                          bookingService.bookings[0].stateName +
                          ' ' +
                          bookingService.bookings[0].address1 +
                          ' ' +
                          bookingService.bookings[0].address2 +
                          ' ' +
                          bookingService.bookings[0].address3
                        )}
                      </Box>
                      <Box sx={{ width: '100%' }}>{bookingService.bookings[0].shopEmailAddress}</Box>
                    </dd>
                  </dl>
                  <dl>
                    <dt>{t.SCREEN_ACCOUNT_ACCOUNT_ID}</dt>
                    <dd>
                      {bookingService.loading ||
                      bookingService.bookings == undefined ||
                      bookingService.bookings.length == 0 ? (
                        <Skeleton width={'100%'} />
                      ) : (
                        <Box sx={{ width: '100%' }}>{wellbeAccountService.account?.account_no}</Box>
                      )}
                      <Box sx={{ width: '100%' }}>
                        {bookingService.loading ||
                        bookingService.bookings == undefined ||
                        bookingService.bookings.length == 0 ? (
                          <Skeleton width={'100%'} />
                        ) : (
                          wellbeAccountService.account?.family_name + ' ' + wellbeAccountService.account?.given_name
                        )}
                      </Box>
                      <Box sx={{ width: '100%' }}>
                        {bookingService.loading ||
                        bookingService.bookings == undefined ||
                        bookingService.bookings.length == 0 ? (
                          <Skeleton width={'100%'} />
                        ) : (
                          wellbeAccountService.account?.email_address
                        )}
                      </Box>
                    </dd>
                  </dl>
                  <h3>{t.SCREEN_ACCOUNT_RESERVATION_MENU}</h3>
                  {bookingService.loading ||
                  bookingService.bookings == undefined ||
                  bookingService.bookings.length == 0 ? (
                    <Skeleton width={'100%'} sx={{ marginTop: 0 }} />
                  ) : (
                    <ol>
                      {bookingService.bookings &&
                        bookingService.bookings.length > 0 &&
                        bookingService.bookings[0].bookingMenues.map(v => {
                          return (
                            <>
                              <li>{v.menuName}</li>
                              <ul>
                                <li>
                                  {v.numberOfMale == '0' || t.SCREEN_MEN + ' ' + v.numberOfMale}{' '}
                                  {v.numberOfFemale == '0' || t.SCREEN_WOMAN + ' ' + v.numberOfFemale}
                                </li>
                                <li>
                                  {v.amount} {v.currencyCdIso}
                                </li>
                              </ul>
                            </>
                          )
                        })}
                    </ol>
                  )}
                  <dl style={{ justifyContent: 'space-between' }}>
                    <dt>{t.SCREEN_ACCOUNT_RESERVATION_ADMIN_FEE}</dt>
                    <dd className={styles.price} style={{ justifyContent: 'end' }}>
                      {bookingService.loading ||
                      bookingService.bookings == undefined ||
                      bookingService.bookings.length == 0 ? (
                        <Skeleton width={'100%'} />
                      ) : (
                        bookingService.bookings[0].adminFeeBasicalCurrencyBase +
                        ' ' +
                        bookingService.bookings[0].basicalCurrencyCdIso
                      )}
                    </dd>
                    <dt>{t.SCREEN_ACCOUNT_RESERVATION_TOTAL_AMOUNT}</dt>
                    <dd className={styles.price} style={{ justifyContent: 'end' }}>
                      {bookingService.loading ||
                      bookingService.bookings == undefined ||
                      bookingService.bookings.length == 0 ? (
                        <Skeleton width={'100%'} />
                      ) : (
                        bookingService.bookings[0].totalAmountBasicalCurrencyBase +
                        ' ' +
                        bookingService.bookings[0].basicalCurrencyCdIso
                      )}
                    </dd>
                  </dl>
                  <p>
                    {bookingService.loading ||
                    bookingService.bookings == undefined ||
                    bookingService.bookings.length == 0 ? (
                      <Skeleton width={'100%'} />
                    ) : (
                      bookingService.bookings[0].request
                    )}
                  </p>
                </>
              )}
            </Box>
          </Box>
        </Box>

        {/* 予約の変更履歴 */}
        {bookingService.bookings && bookingService.bookings.length > 0 && (
          <Box sx={{ maxWidth: '1000px', margin: '24px auto 0', paddingBottom: 3 }}>
            <h3 style={{ marginBottom: 16 }}>{t.SCREEN_TITLE_BOOKING_EVENTS}</h3>
            {eventsLoading ? (
              <Skeleton variant="rectangular" height={120} />
            ) : bookingEvents.length === 0 ? (
              <Box sx={{ py: 2, color: 'text.secondary' }}>—</Box>
            ) : (
              <TableContainer component={Paper} variant="outlined">
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>{t.SCREEN_COL_BOOKING_EVENT_DATETIME}</TableCell>
                      <TableCell>{t.SCREEN_COL_BOOKING_EVENT_TITLE}</TableCell>
                      <TableCell>{t.SCREEN_COL_BOOKING_EVENT_SUMMARY}</TableCell>
                      <TableCell>{t.SCREEN_COL_BOOKING_EVENT_FUNCTION_NAME}</TableCell>
                      <TableCell align="right">{t.BUTTON_DETAIL}</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {bookingEvents.map(row => (
                      <TableRow key={row.id}>
                        <TableCell sx={{ whiteSpace: 'nowrap' }}>{row.create_datetime}</TableCell>
                        <TableCell>{row.event_title}</TableCell>
                        <TableCell sx={{ maxWidth: 280 }}>{row.event_summary}</TableCell>
                        <TableCell>{row.function_name}</TableCell>
                        <TableCell align="right">
                          <Button
                            size="small"
                            variant="outlined"
                            onClick={() => openDetailDialog(row.event_detail)}
                          >
                            {t.BUTTON_DETAIL}
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </Box>
        )}

        <Dialog
          open={detailDialogOpen}
          onClose={() => setDetailDialogOpen(false)}
          maxWidth="md"
          fullWidth
          PaperProps={{ sx: { minHeight: '50vh' } }}
        >
          <DialogTitle>{t.BUTTON_DETAIL}</DialogTitle>
          <DialogContent>
            <Box
              component="pre"
              sx={{
                p: 2,
                bgcolor: 'grey.100',
                borderRadius: 1,
                overflow: 'auto',
                fontSize: '0.8rem',
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-all'
              }}
            >
              {formatDetailForDisplay(selectedEventDetail)}
            </Box>
          </DialogContent>
        </Dialog>

        <Dialog open={approvalDialogOpen} onClose={() => setApprovalDialogOpen(false)} maxWidth="xs" fullWidth>
          <DialogTitle>{t.SCREEN_APPROVE_DIALOG_TITLE}</DialogTitle>
          <DialogContent>
            <DialogContentText sx={{ mb: 2 }}>
              {t.SCREEN_COL_BOOKING_SELECT_CANDIDATES}
            </DialogContentText>
            <Typography variant="subtitle1" color="error" sx={{ mb: 2 }}>
              {approvalErrorMessage}
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
              <Button variant="outlined" onClick={() => setApprovalDialogOpen(false)} disabled={actionLoading}>
                {t.SCREEN_BUTTON_CLOSE_DIALOG}
              </Button>
              <Button variant="contained" color="primary" onClick={onApprove} disabled={actionLoading}>
                {t.SCREEN_APPROVE_DIALOG_CONFIRM}
              </Button>
            </Box>
          </DialogContent>
        </Dialog>

        <Dialog open={cancelDialogOpen} onClose={() => setCancelDialogOpen(false)} maxWidth="sm" fullWidth>
          <DialogTitle>{t.SCREEN_CANCEL_DIALOG_TITLE}</DialogTitle>
          <DialogContent>
            <DialogContentText sx={{ mb: 2 }}>{t.SCREEN_COL_BOOKING_CANCEL_MODAL_LEAD}</DialogContentText>
            <TextField
              autoFocus
              margin="dense"
              required
              id="cancel-reason"
              label={t.SCREEN_COL_BOOKING_CANCEL_MODAL_REASON}
              type="text"
              fullWidth
              value={cancelReason}
              onChange={e => setCancelReason(e.target.value)}
              variant="standard"
            />
            <Typography variant="subtitle1" color="error" sx={{ mt: 1 }}>
              {cancelErrorMessage}
            </Typography>
            <Box sx={{ width: '100%', display: 'flex', flexDirection: 'row-reverse', mt: 2 }}>
              <Button color="error" variant="contained" disabled={actionLoading} onClick={onCancel}>
                {t.SCREEN_COL_BOOKING_CANCEL_MODAL_CONFIRM}
              </Button>
            </Box>
          </DialogContent>
        </Dialog>

        <Dialog open={rescheduleDialogOpen} onClose={() => setRescheduleDialogOpen(false)} maxWidth="sm" fullWidth>
          <DialogTitle>{t.SCREEN_RESCHEDULE_DIALOG_TITLE}</DialogTitle>
          <DialogContent>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
              <Box>
                <DialogContentText sx={{ mb: 1 }}>{t.SCREEN_RESCHEDULE_CURRENT_DATETIME}</DialogContentText>
                <TextField
                  fullWidth
                  value={
                    bookingService.bookings?.[0]
                      ? (bookingService.bookings[0].dateOfBooking
                          ? dateFormatApi2DisplayYYYYMMDD(bookingService.bookings[0].dateOfBooking) + ' ' : '') +
                        (bookingService.bookings[0].timeOfBooking || '')
                      : ''
                  }
                  disabled
                  variant="outlined"
                  size="small"
                  InputProps={{ readOnly: true }}
                />
              </Box>
              <Box>
                <DialogContentText sx={{ mb: 1 }}>{t.SCREEN_RESCHEDULE_NEW_DATETIME}</DialogContentText>
                <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                  <TextField
                    label=""
                    type="date"
                    value={newDateOfBooking}
                    onChange={e => setNewDateOfBooking(e.target.value)}
                    InputLabelProps={{ shrink: true }}
                    inputProps={{ 'data-testid': 'reschedule-date' }}
                    size="small"
                    sx={{ minWidth: 140 }}
                  />
                  <TextField
                    label=""
                    type="time"
                    value={newTimeOfBooking}
                    onChange={e => setNewTimeOfBooking(e.target.value)}
                    InputLabelProps={{ shrink: true }}
                    inputProps={{ step: 300, 'data-testid': 'reschedule-time' }}
                    size="small"
                    sx={{ minWidth: 100 }}
                  />
                </Box>
              </Box>
              <Typography variant="subtitle1" color="error">
                {rescheduleErrorMessage}
              </Typography>
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                <Button
                  variant="contained"
                  color="primary"
                  disabled={actionLoading}
                  onClick={onReschedule}
                >
                  {t.SCREEN_RESCHEDULE_CONFIRM}
                </Button>
              </Box>
            </Box>
          </DialogContent>
        </Dialog>
      </Box>
    </>
  )
}
