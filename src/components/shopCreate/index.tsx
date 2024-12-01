// ** React Imports
import { useState, ReactNode, useEffect, Fragment } from 'react'

import BlankLayout from 'src/@core/layouts/BlankLayout'

// ** MUI Imports
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import InputLabel from '@mui/material/InputLabel'
import FormControl from '@mui/material/FormControl'
import FormHelperText from '@mui/material/FormHelperText'
import Typography from '@mui/material/Typography'
import Stack from '@mui/material/Stack'
import MenuItem from '@mui/material/MenuItem'
import Select from '@mui/material/Select'
import Divider from '@mui/material/Divider'

// ** Compornents
import ListErrors from 'src/@core/components/list-errors'

// ** React hook
import { SubmitHandler, Controller } from 'react-hook-form'
import { useLocale } from 'src/@core/hooks/useLocal'

// ** Service
import SignupService, { SignupFormType } from '@/service/SignupService'

// ** API
import { CountryType } from '@/@core/api/type/cCountry'
import { StateType } from '@/@core/api/type/cState'

// ** Validation Rules
import { ValidationRules } from './validationRule'
import { Link, Tooltip } from '@mui/material'
import { useRouter } from 'next/router'

const SignUpForm = () => {
  // ** Hook
  const { t } = useLocale()
  const router = useRouter()
  const validationRules = ValidationRules()
  const [errors, setErrors] = useState<string[]>([])
  const [isLoading, setLoading] = useState(false)

  // ** State
  const signupService = SignupService()

  // ** Init screen
  useEffect(() => {
    signupService.Init()

    // Only first time
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // ** Actions
  const onSubmit: SubmitHandler<SignupFormType> = async () => {
    let isMounted = true
    setLoading(true)
    try {
      const { message } = await signupService.CreateShop()

      if (message) {
        if (isMounted) {
          setErrors([message])
        }

        return
      }
      if (isMounted) {
        router.push('/store/')
      }
    } catch (error) {
      console.error(error)
    } finally {
      if (isMounted) {
        setLoading(false)
      }
    }

    return () => {
      isMounted = false
    }
  }

  return (
    <Stack component='form' noValidate onSubmit={signupService.Form.handleSubmit(onSubmit)}>
      <ListErrors errors={errors} setErrors={setErrors} />
      <Grid>
        <Grid container sx={{ marginBottom: 4 }} spacing={4}>
          <Grid item xs={12}>
            <Divider sx={{ mb: '0 !important' }} />
          </Grid>
          <Grid item xs={12}>
            <Typography variant='body2' sx={{ fontWeight: 600, mb: 2 }}>
              {t.SCREEN_COL_SIGNUP_STORE_ADMIN}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Controller
              name={`Signup.ShopName`}
              {...signupService.Form}
              rules={validationRules.storeName}
              render={({ field, fieldState }) => (
                <FormControl fullWidth>
                  <TextField
                    {...field}
                    {...signupService.Form.register(`Signup.ShopName`)}
                    fullWidth
                    type='text'
                    label={t.SCREEN_COL_SIGNUP_STORE_NAME}
                    id='shop-signup-card-storeName'
                    required
                    error={fieldState.invalid}
                    helperText={fieldState.error?.message}
                    InputLabelProps={{ shrink: true }}
                  />
                </FormControl>
              )}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <Controller
              name={`Signup.Email`}
              {...signupService.Form}
              rules={validationRules.email}
              render={({ field, fieldState }) => (
                <FormControl fullWidth>
                  <Tooltip title={t.SCREEN_COL_SIGNUP_STORE_EMAIL_TOOL} placement='top'>
                    <TextField
                      {...field}
                      {...signupService.Form.register(`Signup.Email`)}
                      fullWidth
                      type='text'
                      label={t.SCREEN_COL_SIGNUP_STORE_EMAIL}
                      id='shop-signup-card-Email'
                      required
                      error={fieldState.invalid}
                      helperText={fieldState.error?.message}
                      InputLabelProps={{ shrink: true }}
                    />
                  </Tooltip>
                </FormControl>
              )}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <Controller
              name={`Signup.TellCountryNoCd`}
              control={signupService.Form.control}
              rules={validationRules.tellCountryCd}
              render={({ field, fieldState }) => (
                <FormControl fullWidth error={fieldState.invalid}>
                  <InputLabel id='area-label' shrink={true} required>
                    {t.SCREEN_COL_SIGNUP_STORE_TELLCOUNTRY}
                  </InputLabel>
                  <Select
                    labelId='area-label'
                    id='shop-signup-card-TellCountryNoCd'
                    required
                    label={t.SCREEN_COL_SIGNUP_STORE_TELLCOUNTRY}
                    notched={true}
                    MenuProps={{
                      sx: {
                        maxHeight: 300
                      }
                    }}
                    {...field}
                  >
                    {signupService.tellCountryCd.map(c => {
                      return (
                        <MenuItem value={String(c.tell_country_cd)} key={c.tell_country_cd}>
                          {c.country_name} [{c.country_no}]
                        </MenuItem>
                      )
                    })}
                  </Select>
                  <FormHelperText>{fieldState.error?.message}</FormHelperText>
                </FormControl>
              )}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <Controller
              name={`Signup.TellNo`}
              {...signupService.Form}
              rules={validationRules.tellNo}
              render={({ field, fieldState }) => (
                <FormControl fullWidth>
                  <TextField
                    {...field}
                    {...signupService.Form.register(`Signup.TellNo`)}
                    fullWidth
                    type='text'
                    label={t.SCREEN_COL_SIGNUP_STORE_TELLNO}
                    id='shop-signup-card-TellNo'
                    required
                    error={fieldState.invalid}
                    helperText={fieldState.error?.message}
                    InputLabelProps={{ shrink: true }}
                  />
                </FormControl>
              )}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <Controller
              name={`Signup.BasicalCurrencyCd`}
              control={signupService.Form.control}
              rules={validationRules.basicalCurrencyCd}
              render={({ field, fieldState }) => (
                <FormControl fullWidth error={fieldState.invalid}>
                  <InputLabel id='area-label' shrink={true} required>
                    {t.SCREEN_COL_SIGNUP_STORE_BASICALCURRENCY}
                  </InputLabel>
                  <Tooltip title={t.SCREEN_COL_SIGNUP_STORE_BASICALCURRENCY_TOOL} placement='top'>
                    <Select
                      labelId='area-label'
                      id='shop-signup-card-BasicalCurrencyCd'
                      required
                      label={t.SCREEN_COL_SIGNUP_STORE_BASICALCURRENCY}
                      notched={true}
                      MenuProps={{
                        sx: {
                          maxHeight: 300
                        }
                      }}
                      {...field}
                    >
                      {signupService.currencyCd.map(c => {
                        return (
                          <MenuItem value={String(c.currency_cd)} key={c.currency_cd}>
                            {c.currency_cd_iso}
                          </MenuItem>
                        )
                      })}
                    </Select>
                  </Tooltip>
                  <FormHelperText>{fieldState.error?.message}</FormHelperText>
                </FormControl>
              )}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <Controller
              name={`Signup.PaymentCurrencyCd`}
              control={signupService.Form.control}
              rules={validationRules.paymentCurrencyCd}
              render={({ field, fieldState }) => (
                <FormControl fullWidth error={fieldState.invalid}>
                  <InputLabel id='area-label' shrink={true} required>
                    {t.SCREEN_COL_SIGNUP_STORE_PAYMENTCURRENCY}
                  </InputLabel>
                  <Tooltip title={t.SCREEN_COL_SIGNUP_STORE_PAYMENTCURRENCY_TOOL} placement='top'>
                    <Select
                      labelId='area-label'
                      id='shop-signup-card-PaymentCurrencyCd'
                      required
                      label={t.SCREEN_COL_SIGNUP_STORE_PAYMENTCURRENCY}
                      notched={true}
                      MenuProps={{
                        sx: {
                          maxHeight: 300
                        }
                      }}
                      {...field}
                    >
                      {signupService.cfpCurrencyCd.map(c => {
                        return (
                          <MenuItem value={String(c.currency_cd)} key={c.currency_cd}>
                            {c.currency_cd_iso}
                          </MenuItem>
                        )
                      })}
                    </Select>
                  </Tooltip>
                  <FormHelperText>{fieldState.error?.message}</FormHelperText>
                </FormControl>
              )}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <Controller
              name={`Signup.BookingMethodCd`}
              control={signupService.Form.control}
              rules={validationRules.paymentCurrencyCd}
              render={({ field, fieldState }) => (
                <FormControl fullWidth error={fieldState.invalid}>
                  <InputLabel id='area-label' shrink={true} required>
                    {t.SCREEN_COL_SIGNUP_STORE_BOOKINGMETHOD}
                  </InputLabel>
                  <Tooltip title={t.SCREEN_COL_SIGNUP_STORE_BOOKINGMETHOD_TOOL} placement='top'>
                    <Select
                      labelId='area-label'
                      id='shop-signup-card-BookingMethodCd'
                      required
                      label={t.SCREEN_COL_SIGNUP_STORE_BOOKINGMETHOD}
                      notched={true}
                      MenuProps={{
                        sx: {
                          maxHeight: 300
                        }
                      }}
                      {...field}
                    >
                      {signupService.bookingMethod.map(c => {
                        return (
                          <MenuItem value={String(c.booking_method_cd)} key={c.booking_method_cd}>
                            {c.booking_method_name}
                          </MenuItem>
                        )
                      })}
                    </Select>
                  </Tooltip>
                  <FormHelperText>{fieldState.error?.message}</FormHelperText>
                </FormControl>
              )}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <Controller
              name={`Signup.BasicalLanguageCd`}
              control={signupService.Form.control}
              rules={validationRules.basicalLanguageCd}
              render={({ field, fieldState }) => (
                <FormControl fullWidth error={fieldState.invalid}>
                  <InputLabel id='area-label' shrink={true} required>
                    {t.SCREEN_COL_SIGNUP_STORE_BASICALLANGUAGE}
                  </InputLabel>
                  <Select
                    labelId='area-label'
                    id='shop-signup-card-BasicalLanguageCd'
                    required
                    label={t.SCREEN_COL_SIGNUP_STORE_BASICALLANGUAGE}
                    notched={true}
                    MenuProps={{
                      sx: {
                        maxHeight: 300
                      }
                    }}
                    {...field}
                  >
                    {signupService.languageCd.map(c => {
                      return (
                        <MenuItem value={String(c.LanguageCd)} key={c.LanguageCd}>
                          {c.LanguageName}
                        </MenuItem>
                      )
                    })}
                  </Select>
                  <FormHelperText>{fieldState.error?.message}</FormHelperText>
                </FormControl>
              )}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <Controller
              name={`Signup.ShopAdminPicName`}
              {...signupService.Form}
              rules={validationRules.picName}
              render={({ field, fieldState }) => (
                <FormControl fullWidth>
                  <TextField
                    {...field}
                    {...signupService.Form.register(`Signup.ShopAdminPicName`)}
                    fullWidth
                    type='text'
                    label={t.SCREEN_COL_SIGNUP_STORE_ADMIN_PIC_NAME}
                    id='shop-signup-card-PicName'
                    required
                    error={fieldState.invalid}
                    helperText={fieldState.error?.message}
                    InputLabelProps={{ shrink: true }}
                  />
                </FormControl>
              )}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <Controller
              name={`Signup.ShopAdminPicTellCountryCd`}
              control={signupService.Form.control}
              rules={validationRules.picTellCountryNo}
              render={({ field, fieldState }) => (
                <FormControl fullWidth error={fieldState.invalid}>
                  <InputLabel id='area-label' shrink={true} required>
                    {t.SCREEN_COL_SIGNUP_STORE_ADMIN_PIC_TELL_COUNTRY_NO_CD}
                  </InputLabel>
                  <Select
                    labelId='area-label'
                    id='shop-signup-card-AdminPicTellCountryCd'
                    required
                    label={t.SCREEN_COL_SIGNUP_STORE_ADMIN_PIC_TELL_COUNTRY_NO_CD}
                    notched={true}
                    MenuProps={{
                      sx: {
                        maxHeight: 300
                      }
                    }}
                    {...field}
                  >
                    {signupService.tellCountryCd.map(c => {
                      return (
                        <MenuItem value={String(c.tell_country_cd)} key={c.tell_country_cd}>
                          {c.country_name} [{c.country_no}]
                        </MenuItem>
                      )
                    })}
                  </Select>
                  <FormHelperText>{fieldState.error?.message}</FormHelperText>
                </FormControl>
              )}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <Controller
              name={`Signup.ShopAdminPicTellNo`}
              {...signupService.Form}
              rules={validationRules.picTellNo}
              render={({ field, fieldState }) => (
                <FormControl fullWidth>
                  <TextField
                    {...field}
                    {...signupService.Form.register(`Signup.ShopAdminPicTellNo`)}
                    fullWidth
                    type='text'
                    label={t.SCREEN_ACCOUNT_SETTING_ADMIN_PIC_TELL_NO}
                    id='shop-signup-card-PicTellNo'
                    required
                    error={fieldState.invalid}
                    helperText={fieldState.error?.message}
                    InputLabelProps={{ shrink: true }}
                  />
                </FormControl>
              )}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <Controller
              name={`Signup.ShopAdminPicEmailAddress`}
              {...signupService.Form}
              rules={validationRules.picEmail}
              render={({ field, fieldState }) => (
                <FormControl fullWidth>
                  <TextField
                    {...field}
                    {...signupService.Form.register(`Signup.ShopAdminPicEmailAddress`)}
                    fullWidth
                    type='text'
                    label={t.SCREEN_COL_SIGNUP_STORE_ADMIN_PIC_EMAIL}
                    id='shop-signup-card-PicEmailAddress'
                    required
                    error={fieldState.invalid}
                    helperText={fieldState.error?.message}
                    InputLabelProps={{ shrink: true }}
                  />
                </FormControl>
              )}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <Controller
              name={`Signup.IdentifyNumber`}
              {...signupService.Form}
              rules={validationRules.identifyNumber}
              render={({ field, fieldState }) => (
                <FormControl fullWidth>
                  <TextField
                    {...field}
                    {...signupService.Form.register(`Signup.IdentifyNumber`)}
                    fullWidth
                    type='text'
                    label={t.SCREEN_COL_SIGNUP_STORE_IDENTIFY}
                    id='shop-signup-card-IdentifyNumber'
                    error={fieldState.invalid}
                    helperText={fieldState.error?.message}
                    InputLabelProps={{ shrink: true }}
                  />
                </FormControl>
              )}
            />
          </Grid>
          <Grid item xs={12}>
            <Divider sx={{ mb: '0 !important' }} />
          </Grid>
          <Grid item xs={12}>
            <Typography variant='body2' sx={{ fontWeight: 600, mb: 2 }}>
              {t.SCREEN_COL_SIGNUP_STORE_LOCATION}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Controller
              name={`Signup.CountryCd`}
              control={signupService.Form.control}
              rules={validationRules.country}
              render={({ field, fieldState }) => (
                <FormControl fullWidth error={fieldState.invalid}>
                  <InputLabel id='area-label' shrink={true} required>
                    {t.SCREEN_COL_SIGNUP_COUNTRY}
                  </InputLabel>
                  <Select
                    labelId='area-label'
                    id='shop-signup-card-countrycd'
                    required
                    label={t.SCREEN_COL_SIGNUP_COUNTRY}
                    notched={true}
                    MenuProps={{
                      sx: {
                        maxHeight: 300
                      }
                    }}
                    {...field}
                  >
                    {signupService.countryCd.map((c: CountryType) => {
                      return (
                        <MenuItem value={String(c.country_cd)} key={c.country_cd}>
                          {c.country_name}
                        </MenuItem>
                      )
                    })}
                  </Select>
                  <FormHelperText>{fieldState.error?.message}</FormHelperText>
                </FormControl>
              )}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <Controller
              name={`Signup.StateCd`}
              control={signupService.Form.control}
              rules={validationRules.state}
              render={({ field, fieldState }) => (
                <FormControl fullWidth error={fieldState.invalid}>
                  <InputLabel id='area-label' shrink={true} required>
                    {t.SCREEN_COL_SIGNUP_STATE}
                  </InputLabel>
                  <Select
                    labelId='area-label'
                    id='shop-signup-card-statecd'
                    required
                    label={t.SCREEN_COL_SIGNUP_STATE}
                    notched={true}
                    MenuProps={{
                      sx: {
                        maxHeight: 300
                      }
                    }}
                    {...field}
                  >
                    {signupService.stateCd.map((c: StateType) => {
                      return (
                        <MenuItem value={String(c.state_cd)} key={c.state_cd}>
                          {c.state_name}
                        </MenuItem>
                      )
                    })}
                  </Select>
                  <FormHelperText>{fieldState.error?.message}</FormHelperText>
                </FormControl>
              )}
            />
          </Grid>
          <Grid item xs={12} sm={12}>
            <Controller
              name={`Signup.Address1`}
              {...signupService.Form}
              rules={validationRules.address1}
              render={({ field, fieldState }) => (
                <FormControl fullWidth>
                  <TextField
                    {...field}
                    {...signupService.Form.register(`Signup.Address1`)}
                    fullWidth
                    type='text'
                    label={t.SCREEN_COL_SIGNUP_ADDRESS1}
                    id='shop-signup-card-address1'
                    required
                    error={fieldState.invalid}
                    helperText={fieldState.error?.message}
                    InputLabelProps={{ shrink: true }}
                  />
                </FormControl>
              )}
            />
          </Grid>
          <Grid item xs={12} sm={12}>
            <Controller
              name={`Signup.Address2`}
              control={signupService.Form.control}
              rules={validationRules.address2}
              render={({ field, fieldState }) => (
                <FormControl fullWidth>
                  <TextField
                    {...field}
                    {...signupService.Form.register(`Signup.Address2`)}
                    fullWidth
                    type='text'
                    label={t.SCREEN_COL_SIGNUP_ADDRESS2}
                    id='shop-signup-card-address2'
                    error={fieldState.invalid}
                    helperText={fieldState.error?.message}
                    InputLabelProps={{ shrink: true }}
                  />
                </FormControl>
              )}
            />
          </Grid>
          <Grid item xs={12} sm={12}>
            <Controller
              name={`Signup.Address3`}
              control={signupService.Form.control}
              rules={validationRules.address3}
              render={({ field, fieldState }) => (
                <FormControl fullWidth>
                  <TextField
                    {...field}
                    {...signupService.Form.register(`Signup.Address3`)}
                    fullWidth
                    type='text'
                    label={t.SCREEN_COL_SIGNUP_ADDRESS3}
                    id='shop-signup-card-address3'
                    error={fieldState.invalid}
                    helperText={fieldState.error?.message}
                    InputLabelProps={{ shrink: true }}
                  />
                </FormControl>
              )}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <Controller
              name={`Signup.MapUrl`}
              {...signupService.Form}
              rules={validationRules.mapUrl}
              render={({ field, fieldState }) => (
                <FormControl fullWidth>
                  <Tooltip
                    placement='top'
                    title={
                      <Fragment>
                        <Typography color='inherit'>{t.SCREEN_COL_SIGNUP_MAP_URL_TOOL}</Typography>
                        <Link target='_blank' href='https://www.google.co.jp/maps'>
                          Google map
                        </Link>
                      </Fragment>
                    }
                  >
                    <TextField
                      {...field}
                      {...signupService.Form.register(`Signup.MapUrl`)}
                      fullWidth
                      type='text'
                      label={t.SCREEN_COL_SIGNUP_MAP_URL}
                      id='shop-signup-card-MapUrl'
                      required
                      error={fieldState.invalid}
                      helperText={fieldState.error?.message}
                      InputLabelProps={{ shrink: true }}
                    />
                  </Tooltip>
                </FormControl>
              )}
            />
          </Grid>
        </Grid>
        <Grid>
          <Box
            sx={{
              gap: 5,
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}
          >
            <Button type='submit' variant='contained' size='large' disabled={isLoading}>
              {t.BUTTON_UPDATE}
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Stack>
  )
}

SignUpForm.getLayout = (page: ReactNode) => <BlankLayout>{page}</BlankLayout>
export default SignUpForm
