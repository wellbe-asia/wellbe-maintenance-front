// ** React Imports
import { useState, useEffect, useCallback, Fragment } from 'react'
import Link from 'next/link'

// ** MUI Imports
import Box from '@mui/material/Box'
import Drawer from '@mui/material/Drawer'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import FormControl from '@mui/material/FormControl'
import FormHelperText from '@mui/material/FormHelperText'
import { Dialog, DialogActions, DialogTitle, DialogContentText, DialogContent } from '@mui/material'

// ** Third Party Imports
import DatePicker from 'react-datepicker'
import { useForm, Controller } from 'react-hook-form'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Styled Components
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'

// ** Types
import { EventDateType, AddEventSidebarType } from 'src/types/apps/shopBookingTypes'
import { ShopBookingMenuDetailResponseGetType, ShopBookingResponseGetType } from '@/@core/api/type/shopBooking'
import { BOOKING_CHANEL, BOOKING_STATUS, GENDER } from '@/@core/utils/constant'
import { useLocale } from '@/@core/hooks/useLocal'
import ShopBookingService from '@/service/ShopBookingService'
import { useAuth } from '@/hooks/useAuth'
import { useRouter } from 'next/router'
import { getDefaultLanguageCd, getLanguageCdWithValue } from '@/configs/locales/locales'
import { dateFormatApi, getCurrentDate } from '@/@core/utils/date'

interface DefaultStateType {
  url: string
  title: string
  allDay: boolean
  calendar: string
  description: string
  menu: string
  totalAmount: string
  endDate: Date | string
  startDate: Date | string
  shopBooking?: ShopBookingResponseGetType
}

const capitalize = (string: string) => string && string[0].toUpperCase() + string.slice(1)

const defaultState: DefaultStateType = {
  url: '',
  title: '',
  allDay: true,
  description: '',
  menu: '',
  totalAmount: '',
  endDate: new Date(),
  calendar: 'Business',
  startDate: new Date()
}

