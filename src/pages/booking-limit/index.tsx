import React, { useEffect, useState, forwardRef } from 'react'
import { Controller, SubmitHandler } from 'react-hook-form'

// ** MUI Imports
import Box from '@mui/material/Box'
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos'
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos'

// ** css
import styles from 'styles/bookinglimit.module.scss'
import {
  Button,
  TextField,
  Stack,
  Backdrop,
  CircularProgress,
  Snackbar,
  Alert,
  AlertColor,
  Skeleton,
  Grid,
  FormControl
} from '@mui/material'
import Dialog from '@mui/material/Dialog'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import DialogContentText from '@mui/material/DialogContentText'
import DialogTitle from '@mui/material/DialogTitle'

// ** Third Party Imports
import DatePicker from 'react-datepicker'
import CustomInput from '@/views/forms/form-elements/pickers/PickersCustomInput'
import 'react-datepicker/dist/react-datepicker.css'

// Service
import ShopReservationLimitService from '@/service/ShopReservationLimitService'

// API
import { ShopReservationLimitFormType } from '@/service/ShopReservationLimitService'

// Hook
import { useLocale } from '@/@core/hooks/useLocal'
import { getLanguageCdWithValue } from '@/configs/locales/locales'
import {
  calculateDateWithDateFormatApi,
  dateFormatApi,
  dateFormatApi2AAA,
  dateFormatApi2DisplayD,
  dateFormatApi2DisplayYYYYMM,
  getPreviousSunday
} from '@/@core/utils/date'
import { NumericFormat, NumericFormatProps } from 'react-number-format'
import { BulkShopReservationLimitType } from '@/@core/api/type/shopReservationLimit'
import ShopReservationLimitMasterService from '@/service/ShopReservationLimitMasterService'
import { useRouter } from 'next/router'

interface CustomProps {
  onChange: (event: { target: { name: string; value: string } }) => void
  name: string
}

const NumericFormatCustom = forwardRef<NumericFormatProps, CustomProps>(function NumericFormatCustom(props, ref) {
  const { onChange, ...other } = props

  return (
    <NumericFormat
      {...other}
      getInputRef={ref}
      onValueChange={values => {
        onChange({
          target: {
            name: props.name,
            value: values.value
          }
        })
      }}
      thousandSeparator
      valueIsNumericString
    />
  )
})

