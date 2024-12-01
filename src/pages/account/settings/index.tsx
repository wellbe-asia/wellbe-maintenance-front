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
  AlertColor
} from '@mui/material'

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
import { SHOP_STATUS, YES_NO } from '@/@core/utils/constant'
import CheckoutTimingCdService from '@/service/CheckoutTimingCdService'
import ShopForMaintenanceService from '@/service/ShopForMaintenanceService'

export default function AccountSettings() {
  const { t } = useLocale()
  const router = useRouter()
  const { shop_id } = router.query
  const shopId = shop_id && [shop_id].flat(1).length > 0 ? [shop_id].flat(1)[0] : ''

  const [openError, setOpenError] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [severity, setSeverity] = useState<AlertColor | undefined>('error')

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

  return (
    <Box>
      <Stack component='form' noValidate onSubmit={accountService.Form.handleSubmit(onSubmit)}>
        <Box className={styles.signup_box}>
          <Box className={styles.signup_box_inner}>
            <Box className={styles.signup_head}>
              <h2>{t.SCREEN_ACCOUNT_SETTINGS}</h2>
            </Box>
            <Box sx={{ width: '100%', mb: 10, display: 'flex', flexDirection: 'row-reverse' }}>
              {accountService.shop &&
                (accountService.shop.ShopStatusCd == SHOP_STATUS.UNAPPROVED ||
                  accountService.shop.ShopStatusCd == SHOP_STATUS.REQUESTED) && (
                  <Button
                    size='medium'
                    variant='contained'
                    color='primary'
                    onClick={() => onApprove(accountService.shop?.Id || '')}
                    sx={{ mr: 2 }}
                  >
                    {t.BUTTON_SHOP_APPROVE}
                  </Button>
                )}
              {accountService.shop && accountService.shop.ShopStatusCd == SHOP_STATUS.APPROVED && (
                <Button
                  size='medium'
                  variant='contained'
                  color='error'
                  onClick={() => onSuspend(accountService.shop?.Id || '')}
                  sx={{ mr: 2 }}
                >
                  {'掲載停止'}
                </Button>
              )}
            </Box>
            <Box className={styles.signup_inner}>
              <Container maxWidth='sm' sx={{ pt: 5, pb: 5 }}>
                <Grid container sx={{ marginBottom: 4 }} spacing={5}>
                  <Grid item xs={12}>
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
                  <Grid item xs={12}>
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
                  <Grid item xs={12}>
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
                  <Grid item xs={12}>
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
                  <Grid item xs={12}>
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
                  <Grid item xs={12}>
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
                  <Grid item xs={12}>
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
                  <Grid item xs={12}>
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
                  <Grid item xs={12}>
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
                  <Grid item xs={12}>
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
                  <Grid item xs={12}>
                    <span className={styles.form_label}>{t.SCREEN_ACCOUNT_SETTING_ADMIN_PIC_TELL_COUNTRY_NO_CD}*</span>
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
                  <Grid item xs={12}>
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
                  <Grid item xs={12}>
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
                  <Grid item xs={12}>
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
                  <Grid item xs={12}>
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
                      flexDirection: 'row-reverse',
                      p: 1,
                      m: 1,
                      bgcolor: 'background.paper',
                      borderRadius: 1
                    }}
                  >
                    <Button type='submit' variant='contained' disabled={accountService.loading} size='medium'>
                      {t.BUTTON_UPDATE}
                    </Button>
                  </Box>
                </Grid>
              </Container>
            </Box>
          </Box>
        </Box>
      </Stack>
      <Stack
        component='form'
        noValidate
        onSubmit={shopMaintenanceLabelService.Form.handleSubmit(onSubmitShopMaintenanceLabel)}
      >
        <Box className={styles.signup_box}>
          <Box className={styles.signup_box_inner}>
            <Box className={styles.signup_head}>
              <h2>{t.SCREEN_ACCOUNT_SETTING_MAINTENANCE_LABEL}</h2>
            </Box>
            <Box className={styles.signup_inner}>
              <Container maxWidth='sm' sx={{ pt: 5, pb: 5 }}>
                <Grid container spacing={2}>
                  {shopMaintenanceLabelService.ControlledFields.length > 0 && (
                    <>
                      <Grid item xs={12}>
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
                      flexDirection: 'row-reverse',
                      p: 1,
                      m: 1,
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
      <Stack component='form' noValidate onSubmit={accountService.ShopUrlForm.handleSubmit(onSubmitShopUrl)}>
        <Box className={styles.signup_box}>
          <Box className={styles.signup_box_inner}>
            <Box className={styles.signup_head}>
              <h2>{t.SCREEN_ACCOUNT_SETTING_URL_READONLY}</h2>
            </Box>
            <Box className={styles.signup_inner}>
              <Container maxWidth='sm' sx={{ pt: 5, pb: 5 }}>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
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
                        flexDirection: 'row-reverse',
                        p: 1,
                        m: 1,
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
            sx={{ width: '100%', fontSize: '1.5rem' }}
          >
            {errorMessage}
          </Alert>
        </Snackbar>
      </Box>
    </Box>
  )
}
