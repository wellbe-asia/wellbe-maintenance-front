import { useEffect, useState } from 'react'

// ** MUI Imports
import {
  Box,
  Container,
  TextField,
  Grid,
  Skeleton,
  Button,
  FormControl,
  Select,
  MenuItem,
  FormHelperText,
  Typography,
  Snackbar,
  Alert,
  AlertColor,
  Tabs,
  Tab,
  Divider,
  Tooltip,
  InputAdornment,
  RadioGroup,
  FormControlLabel,
  Radio
} from '@mui/material'
import VisibilityIcon from '@mui/icons-material/Visibility'
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff'

// ** css
import styles from 'styles/signup.module.scss'

// ** hook
import { useLocale } from 'src/@core/hooks/useLocal'
import AccountService, { AccountFormType, ShopUrlFormType } from '@/service/AccountService'
import { Stack } from '@mui/system'
import { Controller, SubmitHandler } from 'react-hook-form'
import { ValidationRules } from '@/validationRules/accountSetting'
import { useRouter } from 'next/router'
import { getLanguageCdWithValue } from '@/configs/locales/locales'
import CountryCdService from '@/service/CountryCdService'
import TellCountryCdService from '@/service/TellCountryCdService'
import LanguageCdService from '@/service/LanguageCdService'
import BookingMethodCdService from '@/service/BookingMethodCdService'
import ShopMaintenanceLabelService, { ShopMaintenanceLabelFormType } from '@/service/ShopMaintenanceLabelService'
import { EXTERNAL_SITE_SALONBOARD_CONFIG_VALUE, SHOP_STATUS, YES_NO } from '@/@core/utils/constant'
import CheckoutTimingCdService from '@/service/CheckoutTimingCdService'
import ShopForMaintenanceService from '@/service/ShopForMaintenanceService'
import ShopExternalConnectionService, { ShopExternalConnectionFormType } from '@/service/ShopExternalConnectionService'

interface TabPanelProps {
  children?: React.ReactNode
  index: number
  value: number
}

function CustomTabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props

  return (
    <div
      role='tabpanel'
      hidden={value !== index}
      id={`account-setting-tabpanel-${index}`}
      aria-labelledby={`account-setting-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  )
}

function a11yProps(index: number) {
  return {
    id: `account-setting-tab-${index}`,
    'aria-controls': `account-setting-${index}`
  }
}

export default function AccountSettings() {
  const { t } = useLocale()
  const router = useRouter()
  const { shop_id } = router.query
  const shopId = shop_id && [shop_id].flat(1).length > 0 ? [shop_id].flat(1)[0] : ''

  const [openError, setOpenError] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [severity, setSeverity] = useState<AlertColor | undefined>('error')
  const [isRevealExternalPasswordCurrent, setIsRevealExternalPasswordCurrent] = useState(false)
  const [tabValue, stTabValue] = useState(0)

  const validationRule = ValidationRules()

  // service
  const accountService = AccountService()
  const shopMaintenanceLabelService = ShopMaintenanceLabelService()
  const shopMaintenanceService = ShopForMaintenanceService()
  const countryCdService = CountryCdService()
  const tellCountryCdService = TellCountryCdService()
  const languageCdService = LanguageCdService()
  const bookingMethodCdService = BookingMethodCdService()
  const checkoutTimingCdService = CheckoutTimingCdService()
  const shopExternalConnectionService = ShopExternalConnectionService()

  useEffect(() => {
    if (router.locale && getLanguageCdWithValue(router.locale)) {
      const varLanguageCd = getLanguageCdWithValue(router.locale)
      Init(varLanguageCd)
    }

    // Only first time
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.locale])

  const Init = async (varLanguageCd: string) => {
    accountService.Init(shopId || '')
    shopMaintenanceLabelService.Init(shopId || '', varLanguageCd)
    countryCdService.FetchCountryCd(varLanguageCd)
    tellCountryCdService.FetchTellCountryCd(varLanguageCd)
    bookingMethodCdService.FetchBookingMethodCd(varLanguageCd)
    checkoutTimingCdService.FetchCheckoutTimingCd(varLanguageCd)
    languageCdService.Init()
    shopExternalConnectionService.Init(shopId)
  }

  const onApprove = async (id: string) => {
    await shopMaintenanceService.Approve(id)
    await accountService.Init(id)
  }

  const onSuspend = async (id: string) => {
    await shopMaintenanceService.Suspend(id)
    await accountService.Init(id)
  }

  const onSubmit: SubmitHandler<AccountFormType> = async () => {
    try {
      const res = await accountService.UpdateShop()
      if (res.message != undefined && res.message != '') {
        setSeverity('error')
        setErrorMessage(res.message)
        setOpenError(true)

        return
      }

      setSeverity('success')
      setErrorMessage(t.MESSAGE_SUCCESS_SUBMIT)
      setOpenError(true)
      accountService.Init(shopId || '')
    } catch (error) {
      console.error(error)
    } finally {
    }
  }

  const onSubmitShopMaintenanceLabel: SubmitHandler<ShopMaintenanceLabelFormType> = async () => {
    try {
      const res = await shopMaintenanceLabelService.Submit()
      if (res.message != undefined && res.message != '') {
        setSeverity('error')
        setErrorMessage(res.message)
        setOpenError(true)

        return
      }

      setSeverity('success')
      setErrorMessage(t.MESSAGE_SUCCESS_SUBMIT)
      setOpenError(true)
      accountService.Init(shopId || '')
    } catch (error) {
      console.error(error)
    } finally {
    }
  }
  const handleCloseSnackbar = () => {
    setOpenError(false)
  }

  const onSubmitShopUrl: SubmitHandler<ShopUrlFormType> = async () => {
    try {
      const res = await accountService.UpdateShopUrl(shopId)
      if (res.message != undefined && res.message != '') {
        setSeverity('error')
        setErrorMessage(res.message)
        setOpenError(true)

        return
      }

      setSeverity('success')
      setErrorMessage(t.MESSAGE_SUCCESS_SUBMIT)
      setOpenError(true)
      accountService.Init(shopId || '')
    } catch (error) {
      console.error(error)
    } finally {
    }
  }

  const onSubmitExternalConnection: SubmitHandler<ShopExternalConnectionFormType> = async () => {
    try {
      const res = await shopExternalConnectionService.Submit()
      if (res != undefined && res.message && res.message != '') {
        setSeverity('error')
        setErrorMessage(res.message)
        setOpenError(true)

        return
      }
      setSeverity('success')
      setErrorMessage(t.MESSAGE_SUCCESS_SUBMIT)
      setOpenError(true)
      shopExternalConnectionService.Init(shopId)
    } catch (error) {
      console.error(error)
    } finally {
    }
  }

  const onDeleteExternalConnection = async () => {
    try {
      const res = await shopExternalConnectionService.Delete()
      if (res != undefined && res.message && res.message != '') {
        setSeverity('error')
        setErrorMessage(res.message)
        setOpenError(true)

        return
      }
      setSeverity('success')
      setErrorMessage(t.MESSAGE_SUCCESS_SUBMIT)
      setOpenError(true)
      shopExternalConnectionService.Init(shopId)
    } catch (error) {
      console.error(error)
    } finally {
    }
  }

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    stTabValue(newValue)
  }

  return (
    <Box>
      <Box sx={{ backgroundColor: '#fff' }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          aria-label='account setting tabs'
          sx={{ mt: '10px', ml: '10px', mr: '10px' }}
          scrollButtons='auto'
        >
          <Tab label={t.SCREEN_TABS_TAB_BASIC} {...a11yProps(0)} />
          <Tab label={t.SCREEN_ACCOUNT_SETTING_MAINTENANCE_LABEL} {...a11yProps(1)} />
          <Tab label={t.SCREEN_ACCOUNT_SETTING_URL_READONLY} {...a11yProps(2)} />
          <Tab label={t.SCREEN_TABS_TAB_CONNECTION} {...a11yProps(3)} />
        </Tabs>
        <Divider sx={{ mt: '10px' }} />
        <CustomTabPanel value={tabValue} index={0}>
          <Stack component='form' noValidate onSubmit={accountService.Form.handleSubmit(onSubmit)}>
            <Box>
              <Box>
                <Box>
                  <Container sx={{ pt: 5, pb: 5 }}>
                    <Grid container sx={{ marginBottom: 4 }} spacing={5}>
                      <Grid item xs={12} md={7}>
                        <span className={styles.form_label}>{t.SCREEN_ACCOUNT_SETTING_NAME}*</span>
                        {!accountService.loading ? (
                          <Controller
                            name={`shop.ShopName`}
                            {...accountService.Form}
                            rules={validationRule.shopName}
                            render={({ field, fieldState }) => (
                              <FormControl fullWidth>
                                <TextField
                                  {...field}
                                  {...accountService.Form.register(`shop.ShopName`)}
                                  fullWidth
                                  type='text'
                                  size='small'
                                  id='shop.ShopName'
                                  required
                                  variant='outlined'
                                  error={fieldState.invalid}
                                  helperText={fieldState.error?.message}
                                  inputProps={{ style: { fontSize: '14px' } }}
                                  InputLabelProps={{ shrink: true, style: { fontSize: '14px' } }}
                                />
                              </FormControl>
                            )}
                          />
                        ) : (
                          <Skeleton variant='rounded' height={45} />
                        )}
                      </Grid>
                      <Grid item xs={12} md={7}>
                        <span className={styles.form_label}>{t.SCREEN_ACCOUNT_SETTING_MAIL_ADDRESS}*</span>
                        {!accountService.loading ? (
                          <Controller
                            name={`shop.ShopAdminEmailAddress`}
                            {...accountService.Form}
                            rules={validationRule.emailAddress}
                            render={({ field, fieldState }) => (
                              <FormControl fullWidth>
                                <TextField
                                  {...field}
                                  {...accountService.Form.register(`shop.ShopAdminEmailAddress`)}
                                  fullWidth
                                  type='text'
                                  size='small'
                                  id='shop.ShopAdminEmailAddress'
                                  required
                                  variant='outlined'
                                  error={fieldState.invalid}
                                  helperText={fieldState.error?.message}
                                  inputProps={{ style: { fontSize: '14px' } }}
                                  InputLabelProps={{ shrink: true, style: { fontSize: '14px' } }}
                                />
                              </FormControl>
                            )}
                          />
                        ) : (
                          <Skeleton variant='rounded' height={45} />
                        )}
                      </Grid>
                      <Grid item xs={12} md={7}>
                        <span className={styles.form_label}>{t.SCREEN_ACCOUNT_SETTING_IDENTIFY_NUMBER}</span>
                        {!accountService.loading ? (
                          <Controller
                            name={`shop.ShopIdentifyNumber`}
                            {...accountService.Form}
                            rules={validationRule.shopIdentifyNumber}
                            render={({ field, fieldState }) => (
                              <FormControl fullWidth>
                                <TextField
                                  {...field}
                                  {...accountService.Form.register(`shop.ShopIdentifyNumber`)}
                                  fullWidth
                                  type='text'
                                  size='small'
                                  id='shop.ShopIdentifyNumber'
                                  variant='outlined'
                                  error={fieldState.invalid}
                                  helperText={fieldState.error?.message}
                                  inputProps={{ style: { fontSize: '14px' } }}
                                  InputLabelProps={{ shrink: true, style: { fontSize: '14px' } }}
                                />
                              </FormControl>
                            )}
                          />
                        ) : (
                          <Skeleton variant='rounded' height={45} />
                        )}
                      </Grid>
                      <Grid item xs={12} md={7}>
                        <span className={styles.form_label}>{t.SCREEN_ACCOUNT_SETTING_TELL_COUNTRY_NO}*</span>
                        {!accountService.loading ? (
                          <Controller
                            name={`shop.ShopAdminTellCountryNoCd`}
                            {...accountService.Form}
                            rules={validationRule.shopAdminTellCountryNoCd}
                            render={({ field, fieldState }) => (
                              <FormControl fullWidth error={fieldState.invalid}>
                                <Select
                                  labelId='area-label'
                                  id='shop.ShopAdminTellCountryNoCd'
                                  required
                                  size='small'
                                  notched={true}
                                  MenuProps={{
                                    sx: {
                                      maxHeight: 300
                                    }
                                  }}
                                  {...field}
                                >
                                  {tellCountryCdService.tellCountryCd.map(c => {
                                    return (
                                      <MenuItem value={String(c.tell_country_cd)} key={c.tell_country_cd}>
                                        <Typography fontSize={'1.0rem'}>
                                          [{c.country_no}] {c.country_name}
                                        </Typography>
                                      </MenuItem>
                                    )
                                  })}
                                </Select>
                                <FormHelperText>{fieldState.error?.message}</FormHelperText>
                              </FormControl>
                            )}
                          />
                        ) : (
                          <Skeleton variant='rounded' height={45} />
                        )}
                      </Grid>
                      <Grid item xs={12} md={7}>
                        <span className={styles.form_label}>{t.SCREEN_ACCOUNT_SETTING_TELL_NO}*</span>
                        {!accountService.loading ? (
                          <Controller
                            name={`shop.ShopAdminTellNo`}
                            {...accountService.Form}
                            rules={validationRule.shopAdminTellNo}
                            render={({ field, fieldState }) => (
                              <FormControl fullWidth>
                                <TextField
                                  {...field}
                                  {...accountService.Form.register(`shop.ShopAdminTellNo`)}
                                  fullWidth
                                  type='text'
                                  size='small'
                                  id='shop.ShopAdminTellNo'
                                  required
                                  variant='outlined'
                                  error={fieldState.invalid}
                                  helperText={fieldState.error?.message}
                                  inputProps={{ style: { fontSize: '14px' } }}
                                  InputLabelProps={{ shrink: true, style: { fontSize: '14px' } }}
                                />
                              </FormControl>
                            )}
                          />
                        ) : (
                          <Skeleton variant='rounded' height={45} />
                        )}
                      </Grid>
                      <Grid item xs={12} md={7}>
                        <span className={styles.form_label}>{t.SCREEN_ACCOUNT_SETTING_BOOKING_METHOD}*</span>
                        {!accountService.loading ? (
                          <Controller
                            name={`shop.BookingMethodCd`}
                            {...accountService.Form}
                            rules={validationRule.bookingMethodCd}
                            render={({ field, fieldState }) => (
                              <FormControl fullWidth error={fieldState.invalid}>
                                <Select
                                  labelId='area-label'
                                  id='shop.BookingMethodCd'
                                  required
                                  size='small'
                                  notched={true}
                                  MenuProps={{
                                    sx: {
                                      maxHeight: 300
                                    }
                                  }}
                                  {...field}
                                >
                                  {bookingMethodCdService.bookingMethod.map(c => {
                                    return (
                                      <MenuItem value={String(c.booking_method_cd)} key={c.booking_method_cd}>
                                        <Typography fontSize={'1.0rem'}>{c.booking_method_name}</Typography>
                                      </MenuItem>
                                    )
                                  })}
                                </Select>
                                <FormHelperText>{fieldState.error?.message}</FormHelperText>
                              </FormControl>
                            )}
                          />
                        ) : (
                          <Skeleton variant='rounded' height={45} />
                        )}
                      </Grid>
                      <Grid item xs={12} md={7}>
                        <span className={styles.form_label}>{t.SCREEN_ACCOUNT_SETTING_CHECKOUT_TIMING}*</span>
                        {!accountService.loading ? (
                          <Controller
                            name={`shop.CheckoutTimingCd`}
                            {...accountService.Form}
                            rules={validationRule.checkoutTimingCd}
                            render={({ field, fieldState }) => (
                              <FormControl fullWidth error={fieldState.invalid}>
                                <Select
                                  labelId='area-label'
                                  id='shop.CheckoutTimingCd'
                                  required
                                  size='small'
                                  notched={true}
                                  MenuProps={{
                                    sx: {
                                      maxHeight: 300
                                    }
                                  }}
                                  {...field}
                                >
                                  {checkoutTimingCdService.checkoutTiming.map(c => {
                                    return (
                                      <MenuItem value={String(c.checkout_timing_cd)} key={c.checkout_timing_cd}>
                                        <Typography fontSize={'1.0rem'}>{c.checkout_timing_name}</Typography>
                                      </MenuItem>
                                    )
                                  })}
                                </Select>
                                <FormHelperText>{fieldState.error?.message}</FormHelperText>
                              </FormControl>
                            )}
                          />
                        ) : (
                          <Skeleton variant='rounded' height={45} />
                        )}
                      </Grid>
                      <Grid item xs={12} md={7}>
                        <span className={styles.form_label}>{t.SCREEN_ACCOUNT_SETTING_COUNTRY}*</span>
                        {!accountService.loading ? (
                          <Controller
                            name={`shop.ShopCountryCd`}
                            {...accountService.Form}
                            rules={validationRule.shopCountryCd}
                            render={({ field, fieldState }) => (
                              <FormControl fullWidth error={fieldState.invalid}>
                                <Select
                                  labelId='area-label'
                                  id='shop.ShopCountryCd'
                                  required
                                  size='small'
                                  notched={true}
                                  MenuProps={{
                                    sx: {
                                      maxHeight: 300
                                    }
                                  }}
                                  {...field}
                                >
                                  {countryCdService.countryCd.map(c => {
                                    return (
                                      <MenuItem value={String(c.country_cd)} key={c.country_cd}>
                                        <Typography fontSize={'1.0rem'}>{c.country_name}</Typography>
                                      </MenuItem>
                                    )
                                  })}
                                </Select>
                                <FormHelperText>{fieldState.error?.message}</FormHelperText>
                              </FormControl>
                            )}
                          />
                        ) : (
                          <Skeleton variant='rounded' height={45} />
                        )}
                      </Grid>
                      <Grid item xs={12} md={7}>
                        <span className={styles.form_label}>{t.SCREEN_ACCOUNT_SETTING_BASICAL_LANGUAGE_CD}*</span>
                        {!accountService.loading ? (
                          <Controller
                            name={`shop.ShopBasicalLanguageCd`}
                            {...accountService.Form}
                            rules={validationRule.languageCd}
                            render={({ field, fieldState }) => (
                              <FormControl fullWidth error={fieldState.invalid}>
                                <Select
                                  labelId='area-label'
                                  id='shop.ShopBasicalLanguageCd'
                                  required
                                  size='small'
                                  notched={true}
                                  MenuProps={{
                                    sx: {
                                      maxHeight: 300
                                    }
                                  }}
                                  {...field}
                                >
                                  {languageCdService.languageCd.map(c => {
                                    return (
                                      <MenuItem value={String(c.LanguageCd)} key={c.LanguageCd}>
                                        <Typography fontSize={'1.0rem'}>{c.LanguageName}</Typography>
                                      </MenuItem>
                                    )
                                  })}
                                </Select>
                                <FormHelperText>{fieldState.error?.message}</FormHelperText>
                              </FormControl>
                            )}
                          />
                        ) : (
                          <Skeleton variant='rounded' height={45} />
                        )}
                      </Grid>
                      <Grid item xs={12} md={7}>
                        <span className={styles.form_label}>{t.SCREEN_ACCOUNT_SETTING_ADMIN_PIC_NAME}*</span>
                        {!accountService.loading ? (
                          <Controller
                            name={`shop.ShopAdminPicName`}
                            {...accountService.Form}
                            rules={validationRule.picMame}
                            render={({ field, fieldState }) => (
                              <FormControl fullWidth>
                                <TextField
                                  {...field}
                                  {...accountService.Form.register(`shop.ShopAdminPicName`)}
                                  fullWidth
                                  type='text'
                                  size='small'
                                  id='shop.ShopAdminPicName'
                                  required
                                  variant='outlined'
                                  error={fieldState.invalid}
                                  helperText={fieldState.error?.message}
                                  inputProps={{ style: { fontSize: '14px' } }}
                                  InputLabelProps={{ shrink: true, style: { fontSize: '14px' } }}
                                />
                              </FormControl>
                            )}
                          />
                        ) : (
                          <Skeleton variant='rounded' height={45} />
                        )}
                      </Grid>
                      <Grid item xs={12} md={7}>
                        <span className={styles.form_label}>
                          {t.SCREEN_ACCOUNT_SETTING_ADMIN_PIC_TELL_COUNTRY_NO_CD}*
                        </span>
                        {!accountService.loading ? (
                          <Controller
                            name={`shop.ShopAdminPicTellCountryCd`}
                            {...accountService.Form}
                            rules={validationRule.picTellCountry}
                            render={({ field, fieldState }) => (
                              <FormControl fullWidth error={fieldState.invalid}>
                                <Select
                                  labelId='area-label'
                                  id='shop.ShopAdminPicTellCountryCd'
                                  required
                                  size='small'
                                  notched={true}
                                  MenuProps={{
                                    sx: {
                                      maxHeight: 300
                                    }
                                  }}
                                  {...field}
                                >
                                  {tellCountryCdService.tellCountryCd.map(c => {
                                    return (
                                      <MenuItem value={String(c.tell_country_cd)} key={c.tell_country_cd}>
                                        <Typography fontSize={'14px'}>
                                          [{c.country_no}] {c.country_name}
                                        </Typography>
                                      </MenuItem>
                                    )
                                  })}
                                </Select>
                                <FormHelperText>{fieldState.error?.message}</FormHelperText>
                              </FormControl>
                            )}
                          />
                        ) : (
                          <Skeleton variant='rounded' height={45} />
                        )}
                      </Grid>
                      <Grid item xs={12} md={7}>
                        <span className={styles.form_label}>{t.SCREEN_ACCOUNT_SETTING_ADMIN_PIC_TELL_NO}*</span>
                        {!accountService.loading ? (
                          <Controller
                            name={`shop.ShopAdminPicTellNo`}
                            {...accountService.Form}
                            rules={validationRule.picTellNo}
                            render={({ field, fieldState }) => (
                              <FormControl fullWidth>
                                <TextField
                                  {...field}
                                  {...accountService.Form.register(`shop.ShopAdminPicTellNo`)}
                                  fullWidth
                                  type='text'
                                  size='small'
                                  id='shop.ShopAdminPicTellNo'
                                  required
                                  variant='outlined'
                                  error={fieldState.invalid}
                                  helperText={fieldState.error?.message}
                                  inputProps={{ style: { fontSize: '14px' } }}
                                  InputLabelProps={{ shrink: true, style: { fontSize: '14px' } }}
                                />
                              </FormControl>
                            )}
                          />
                        ) : (
                          <Skeleton variant='rounded' height={45} />
                        )}
                      </Grid>
                      <Grid item xs={12} md={7}>
                        <span className={styles.form_label}>{t.SCREEN_ACCOUNT_SETTING_ADMIN_PIC_EMAIL}*</span>
                        {!accountService.loading ? (
                          <Controller
                            name={`shop.ShopAdminPicEmailAddress`}
                            {...accountService.Form}
                            rules={validationRule.picEmailAddress}
                            render={({ field, fieldState }) => (
                              <FormControl fullWidth>
                                <TextField
                                  {...field}
                                  {...accountService.Form.register(`shop.ShopAdminPicEmailAddress`)}
                                  fullWidth
                                  type='text'
                                  size='small'
                                  id='shop.ShopAdminPicEmailAddress'
                                  required
                                  variant='outlined'
                                  error={fieldState.invalid}
                                  helperText={fieldState.error?.message}
                                  inputProps={{ style: { fontSize: '14px' } }}
                                  InputLabelProps={{ shrink: true, style: { fontSize: '14px' } }}
                                />
                              </FormControl>
                            )}
                          />
                        ) : (
                          <Skeleton variant='rounded' height={45} />
                        )}
                      </Grid>
                      <Grid item xs={12} md={7}>
                        <span className={styles.form_label}>{t.SCREEN_ACCOUNT_SETTING_RANK}*</span>
                        {!accountService.loading ? (
                          <Controller
                            name={`shop.Rank`}
                            {...accountService.Form}
                            rules={validationRule.rank}
                            render={({ field, fieldState }) => (
                              <FormControl fullWidth>
                                <TextField
                                  {...field}
                                  {...accountService.Form.register(`shop.Rank`)}
                                  fullWidth
                                  type='number'
                                  size='small'
                                  id='shop.Rank'
                                  required
                                  variant='outlined'
                                  error={fieldState.invalid}
                                  helperText={fieldState.error?.message}
                                  inputProps={{ style: { fontSize: '14px' } }}
                                  InputLabelProps={{ shrink: true, style: { fontSize: '14px' } }}
                                />
                              </FormControl>
                            )}
                          />
                        ) : (
                          <Skeleton variant='rounded' height={45} />
                        )}
                      </Grid>
                      <Grid item xs={12} md={7}>
                        <span className={styles.form_label}>{t.SCREEN_ACCOUNT_SETTING_WELLBE_FEE}*</span>
                        {!accountService.loading ? (
                          <Controller
                            name={`shop.WellbeFee`}
                            {...accountService.Form}
                            rules={validationRule.wellbefee}
                            render={({ field, fieldState }) => (
                              <FormControl fullWidth>
                                <TextField
                                  {...field}
                                  {...accountService.Form.register(`shop.WellbeFee`)}
                                  fullWidth
                                  type='number'
                                  size='small'
                                  id='shop.WellbeFee'
                                  required
                                  variant='outlined'
                                  error={fieldState.invalid}
                                  helperText={fieldState.error?.message}
                                  inputProps={{ style: { fontSize: '14px' } }}
                                  InputLabelProps={{ shrink: true, style: { fontSize: '14px' } }}
                                />
                              </FormControl>
                            )}
                          />
                        ) : (
                          <Skeleton variant='rounded' height={45} />
                        )}
                      </Grid>
                    </Grid>
                    <Grid>
                      <Box
                        sx={{
                          display: 'flex',
                          flexDirection: 'row',
                          bgcolor: 'background.paper',
                          borderRadius: 1
                        }}
                      >
                        <Button
                          type='submit'
                          variant='contained'
                          disabled={accountService.loading}
                          size='medium'
                          sx={{ mr: 2 }}
                        >
                          {t.BUTTON_UPDATE}
                        </Button>
                        {accountService.shop &&
                          (accountService.shop.ShopStatusCd == SHOP_STATUS.UNAPPROVED ||
                            accountService.shop.ShopStatusCd == SHOP_STATUS.REQUESTED) && (
                            <Button
                              size='medium'
                              variant='contained'
                              color='info'
                              onClick={() => onApprove(accountService.shop?.Id || '')}
                              sx={{ mr: 2 }}
                            >
                              {t.BUTTON_SHOP_APPROVE}
                            </Button>
                          )}
                        {accountService.shop && accountService.shop.ShopStatusCd == SHOP_STATUS.APPROVED && (
                          <Button
                            size='medium'
                            variant='text'
                            color='error'
                            onClick={() => onSuspend(accountService.shop?.Id || '')}
                            sx={{ mr: 2 }}
                          >
                            {'掲載停止'}
                          </Button>
                        )}
                      </Box>
                    </Grid>
                  </Container>
                </Box>
              </Box>
            </Box>
          </Stack>
        </CustomTabPanel>
        <CustomTabPanel value={tabValue} index={1}>
          <Stack
            component='form'
            noValidate
            onSubmit={shopMaintenanceLabelService.Form.handleSubmit(onSubmitShopMaintenanceLabel)}
          >
            <Box>
              <Box>
                <Box>
                  <Container sx={{ pt: 5, pb: 5 }}>
                    <Grid container sx={{ marginBottom: 4 }} spacing={2}>
                      {shopMaintenanceLabelService.ControlledFields.length > 0 && (
                        <>
                          <Grid item xs={12} md={7}>
                            <span className={styles.form_label}>
                              {shopMaintenanceLabelService.shopMaintenanceLabelCds &&
                                shopMaintenanceLabelService.shopMaintenanceLabelCds.length > 0 &&
                                shopMaintenanceLabelService.shopMaintenanceLabelCds[0].shop_maintenance_label_name}
                              *
                            </span>
                            <Controller
                              name={`shopMaintenanceLabels.0.ShopMaintenanceLabelValue`}
                              rules={validationRule.ShopMaintenanceLabelValue}
                              {...shopMaintenanceLabelService.Form}
                              render={({ field, fieldState }) => (
                                <FormControl fullWidth error={fieldState.invalid}>
                                  <Select
                                    labelId='area-label'
                                    id='shopMaintenanceLabels.0.ShopMaintenanceLabelValue'
                                    required
                                    size='small'
                                    notched={true}
                                    MenuProps={{
                                      sx: {
                                        maxHeight: 300
                                      }
                                    }}
                                    {...field}
                                  >
                                    <MenuItem value={YES_NO.NO}>
                                      <Typography fontSize={'1.0rem'}>
                                        {t.SCREEN_ACCOUNT_SETTING_INDIVIDUAL_PAYOUT_NO}
                                      </Typography>
                                    </MenuItem>
                                    <MenuItem value={YES_NO.YES}>
                                      <Typography fontSize={'1.0rem'}>
                                        {t.SCREEN_ACCOUNT_SETTING_INDIVIDUAL_PAYOUT_YES}
                                      </Typography>
                                    </MenuItem>
                                  </Select>
                                </FormControl>
                              )}
                            />
                          </Grid>
                        </>
                      )}
                    </Grid>
                    <Grid>
                      <Box
                        sx={{
                          display: 'flex',
                          flexDirection: 'row',
                          bgcolor: 'background.paper',
                          borderRadius: 1
                        }}
                      >
                        <Button
                          type='submit'
                          variant='contained'
                          disabled={shopMaintenanceLabelService.loading}
                          size='medium'
                        >
                          {t.BUTTON_UPDATE}
                        </Button>
                      </Box>
                    </Grid>
                  </Container>
                </Box>
              </Box>
            </Box>
          </Stack>
        </CustomTabPanel>
        <CustomTabPanel value={tabValue} index={2}>
          <Stack component='form' noValidate onSubmit={accountService.ShopUrlForm.handleSubmit(onSubmitShopUrl)}>
            <Box>
              <Box>
                <Box>
                  <Container sx={{ pt: 5, pb: 5 }}>
                    <Grid container sx={{ marginBottom: 4 }} spacing={2}>
                      <Grid item xs={12} md={7}>
                        <Controller
                          name={`shopUrl`}
                          rules={validationRule.shopUrl}
                          {...accountService.ShopUrlForm}
                          render={({ field, fieldState }) => (
                            <FormControl fullWidth>
                              <TextField
                                {...field}
                                {...accountService.ShopUrlForm.register(`shopUrl`)}
                                fullWidth
                                type='text'
                                size='small'
                                id='shop.shopUrl'
                                required
                                variant='outlined'
                                error={fieldState.invalid}
                                helperText={fieldState.error?.message}
                                inputProps={{ style: { fontSize: '14px' } }}
                                InputLabelProps={{ shrink: true, style: { fontSize: '14px' } }}
                              />
                            </FormControl>
                          )}
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <Box
                          sx={{
                            display: 'flex',
                            flexDirection: 'row',
                            bgcolor: 'background.paper',
                            borderRadius: 1
                          }}
                        >
                          <Button
                            type='submit'
                            variant='contained'
                            disabled={shopMaintenanceLabelService.loading}
                            size='medium'
                          >
                            {t.BUTTON_UPDATE}
                          </Button>
                        </Box>
                      </Grid>
                    </Grid>
                  </Container>
                </Box>
              </Box>
            </Box>
          </Stack>
        </CustomTabPanel>
        <CustomTabPanel value={tabValue} index={3}>
          <Stack
            component='form'
            autoComplete='off'
            noValidate
            onSubmit={shopExternalConnectionService.ShopExternalConnectionForm.handleSubmit(onSubmitExternalConnection)}
          >
            <Box>
              <Container sx={{ pt: 5, pb: 5 }}>
                <Grid container sx={{ marginBottom: 4 }} spacing={5}>
                  <Grid item xs={12} md={12}>
                    <h3>
                      {t.SCREEN_ACCOUNT_SETTING_CONNECTION_SALONBOARD_TITLE}
                      <Controller
                        name={`ShopExternalConnection.IsConfirmed`}
                        {...shopExternalConnectionService.ShopExternalConnectionForm}
                        render={({ field }) => (
                          <Tooltip
                            title={
                              field.value == undefined
                                ? ''
                                : field.value
                                ? t.SCREEN_ACCOUNT_SETTING_CONNECTION_CONFIRMED_DESCRIPTION
                                : t.SCREEN_ACCOUNT_SETTING_CONNECTION_NOTCONFIRMED_DESCRIPTION
                            }
                            placement='top'
                          >
                            <span style={{ color: field.value == undefined ? '' : field.value ? '#93DD5C' : 'red' }}>
                              {field.value == undefined
                                ? ''
                                : field.value
                                ? t.SCREEN_ACCOUNT_SETTING_CONNECTION_CONFIRMED_LABEL
                                : t.SCREEN_ACCOUNT_SETTING_CONNECTION_NOTCONFIRMED_LABEL}
                            </span>
                          </Tooltip>
                        )}
                      />
                    </h3>

                    <span>{t.SCREEN_ACCOUNT_SETTING_CONNECTION_SALONBOARD_DESCRIPITON}</span>
                  </Grid>
                  <Grid item xs={12} md={7}>
                    <span className={styles.form_label}>{t.SCREEN_ACCOUNT_SETTING_CONNECTION_USEID}</span>
                    {!shopExternalConnectionService.loading ? (
                      <Controller
                        name={`ShopExternalConnection.UserId`}
                        {...shopExternalConnectionService.ShopExternalConnectionForm}
                        rules={validationRule.externalUserId}
                        render={({ field, fieldState }) => (
                          <FormControl fullWidth>
                            <TextField
                              {...field}
                              {...shopExternalConnectionService.ShopExternalConnectionForm.register(
                                'ShopExternalConnection.UserId'
                              )}
                              fullWidth
                              type='text'
                              size='small'
                              id='account-setting-external-userid'
                              required
                              variant='outlined'
                              error={fieldState.invalid}
                              helperText={fieldState.error?.message}
                              inputProps={{ style: { fontSize: '14px' } }}
                            />
                          </FormControl>
                        )}
                      />
                    ) : (
                      <Skeleton variant='rounded' height={45} />
                    )}
                  </Grid>
                  <Grid item xs={12} md={7}>
                    <span className={styles.form_label}>{t.SCREEN_ACCOUNT_SETTING_CONNECTION_PASSWORD}</span>
                    {!shopExternalConnectionService.loading ? (
                      <Controller
                        name={`ShopExternalConnection.Password`}
                        {...shopExternalConnectionService.ShopExternalConnectionForm}
                        rules={validationRule.externalPassword}
                        render={({ field, fieldState }) => (
                          <FormControl fullWidth>
                            <TextField
                              {...field}
                              {...shopExternalConnectionService.ShopExternalConnectionForm.register(
                                'ShopExternalConnection.Password'
                              )}
                              fullWidth
                              size='small'
                              id='account-setting-external-password'
                              required
                              variant='outlined'
                              error={fieldState.invalid}
                              helperText={fieldState.error?.message}
                              type={isRevealExternalPasswordCurrent ? 'text' : 'password'}
                              InputProps={{
                                style: { fontSize: '14px' },
                                endAdornment: (
                                  <InputAdornment position='end'>
                                    <span
                                      onClick={() => {
                                        setIsRevealExternalPasswordCurrent(!isRevealExternalPasswordCurrent)
                                      }}
                                      role='presentation'
                                      className={styles.PasswordReveal}
                                      style={{ cursor: 'pointer' }}
                                    >
                                      {isRevealExternalPasswordCurrent ? <VisibilityIcon /> : <VisibilityOffIcon />}
                                    </span>
                                  </InputAdornment>
                                )
                              }}
                              inputProps={{ style: { fontSize: '14px' } }}
                            />
                          </FormControl>
                        )}
                      />
                    ) : (
                      <Skeleton variant='rounded' height={45} />
                    )}
                  </Grid>
                  <Grid item xs={12} md={7}>
                    <span className={styles.form_label}>
                      {t.SCREEN_ACCOUNT_SETTING_CONNECTION_SALONBOARD_SALONTYPE}
                    </span>
                    {!shopExternalConnectionService.loading ? (
                      <Controller
                        name={`ShopExternalConnection.SalonboardType`}
                        {...shopExternalConnectionService.ShopExternalConnectionForm}
                        rules={validationRule.salonType}
                        render={({ field, fieldState }) => (
                          <FormControl fullWidth>
                            <RadioGroup
                              value={field.value}
                              onChange={field.onChange}
                              aria-labelledby='salontype-radio-buttons-group-label'
                              name='salontype-radio-buttons-group'
                            >
                              <FormControlLabel
                                value={EXTERNAL_SITE_SALONBOARD_CONFIG_VALUE.HAIRE}
                                control={<Radio />}
                                label={t.SCREEN_ACCOUNT_SETTING_CONNECTION_SALONBOARD_HAIRE}
                              />
                              <FormControlLabel
                                value={EXTERNAL_SITE_SALONBOARD_CONFIG_VALUE.KIREI}
                                control={<Radio />}
                                label={t.SCREEN_ACCOUNT_SETTING_CONNECTION_SALONBOARD_KIREI}
                              />
                            </RadioGroup>
                            {fieldState.invalid && (
                              <Typography fontSize='0.8rem' color='error'>
                                {fieldState.error?.message}
                              </Typography>
                            )}
                          </FormControl>
                        )}
                      />
                    ) : (
                      <Skeleton variant='rounded' height={45} />
                    )}
                  </Grid>
                  <Grid item xs={12}>
                    <span className={styles.form_label}>
                      {t.SCREEN_ACCOUNT_SETTING_CONNECTION_SALONBOARD_CONNECT_SHIFTSETTING}
                    </span>
                    {!shopExternalConnectionService.loading ? (
                      <Controller
                        name={`ShopExternalConnection.IsConnectShiftSetting`}
                        {...shopExternalConnectionService.ShopExternalConnectionForm}
                        rules={validationRule.shiftSetting}
                        render={({ field, fieldState }) => (
                          <FormControl fullWidth>
                            <RadioGroup
                              value={field.value}
                              onChange={field.onChange}
                              aria-labelledby='salontype-radio-buttons-group-label'
                              name='salontype-radio-buttons-group'
                            >
                              <FormControlLabel
                                value={'true'}
                                control={<Radio />}
                                label={t.SCREEN_ACCOUNT_SETTING_CONNECTION_SALONBOARD_CONNECT_SHIFTSETTING_YES}
                              />
                              <FormControlLabel
                                value={'false'}
                                control={<Radio />}
                                label={t.SCREEN_ACCOUNT_SETTING_CONNECTION_SALONBOARD_CONNECT_SHIFTSETTING_NO}
                              />
                            </RadioGroup>
                            {fieldState.invalid && (
                              <Typography fontSize='0.8rem' color='error'>
                                {fieldState.error?.message}
                              </Typography>
                            )}
                          </FormControl>
                        )}
                      />
                    ) : (
                      <Skeleton variant='rounded' height={45} />
                    )}
                    <span className={styles.form_label}>
                      {
                        '※サロンボードのスタッフのシフト設定より予約枠を日単位で自動設定します。時間単位の予定は反映されません。'
                      }
                    </span>
                  </Grid>
                </Grid>
                <Grid>
                  <Box
                    sx={{
                      display: 'flex',
                      p: 1,
                      m: 1,
                      bgcolor: 'background.paper',
                      borderRadius: 1
                    }}
                  >
                    <Button
                      type='submit'
                      variant='contained'
                      disabled={shopExternalConnectionService.loading}
                      size='medium'
                    >
                      {t.BUTTON_UPDATE}
                    </Button>
                    <Button
                      variant='text'
                      disabled={shopExternalConnectionService.loading}
                      size='medium'
                      color='secondary'
                      sx={{ mr: 2 }}
                      onClick={() => {
                        onDeleteExternalConnection()
                      }}
                    >
                      {t.SCREEN_ACCOUNT_SETTING_CONNECTION_BUTTON_DELETE}
                    </Button>
                  </Box>
                </Grid>
              </Container>
            </Box>
          </Stack>
        </CustomTabPanel>
      </Box>
      <Box></Box>
      <Box>
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
      </Box>
    </Box>
  )
}