export default function BookingLimit() {
  // State
  const [currentWeekDate, setCurrenctWeekDate] = useState(dateFormatApi(getPreviousSunday(new Date())))
  const [weeks, setWeeks] = useState(0)
  const [startTimes, setStartTimes] = useState<string[]>([])
  const [dates, setDates] = useState<string[]>([])
  const [prevArrow, setPrevArrow] = useState(false)
  const [nextArrow, setNextArrow] = useState(true)
  const [submitLoading, setSubmitLoading] = useState(false)
  const [initLoading, setInitLoading] = useState(false)
  const [severity, setSeverity] = useState<AlertColor | undefined>()
  const [snackbarOpen, setSnackbarOpen] = useState(false)
  const [message, setMessage] = useState<string>()
  const [languageCd, setLanguageCd] = useState('')
  const [bulkDialogOpen, setBulkDialogOpen] = useState(false)

  const [initialBulkErrorMessage, setInitialBulkErrorMessage] = useState('')

  const [bulkLimit, setBulkLimit] = useState('')
  const router = useRouter()
  const { shop_id } = router.query
  const shopId = shop_id && [shop_id].flat(1).length > 0 ? [shop_id].flat(1)[0] : ''

  // service
  const shopReservationLimitService = ShopReservationLimitService()
  const shopReservationLimitMasterService = ShopReservationLimitMasterService()

  // Hook
  const { locale, t } = useLocale()

  useEffect(() => {
    if (locale) {
      const language = getLanguageCdWithValue(locale)
      Init(language, currentWeekDate)
      shopReservationLimitService.InitBulk(shopId)
      setLanguageCd(language)
    }

    // Only first time
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [locale])

  const Init = async (languageCd: string, inCurrentWeekDate: string) => {
    try {
      setInitLoading(true)
      const res = await shopReservationLimitService.Init(shopId, languageCd, inCurrentWeekDate)
      await shopReservationLimitMasterService.Init(shopId)
      setDates(Array.from(new Set(res.data.map(item => item.limit_date))))
      setStartTimes(
        Array.from(
          new Set(res.data.flatMap(summary => summary.shop_reservation_limit.map(limit => limit.limit_time_start)))
        )
      )
    } finally {
      setInitLoading(false)
    }
  }

  const handleBulkDialogClickOpen = () => {
    setBulkDialogOpen(true)
  }

  const handleBulkDialogClose = () => {
    setBulkDialogOpen(false)
  }

  useEffect(() => {
    window.scrollTo(0, 0) // ページのトップにスクロール
  }, [initLoading])

  const nextWeek = async () => {
    let updatedWeeks = weeks
    let updatedNextArrow = nextArrow
    let updatedPrevArrow = prevArrow
    let updatedCurrentWeekDate = currentWeekDate

    switch (true) {
      case weeks <= 11:
        updatedWeeks += 1
        updatedNextArrow = true
        updatedPrevArrow = true
        updatedCurrentWeekDate = calculateDateWithDateFormatApi(dates[dates.length - 1], 1)
        break

      case weeks == 12:
        updatedWeeks += 1
        updatedNextArrow = false
        updatedPrevArrow = true
        updatedCurrentWeekDate = calculateDateWithDateFormatApi(dates[dates.length - 1], 1)
        break

      case weeks >= 13:
        updatedNextArrow = false
        updatedPrevArrow = true
        break
    }

    setWeeks(updatedWeeks)
    setNextArrow(updatedNextArrow)
    setPrevArrow(updatedPrevArrow)
    setCurrenctWeekDate(updatedCurrentWeekDate)
    await Init(languageCd, updatedCurrentWeekDate)
  }

  const prevWeek = async () => {
    let updatedWeeks = weeks
    let updatedNextArrow = nextArrow
    let updatedPrevArrow = prevArrow
    let updatedCurrentWeekDate = currentWeekDate

    switch (true) {
      case weeks >= 2:
        updatedWeeks -= 1
        updatedNextArrow = true
        updatedPrevArrow = true
        updatedCurrentWeekDate = calculateDateWithDateFormatApi(dates[0], -7)
        break

      case weeks === 1:
        updatedWeeks -= 1
        updatedNextArrow = true
        updatedPrevArrow = false
        updatedCurrentWeekDate = calculateDateWithDateFormatApi(dates[0], -7)
        break

      case weeks <= 0:
        updatedNextArrow = true
        updatedPrevArrow = false
        break
    }

    setWeeks(updatedWeeks)
    setNextArrow(updatedNextArrow)
    setPrevArrow(updatedPrevArrow)
    setCurrenctWeekDate(updatedCurrentWeekDate)
    await Init(languageCd, updatedCurrentWeekDate)
  }

  const onSubmit: SubmitHandler<ShopReservationLimitFormType> = async () => {
    try {
      setSubmitLoading(true)
      const res = await shopReservationLimitService.Submit(shopId)
      if (res.message) {
        setMessage(res.message)
        setSnackbarOpen(true)
        setSeverity('error')

        return
      }
      setMessage(t.MESSAGE_SUCCESS_SUBMIT)
      setSnackbarOpen(true)
      setSeverity('success')
    } catch (error) {
      console.error(error)
    } finally {
      setSubmitLoading(false)
    }
  }

  const onClear = (dateIndex: number) => {
    for (let i = 0; i < startTimes.length; i++) {
      shopReservationLimitService.Form.setValue(
        `ShopReservationLimits.${dateIndex}.shop_reservation_limit.${i}.reservation_limit`,
        ''
      )
    }
  }

  const onBulk = () => {
    for (let i = 0; i < shopReservationLimitService.ControlledFields.length; i++) {
      const weekday = shopReservationLimitService.ControlledFields[i]
      for (let j = 0; j < shopReservationLimitService.ControlledFields[i].shop_reservation_limit.length; j++) {
        const limit = shopReservationLimitService.ControlledFields[i].shop_reservation_limit[j]
        if (
          weekday.is_holiday ||
          limit.limit_time_start < weekday.bussiness_hours_start ||
          limit.limit_time_end > weekday.bussiness_hours_end
        ) {
          shopReservationLimitService.Form.setValue(
            `ShopReservationLimits.${i}.shop_reservation_limit.${j}.reservation_limit`,
            ''
          )
        } else {
          shopReservationLimitService.Form.setValue(
            `ShopReservationLimits.${i}.shop_reservation_limit.${j}.reservation_limit`,
            bulkLimit
          )
        }
      }
    }
  }

  const onInitialBulkSubmit: SubmitHandler<BulkShopReservationLimitType> = async () => {
    try {
      const res = await shopReservationLimitService.SubmitBulk(shopId)

      if (res.message != '') {
        setInitialBulkErrorMessage(res.message)

        return
      }
      const language = getLanguageCdWithValue(locale || '')
      Init(language, currentWeekDate)
      handleBulkDialogClose()
      setMessage(t.MESSAGE_SUCCESS_SUBMIT)
      setSnackbarOpen(true)
      setSeverity('success')
    } catch (error) {
      console.error(error)
    } finally {
    }
  }

  return (
    <Box className={styles.bg_white}>
      <h2>{t.SCREEN_TITLE_BOOKING_LIMIT}</h2>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: '5px' }}>
        <Button variant='contained' onClick={handleBulkDialogClickOpen} sx={{ mr: '10px' }}>
          {t.BUTTON_INITIAL_SETTING}
        </Button>
      </Box>
      <Box>
        {!initLoading && !submitLoading && dates.length > 0 && startTimes.length > 0 ? (
          <Stack component='form' noValidate onSubmit={shopReservationLimitService.Form.handleSubmit(onSubmit)}>
            <>
              <ul className={styles.week_table_date}>
                <li>
                  <button
                    type='button'
                    disabled={!prevArrow}
                    onClick={prevWeek}
                    className={prevArrow ? styles.arrow_color_true : styles.arrow_color_false}
                  >
                    <ArrowBackIosIcon />
                    {t.BUTTON_PREVIEW_WEEK}
                  </button>
                </li>
                <li className={styles.week_table_date_day}>
                  {dates.length >= 0 && dates[0] != undefined ? dateFormatApi2DisplayYYYYMM(dates[0]) : ''}
                </li>
                <li>
                  <button
                    type='button'
                    disabled={!nextArrow}
                    onClick={nextWeek}
                    className={nextArrow ? styles.arrow_color_true : styles.arrow_color_false}
                  >
                    {t.BUTTON_NEXT_WEEK}
                    <ArrowForwardIosIcon />
                  </button>
                </li>
              </ul>
              <Box className={styles.slide_box}>
                <table className={styles.week_table}>
                  <tr>
                    <th className={styles.all_set}>
                      {t.BUTTON_BULK_SETTING}
                      <br />
                      <Grid container spacing={2}>
                        <Grid item md={5} sx={{ alignItems: 'center' }}>
                          <input
                            type='number'
                            className={styles.all_input}
                            min='0'
                            value={bulkLimit}
                            onChange={e => setBulkLimit(e.target.value)}
                            tabIndex={101}
                          />
                        </Grid>
                        <Grid item md={5} sx={{ alignItems: 'center' }}>
                          <Button
                            size='small'
                            variant='contained'
                            sx={{ width: '20px', height: '30px' }}
                            tabIndex={102}
                            onClick={onBulk}
                          >
                            {t.BUTTON_SETTING}
                          </Button>
                        </Grid>
                      </Grid>
                    </th>
                    {dates.map((date, i) => (
                      <th className={styles.week_table_dow} key={date}>
                        {dateFormatApi2DisplayD(date)} <small>{dateFormatApi2AAA(date)}</small>
                        <br />
                        <Button
                          size='small'
                          color='secondary'
                          variant='contained'
                          sx={{ height: '30px', width: '90%' }}
                          tabIndex={103 + i}
                          onClick={() => onClear(i)}
                        >
                          {t.BUTTON_BOOKING_LIMIT_CLEAR}
                        </Button>
                      </th>
                    ))}
                  </tr>

                  {startTimes.map((time, timeIndex) => {
                    return (
                      <tr key={`time-${timeIndex}`}>
                        <th className={styles.right}>{time}</th>
                        {dates.map((date, dateIndex) => {
                          return (
                            <td key={`date-${timeIndex}-${dateIndex}`}>
                              <Controller
                                name={`ShopReservationLimits.${dateIndex}.shop_reservation_limit.${timeIndex}.reservation_limit`}
                                {...shopReservationLimitService.Form}
                                rules={{}}
                                render={({ field, fieldState }) => (
                                  <TextField
                                    {...field}
                                    {...shopReservationLimitService.Form.register(
                                      `ShopReservationLimits.${dateIndex}.shop_reservation_limit.${timeIndex}.reservation_limit`
                                    )}
                                    fullWidth
                                    type='number'
                                    size='small'
                                    sx={{ width: '90%' }}
                                    id='ShopReservationLimits.${dateIndex}.shop_reservation_limit.${timeIndex}.reservation_limit'
                                    error={fieldState.invalid}
                                    helperText={fieldState.error?.message}
                                    inputProps={{
                                      style: { height: '20px', background: '#fff' },
                                      tabIndex: (dateIndex + 1) * 1000 + timeIndex
                                    }}
                                  />
                                )}
                              />
                            </td>
                          )
                        })}
                      </tr>
                    )
                  })}
                </table>

                <Box className={styles.reserve_submit}>
                  <Button type='submit' variant='contained' tabIndex={8001}>
                    {t.BUTTON_UPDATE}
                  </Button>
                </Box>
              </Box>
              <Snackbar
                anchorOrigin={{ horizontal: 'center', vertical: 'top' }}
                open={snackbarOpen}
                autoHideDuration={300}
                onClose={() => {
                  setSnackbarOpen(false)
                }}
              >
                <Alert
                  onClose={() => {
                    setSnackbarOpen(false)
                  }}
                  variant='filled'
                  severity={severity}
                  sx={{ width: '100%', fontSize: '1.2rem', color: '#fff' }}
                >
                  {message}
                </Alert>
              </Snackbar>
              <Backdrop sx={{ color: '#fff', zIndex: theme => theme.zIndex.drawer + 1 }} open={submitLoading}>
                <CircularProgress color='inherit' />
              </Backdrop>
            </>
          </Stack>
        ) : (
          <Skeleton variant='rounded' height={900} />
        )}
      </Box>
      <Dialog
        open={bulkDialogOpen}
        onClose={handleBulkDialogClose}
        aria-labelledby='alert-dialog-title'
        aria-describedby='alert-dialog-description'
      >
        <Stack
          component='form'
          noValidate
          onSubmit={shopReservationLimitService.BulkForm.handleSubmit(onInitialBulkSubmit)}
        >
          <DialogTitle id='alert-dialog-title'>{t.SCREEN_TITLE_RESERVATION_LIMIT_BULK}</DialogTitle>
          <DialogContent>
            <Stack sx={{ width: '300px', height: '400px' }}>
              <Grid container sx={{ mt: '10px' }} spacing={5}>
                <Grid item md={12} zIndex={1001}>
                  <Controller
                    name={`startDate`}
                    {...shopReservationLimitService.BulkForm}
                    rules={{}}
                    render={({ field }) => (
                      <DatePicker
                        required
                        selected={field.value}
                        id='basic-input'
                        onChange={(date: Date) => field.onChange(date)}
                        placeholderText='Click to select a date'
                        customInput={<CustomInput label={t.SCREEN_COL_RESERVATION_LIMIT_BULK_START_DATE} />}
                      />
                    )}
                  />
                </Grid>
                <Grid item md={12} zIndex={1000}>
                  <Controller
                    name={`endDate`}
                    {...shopReservationLimitService.BulkForm}
                    rules={{}}
                    render={({ field }) => (
                      <DatePicker
                        required
                        selected={field.value}
                        id='basic-input'
                        onChange={(date: Date) => field.onChange(date)}
                        placeholderText='Click to select a date'
                        customInput={<CustomInput label={t.SCREEN_COL_RESERVATION_LIMIT_BULK_END_DATE} />}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Controller
                    name={`limit`}
                    {...shopReservationLimitService.BulkForm}
                    rules={{
                      required: t.MESSAGE_REQUIRED_TEXTFIELD
                    }}
                    render={({ field, fieldState }) => (
                      <FormControl fullWidth>
                        <TextField
                          {...field}
                          {...shopReservationLimitService.BulkForm.register(`limit`)}
                          fullWidth
                          required
                          type='text'
                          label={t.SCREEN_COL_RESERVATION_LIMIT_LIMIT}
                          id='ShopBasicalInfo.ShopChip.ShopChipStandardAmmount'
                          error={fieldState.invalid}
                          helperText={fieldState.error?.message}
                          InputLabelProps={{ shrink: true }}
                          InputProps={{
                            inputComponent: NumericFormatCustom as any
                          }}
                        />
                      </FormControl>
                    )}
                  />
                </Grid>
                <Grid item xs={12}>
                  <DialogContentText>{t.SCREEN_COL_RESERVATION_LIMIT_LIMIT_MESSAGE}</DialogContentText>
                </Grid>
                <Grid item xs={12}>
                  <DialogContentText color='error'>{initialBulkErrorMessage}</DialogContentText>
                </Grid>
              </Grid>
            </Stack>
          </DialogContent>
          <DialogActions>
            <Button variant='contained' type='submit' disabled={shopReservationLimitService.loading}>
              {t.BUTTON_UPDATE}
            </Button>
          </DialogActions>
        </Stack>
      </Dialog>
    </Box>
  )
}