const AddEventSidebar = (props: AddEventSidebarType) => {
  // ** hook
  const { t } = useLocale()

  // ** Props
  const {
    store,
    dispatch,
    addEvent,
    updateEvent,
    drawerWidth,
    calendarApi,
    fetchEvents,
    deleteEvent,
    handleSelectEvent,
    addEventSidebarOpen,
    handleAddEventSidebarToggle
  } = props

  // ** States
  const [values, setValues] = useState<DefaultStateType>(defaultState)
  const [cancelToggle, setCancelToggle] = useState(false)
  const [cancelErrorMessage, setCancelErrorMessage] = useState('')
  const [cancelReason, setCancelReason] = useState('')

  // ** Service
  const shopBookingService = ShopBookingService()

  // ** Hook
  const auth = useAuth()
  const router = useRouter()

  const {
    control,
    setValue,
    clearErrors,
    handleSubmit,
    formState: { errors }
  } = useForm({ defaultValues: { title: '' } })

  const handleSidebarClose = async () => {
    setValues(defaultState)
    clearErrors()
    dispatch(handleSelectEvent(null))
    handleAddEventSidebarToggle()
  }

  const onApprove = (shopBookingId: string) => {
    shopBookingService.Approve(shopBookingId, '', '')
    const varLanguageCd = router.locale ? getLanguageCdWithValue(router.locale) : getDefaultLanguageCd()
    if (varLanguageCd && varLanguageCd != '') {
      const d = getCurrentDate()
      d.setMonth(d.getMonth() - 1)
      d.setDate(1)
      const apiD = dateFormatApi(d)
      dispatch(fetchEvents({ shopId: auth.shop?.Id || '', languageCd: varLanguageCd, startDate: apiD }))
    }
  }

  const onCancel = async (shopBookingId: string) => {
    if (!cancelReason) {
      setCancelErrorMessage(t.MESSAGE_REQUIRED_TEXTFIELD)

      return
    }
    const res = await shopBookingService.Cancel(shopBookingId, cancelReason)
    if (res.message) {
      setCancelErrorMessage(res.message)

      return
    } else {
      const varLanguageCd = router.locale ? getLanguageCdWithValue(router.locale) : getDefaultLanguageCd()
      if (varLanguageCd && varLanguageCd != '') {
        const d = getCurrentDate()
        d.setMonth(d.getMonth() - 1)
        d.setDate(1)
        const apiD = dateFormatApi(d)
        dispatch(fetchEvents({ shopId: auth.shop?.Id || '', languageCd: varLanguageCd, startDate: apiD }))
      }

      setCancelToggle(false)
    }
  }

  const onSubmit = (data: { title: string }) => {
    const modifiedEvent = {
      url: values.url,
      display: 'block',
      title: data.title,
      end: values.endDate,
      allDay: values.allDay,
      start: values.startDate,
      extendedProps: {
        calendar: capitalize(values.calendar),
        description: values.description.length ? values.description : undefined,
        shopBooking: values.shopBooking
      }
    }
    if (store.selectedEvent === null || (store.selectedEvent !== null && !store.selectedEvent.title.length)) {
      dispatch(addEvent(modifiedEvent))
    } else {
      dispatch(updateEvent({ id: store.selectedEvent.id, ...modifiedEvent }))
    }
    calendarApi.refetchEvents()
    handleSidebarClose()
  }

  const handleDeleteEvent = () => {
    if (store.selectedEvent) {
      dispatch(deleteEvent(store.selectedEvent.id))
    }

    // calendarApi.getEventById(store.selectedEvent.id).remove()
    handleSidebarClose()
  }

  const handleStartDate = (date: Date) => {
    if (date > values.endDate) {
      setValues({ ...values, startDate: new Date(date), endDate: new Date(date) })
    }
  }

  const resetToStoredValues = useCallback(() => {
    if (store.selectedEvent !== null) {
      const event = store.selectedEvent
      setValue('title', event.title || '')
      setValues({
        url: event.url || '',
        title: event.title || '',
        allDay: event.allDay,
        description: event.extendedProps.description || '',
        menu: '',
        totalAmount: '',
        calendar: event.extendedProps.calendar || 'Business',
        endDate: event.end !== null ? event.end : event.start,
        startDate: event.start !== null ? event.start : new Date(),
        shopBooking: event.extendedProps.shopBooking
      })
    }
  }, [setValue, store.selectedEvent])

  const resetToEmptyValues = useCallback(() => {
    setValue('title', '')
    setValues(defaultState)
  }, [setValue])

  useEffect(() => {
    if (store.selectedEvent !== null) {
      resetToStoredValues()
    } else {
      resetToEmptyValues()
    }
  }, [addEventSidebarOpen, resetToStoredValues, resetToEmptyValues, store.selectedEvent])

  const RenderSidebarFooter = () => {
    if (store.selectedEvent === null || !store.selectedEvent.id) {
      return (
        <Fragment>
          <Button size='large' type='submit' variant='contained' sx={{ mr: 4 }}>
            Add
          </Button>
          <Button size='large' variant='outlined' color='secondary' onClick={resetToEmptyValues}>
            Reset
          </Button>
        </Fragment>
      )
    } else {
      return (
        <Fragment>
          {String(store.selectedEvent.extendedProps.shopBooking?.booking_chanel_cd) == BOOKING_CHANEL.WELLBE &&
            String(store.selectedEvent.extendedProps.shopBooking?.booking_status_cd) == BOOKING_STATUS.REQUEST && (
              <Button
                size='large'
                variant='contained'
                color='success'
                sx={{ mr: 4 }}
                onClick={() => {
                  onApprove(store.selectedEvent?.extendedProps.shopBooking?.id || '')
                }}
              >
                {t.BUTTON_APPROVE}
              </Button>
            )}

          {String(store.selectedEvent.extendedProps.shopBooking?.booking_chanel_cd) == BOOKING_CHANEL.WELLBE &&
            (String(store.selectedEvent.extendedProps.shopBooking?.booking_status_cd) == BOOKING_STATUS.REQUEST ||
              String(store.selectedEvent.extendedProps.shopBooking?.booking_status_cd) == BOOKING_STATUS.FIXED) && (
              <Button
                size='large'
                variant='contained'
                color='error'
                sx={{ mr: 4 }}
                onClick={() => {
                  setCancelToggle(true)
                }}
              >
                {t.BUTTON_CANCEL}
              </Button>
            )}
        </Fragment>
      )
    }
  }

  return (
    <Drawer
      anchor='right'
      open={addEventSidebarOpen}
      onClose={handleSidebarClose}
      ModalProps={{ keepMounted: true }}
      sx={{ '& .MuiDrawer-paper': { width: ['100%', drawerWidth] } }}
    >
      <Box
        className='sidebar-header'
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          backgroundColor: 'background.default',
          p: theme => theme.spacing(3, 3.255, 3, 5.255)
        }}
      >
        <Typography variant='h6'>{t.SCREEN_TITLE_BOOKING}</Typography>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          {store.selectedEvent !== null &&
          store.selectedEvent.extendedProps.shopBooking?.id &&
          String(store.selectedEvent.extendedProps.shopBooking.booking_chanel_cd) == BOOKING_CHANEL.DIRECT ? (
            <IconButton
              size='small'
              onClick={handleDeleteEvent}
              sx={{ color: 'text.primary', mr: store.selectedEvent !== null ? 1 : 0 }}
            >
              <Icon icon='mdi:delete-outline' fontSize={20} />
            </IconButton>
          ) : null}
          <IconButton size='small' onClick={handleSidebarClose} sx={{ color: 'text.primary' }}>
            <Icon icon='mdi:close' fontSize={20} />
          </IconButton>
        </Box>
      </Box>
      <Box className='sidebar-body' sx={{ p: theme => theme.spacing(5, 6) }}>
        <DatePickerWrapper>
          <form onSubmit={handleSubmit(onSubmit)} autoComplete='off'>
            {values.shopBooking?.booking_no ? (
              <FormControl fullWidth sx={{ mb: 3 }}>
                <TextField
                  label={t.SCREEN_COL_BOOKING_BOOKING_NUMBER}
                  defaultValue={values.shopBooking?.booking_no || ' '}
                  disabled={true}
                  size='small'
                  variant={
                    String(store.selectedEvent?.extendedProps.shopBooking?.booking_chanel_cd) == BOOKING_CHANEL.WELLBE
                      ? 'filled'
                      : 'outlined'
                  }
                />
              </FormControl>
            ) : null}
            <FormControl fullWidth sx={{ mb: 3 }}>
              <Controller
                name='title'
                control={control}
                rules={{ required: true }}
                render={({ field: { value, onChange } }) => (
                  <TextField
                    label={t.SCREEN_COL_BOOKING_TITLE}
                    disabled={
                      String(store.selectedEvent?.extendedProps.shopBooking?.booking_chanel_cd) == BOOKING_CHANEL.WELLBE
                    }
                    value={value}
                    onChange={onChange}
                    error={Boolean(errors.title)}
                    size='small'
                    variant={
                      String(store.selectedEvent?.extendedProps.shopBooking?.booking_chanel_cd) == BOOKING_CHANEL.WELLBE
                        ? 'filled'
                        : 'outlined'
                    }
                  />
                )}
              />
              {errors.title && (
                <FormHelperText sx={{ color: 'error.main' }} id='event-title-error'>
                  This field is required
                </FormHelperText>
              )}
            </FormControl>
            {values.shopBooking?.booking_chanel_name ? (
              <FormControl fullWidth sx={{ mb: 3 }}>
                <TextField
                  label={t.SCREEN_COL_BOOKING_BOOKING_CHANEL}
                  defaultValue={values.shopBooking?.booking_chanel_name || ' '}
                  disabled={true}
                  size='small'
                  variant={
                    String(store.selectedEvent?.extendedProps.shopBooking?.booking_chanel_cd) == BOOKING_CHANEL.WELLBE
                      ? 'filled'
                      : 'outlined'
                  }
                />
              </FormControl>
            ) : null}
            {values.shopBooking?.booking_status_name ? (
              <FormControl fullWidth sx={{ mb: 3 }}>
                <TextField
                  label={t.SCREEN_COL_BOOKING_BOOKING_STATUS}
                  defaultValue={values.shopBooking?.booking_status_name || ' '}
                  disabled={true}
                  size='small'
                  variant={
                    String(store.selectedEvent?.extendedProps.shopBooking?.booking_chanel_cd) == BOOKING_CHANEL.WELLBE
                      ? 'filled'
                      : 'outlined'
                  }
                />
              </FormControl>
            ) : null}
            <Box sx={{ mb: 3 }}>
              <DatePicker
                selectsStart
                id='event-start-date'
                disabled={
                  String(store.selectedEvent?.extendedProps.shopBooking?.booking_chanel_cd) == BOOKING_CHANEL.WELLBE
                }
                endDate={values.endDate as EventDateType}
                selected={values.startDate as EventDateType}
                startDate={values.startDate as EventDateType}
                showTimeSelect={!values.allDay}
                dateFormat={!values.allDay ? 'yyyy-MM-dd HH:mm' : 'yyyy-MM-dd'}
                customInput={
                  <TextField
                    label={t.SCREEN_COL_BOOKING_START_DATE}
                    disabled={true}
                    sx={{ width: '100%' }}
                    size='small'
                    variant={
                      String(store.selectedEvent?.extendedProps.shopBooking?.booking_chanel_cd) == BOOKING_CHANEL.WELLBE
                        ? 'filled'
                        : 'outlined'
                    }
                  />
                }
                onChange={(date: Date) => setValues({ ...values, startDate: new Date(date) })}
                onSelect={handleStartDate}
              />
            </Box>
            <Box sx={{ mb: 3 }}>
              <DatePicker
                selectsEnd
                id='event-end-date'
                disabled={
                  String(store.selectedEvent?.extendedProps.shopBooking?.booking_chanel_cd) == BOOKING_CHANEL.WELLBE
                }
                endDate={values.endDate as EventDateType}
                selected={values.endDate as EventDateType}
                minDate={values.startDate as EventDateType}
                startDate={values.startDate as EventDateType}
                showTimeSelect={!values.allDay}
                dateFormat={!values.allDay ? 'yyyy-MM-dd HH:mm' : 'yyyy-MM-dd'}
                customInput={
                  <TextField
                    label={t.SCREEN_COL_BOOKING_END_DATE}
                    defaultValue={values.shopBooking?.booking_status_name || ' '}
                    disabled={true}
                    sx={{ width: '100%' }}
                    size='small'
                    variant={
                      String(store.selectedEvent?.extendedProps.shopBooking?.booking_chanel_cd) == BOOKING_CHANEL.WELLBE
                        ? 'filled'
                        : 'outlined'
                    }
                  />
                }
                onChange={(date: Date) => setValues({ ...values, endDate: new Date(date) })}
              />
            </Box>
            {store.selectedEvent?.extendedProps.shopBooking?.shop_booking_menus.map(v => {
              return (
                <Box sx={{ mb: 3 }} key={v.id}>
                  <TextField
                    multiline
                    disabled={
                      String(store.selectedEvent?.extendedProps.shopBooking?.booking_chanel_cd) == BOOKING_CHANEL.WELLBE
                    }
                    fullWidth
                    size='small'
                    label={t.SCREEN_COL_BOOKING_BOOKING_MENU}
                    id='event-menu'
                    value={
                      gender_name(
                        String(v.gender_cd),
                        t.SCREEN_COMMON_COL_PERSON_WOMEN_UNIT_PREFIX,
                        t.SCREEN_COMMON_COL_PERSON_WOMEN_UNIT_SUFIX,
                        t.SCREEN_COMMON_COL_PERSON_MEN_UNIT_PREFIX,
                        t.SCREEN_COMMON_COL_PERSON_MEN_UNIT_SUFIX
                      ) +
                      ' ' +
                      menu_name_join(v.shop_booking_menu_details)
                    }
                    onChange={e => setValues({ ...values, description: e.target.value })}
                    variant={
                      String(store.selectedEvent?.extendedProps.shopBooking?.booking_chanel_cd) == BOOKING_CHANEL.WELLBE
                        ? 'filled'
                        : 'outlined'
                    }
                  />
                </Box>
              )
            })}
            <Box sx={{ mb: 3 }}>
              <TextField
                multiline
                disabled={
                  String(store.selectedEvent?.extendedProps.shopBooking?.booking_chanel_cd) == BOOKING_CHANEL.WELLBE
                }
                fullWidth
                size='small'
                label={t.SCREEN_COL_BOOKING_AMOUNT}
                id='event-amount'
                value={
                  store.selectedEvent?.extendedProps.shopBooking?.booking_amount_basical_currency_base
                    ? (store.selectedEvent?.extendedProps.shopBooking?.booking_amount_basical_currency_base.toLocaleString() ||
                        '') +
                      ' ' +
                      store.selectedEvent?.extendedProps.shopBooking?.basical_currency_cd_iso
                    : ''
                }
                onChange={e => setValues({ ...values, description: e.target.value })}
                variant={
                  String(store.selectedEvent?.extendedProps.shopBooking?.booking_chanel_cd) == BOOKING_CHANEL.WELLBE
                    ? 'filled'
                    : 'outlined'
                }
              />
            </Box>
            <Box sx={{ mb: 3 }}>
              <TextField
                rows={2}
                multiline
                disabled={
                  String(store.selectedEvent?.extendedProps.shopBooking?.booking_chanel_cd) == BOOKING_CHANEL.WELLBE
                }
                fullWidth
                size='small'
                label={t.SCREEN_COL_BOOKING_REQUEST}
                id='event-request'
                value={values.shopBooking?.request}
                variant={
                  String(store.selectedEvent?.extendedProps.shopBooking?.booking_chanel_cd) == BOOKING_CHANEL.WELLBE
                    ? 'filled'
                    : 'outlined'
                }
              />
            </Box>
            {String(store.selectedEvent?.extendedProps.shopBooking?.booking_status_cd) == BOOKING_STATUS.FIXED && (
              <Box sx={{ mb: 3 }}>
                <TextField
                  multiline
                  disabled={
                    String(store.selectedEvent?.extendedProps.shopBooking?.booking_chanel_cd) == BOOKING_CHANEL.WELLBE
                  }
                  fullWidth
                  size='small'
                  label={t.SCREEN_COL_BOOKING_CUSTOMER_EMAIL}
                  id='event-meail-address'
                  value={store.selectedEvent?.extendedProps.shopBooking?.customer_email_address}
                  onChange={e => setValues({ ...values, description: e.target.value })}
                  variant={
                    String(store.selectedEvent?.extendedProps.shopBooking?.booking_chanel_cd) == BOOKING_CHANEL.WELLBE
                      ? 'filled'
                      : 'outlined'
                  }
                />
              </Box>
            )}
            {String(store.selectedEvent?.extendedProps.shopBooking?.booking_status_cd) == BOOKING_STATUS.FIXED && (
              <Box sx={{ mb: 3 }}>
                <TextField
                  multiline
                  disabled={
                    String(store.selectedEvent?.extendedProps.shopBooking?.booking_chanel_cd) == BOOKING_CHANEL.WELLBE
                  }
                  fullWidth
                  size='small'
                  label={t.SCREEN_COL_BOOKING_CUSTOMER_TELL}
                  id='event-tell'
                  value={store.selectedEvent?.extendedProps.shopBooking?.global_tell_country_no}
                  onChange={e => setValues({ ...values, description: e.target.value })}
                  variant={
                    String(store.selectedEvent?.extendedProps.shopBooking?.booking_chanel_cd) == BOOKING_CHANEL.WELLBE
                      ? 'filled'
                      : 'outlined'
                  }
                />
              </Box>
            )}
            <TextField
              rows={4}
              multiline
              fullWidth
              sx={{ mb: 6 }}
              label={t.SCREEN_COL_BOOKING_MEMO}
              id='event-memo'
              value={values.description}
              onChange={e => setValues({ ...values, description: e.target.value })}
            />
            <Box sx={{ display: 'flex', alignItems: 'center', mb: '30px' }}>
              <RenderSidebarFooter />
            </Box>
            <Box>
              <Box sx={{ width: '100%', mb: '20px' }}>
                <Typography>{t.SCREEN_COL_BOOKING_MESSAGE_CNACEL_POLICY_LEAD}</Typography>
              </Box>
              <Box sx={{ width: '100%', mb: '5px' }}>
                <Typography>{t.SCREEN_COL_BOOKING_MESSAGE_CNACEL_POLICY_1}</Typography>
              </Box>
              <Box sx={{ width: '100%', mb: '5px' }}>
                <Typography>{t.SCREEN_COL_BOOKING_MESSAGE_CNACEL_POLICY_2}</Typography>
              </Box>
              <Box sx={{ width: '100%', mb: '20px' }}>
                <Typography>{t.SCREEN_COL_BOOKING_MESSAGE_CNACEL_POLICY_3}</Typography>
              </Box>
              <Box sx={{ width: '100%' }}>
                <Typography>
                  {t.SCREEN_COL_BOOKING_MESSAGE_CNACEL_POLICY_WATCH_TERM_PREFIX}
                  <Link href='/terms/' target='_blank'>
                    {t.SCREEN_COL_BOOKING_MESSAGE_CNACEL_POLICY_WATCH_TERM}
                  </Link>
                  {t.SCREEN_COL_BOOKING_MESSAGE_CNACEL_POLICY_WATCH_TERM_SUFIX}
                </Typography>
              </Box>
            </Box>
          </form>
        </DatePickerWrapper>
      </Box>
      <Dialog
        open={cancelToggle}
        onClose={() => {
          setCancelToggle(false)
        }}
      >
        <DialogTitle>{t.SCREEN_COL_BOOKING_CANCEL_MODAL_TITLE}</DialogTitle>
        <DialogContent>
          <DialogContentText>{t.SCREEN_COL_BOOKING_CANCEL_MODAL_LEAD}</DialogContentText>
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
        </DialogContent>
        <DialogActions>
          <Button
            color='secondary'
            variant='contained'
            onClick={() => {
              setCancelToggle(false)
            }}
          >
            {t.BUTTON_BACK}
          </Button>
          <Button
            color='error'
            variant='contained'
            type='submit'
            onClick={() => {
              onCancel(store.selectedEvent?.extendedProps.shopBooking?.id || '')
            }}
          >
            {t.SCREEN_COL_BOOKING_CANCEL_MODAL_CONFIRM}
          </Button>
        </DialogActions>
        <Box className='sidebar-body' sx={{ p: theme => theme.spacing(5, 6) }}></Box>
      </Dialog>
    </Drawer>
  )
}

const gender_name = (
  gender_cd: string,
  women_name_prefix: string,
  women_name_sufix: string,
  men_name_prefix: string,
  men_name_sufix: string
) => {
  if (gender_cd == GENDER.WOMAN) {
    return women_name_prefix + ' 1 ' + women_name_sufix
  } else {
    return men_name_prefix + ' 1 ' + men_name_sufix
  }
}

const menu_name_join = (menus: ShopBookingMenuDetailResponseGetType[] | undefined): string => {
  if (menus && menus.length > 0) {
    return menus
      .map(v => {
        return v.menu_name
      })
      .join(', ')
  } else {
    return ''
  }
}

export default AddEventSidebar
