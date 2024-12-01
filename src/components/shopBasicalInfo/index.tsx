// ** React Imports
import { useState, useEffect, forwardRef } from 'react'
import { Controller, SubmitHandler } from 'react-hook-form'

// ** MUI Imports
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import TextField from '@mui/material/TextField'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import FormControl from '@mui/material/FormControl'
import FormHelperText from '@mui/material/FormHelperText'
import Stack from '@mui/material/Stack'
import MenuItem from '@mui/material/MenuItem'
import {
  Alert,
  Backdrop,
  Checkbox,
  CircularProgress,
  FormControlLabel,
  IconButton,
  InputLabel,
  Snackbar,
  Typography
} from '@mui/material'
import Select from '@mui/material/Select'
import Skeleton from '@mui/material/Skeleton'

// ** Compornents
import ListErrors from 'src/@core/components/list-errors'

// ** ValidationRules
import { ValidationRules } from './validationRule'

// ** hook
import { useLocale } from 'src/@core/hooks/useLocal'
import { useRouter } from 'next/router'

// ** Service
import ShopBasicalInfoService, { ShopBasicalInfoType } from '@/service/ShopBasicalInforService'
import { getDefaultLanguageCd, getLanguageCdWithValue } from '@/configs/locales/locales'
import { NumericFormat, NumericFormatProps } from 'react-number-format'
import { GridAddIcon, GridDeleteIcon } from '@mui/x-data-grid'

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
const ShopBasicalInfoCard = (props: { shopId: string }) => {
  // ** Hook
  const { t } = useLocale()
  const router = useRouter()

  const validationRules = ValidationRules()

  // ** State
  const [errors, setErrors] = useState<string[]>([])
  const [successOpen, setSuccessOpen] = useState(false)
  const [languageCd, setLanguageCd] = useState('')

  // ** Service
  const shopBasicalInfoService = ShopBasicalInfoService()

  useEffect(() => {
    window.scrollTo(0, 0) // ページのトップにスクロール
  }, [shopBasicalInfoService.loading])

  // ** Control
  const { register } = shopBasicalInfoService.ShopBasicalInfoForm

  // ** Init screen
  useEffect(() => {
    const varLanguageCd = router.locale ? getLanguageCdWithValue(router.locale) : getDefaultLanguageCd()
    shopBasicalInfoService.Init(props.shopId, varLanguageCd)
    setLanguageCd(varLanguageCd)

    // Only first time
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.locale])

  const onSubmit: SubmitHandler<ShopBasicalInfoType> = async () => {
    try {
      const res = await shopBasicalInfoService.Submit()

      if (res.message != '') {
        setErrors([res.message])

        return
      }
      setSuccessOpen(true)
      shopBasicalInfoService.Init(props.shopId, languageCd)
    } catch (error) {
      console.error(error)
    } finally {
    }
  }

  return (
    <Box className='content-center'>
      <Card>
        <CardHeader title={t.SCREEN_TITLE_SHOP_BASIC_INFORMATION} titleTypographyProps={{ variant: 'h6' }} />
        <CardContent>
          <Stack
            component='form'
            noValidate
            onSubmit={shopBasicalInfoService.ShopBasicalInfoForm.handleSubmit(onSubmit)}
          >
            <ListErrors errors={errors} setErrors={setErrors} />
            {!shopBasicalInfoService.loading ? (
              <Grid container sx={{ marginBottom: 4 }} spacing={4}>
                <Grid item xs={12}>
                  {t.SCREEN_TITLE_CONTACT}
                </Grid>
                <Grid item xs={12}>
                  <Controller
                    name={`ShopBasicalInfo.ShopContact.ShopTellCountryNoCd`}
                    {...shopBasicalInfoService.ShopBasicalInfoForm}
                    rules={validationRules.shopTellCountryNo}
                    render={({ field, fieldState }) => (
                      <FormControl fullWidth error={fieldState.invalid}>
                        <InputLabel id='area-label' shrink={true} required>
                          {t.SCREEN_COL_SHOP_CONTACT_TELL_COUNTRYNO}
                        </InputLabel>
                        <Select
                          {...field}
                          labelId='area-label'
                          id='ShopBasicalInfo.ShopContact.ShopTellCountryNoCd'
                          required
                          label={t.SCREEN_COL_SHOP_CONTACT_TELL_COUNTRYNO}
                          notched={true}
                          MenuProps={{
                            sx: {
                              maxHeight: 300
                            }
                          }}
                          name={field.name}
                          onBlur={field.onBlur}
                          onChange={field.onChange}
                          value={field.value}
                        >
                          {shopBasicalInfoService.tellCountryCd.map((c, j) => {
                            return (
                              <MenuItem
                                value={String(c.tell_country_cd)}
                                key={`ShopBasicalInfo.ShopContact.ShopTellCountryNoCd.${j}`}
                              >
                                {c.country_no} [{c.country_name}]
                              </MenuItem>
                            )
                          })}
                        </Select>
                        <FormHelperText>{fieldState.error?.message}</FormHelperText>
                      </FormControl>
                    )}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Controller
                    name={`ShopBasicalInfo.ShopContact.ShopTellNo`}
                    {...shopBasicalInfoService.ShopBasicalInfoForm}
                    rules={validationRules.shopTellNo}
                    render={({ field, fieldState }) => (
                      <FormControl fullWidth>
                        <TextField
                          {...field}
                          {...register(`ShopBasicalInfo.ShopContact.ShopTellNo`)}
                          fullWidth
                          type='text'
                          label={t.SCREEN_COL_SHOP_CONTACT_TELLNO}
                          id='ShopBasicalInfo.ShopContact.ShopTellNo'
                          required
                          error={fieldState.invalid}
                          helperText={fieldState.error?.message}
                          InputLabelProps={{ shrink: true }}
                        />
                      </FormControl>
                    )}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Controller
                    name={`ShopBasicalInfo.ShopContact.ShopEmailAddress`}
                    {...shopBasicalInfoService.ShopBasicalInfoForm}
                    rules={validationRules.shopEmailAddress}
                    render={({ field, fieldState }) => (
                      <FormControl fullWidth>
                        <TextField
                          {...field}
                          {...register(`ShopBasicalInfo.ShopContact.ShopEmailAddress`)}
                          fullWidth
                          type='text'
                          label={t.SCREEN_COL_SHOP_CONTACT_EMAIL}
                          id='ShopBasicalInfo.ShopContact.ShopEmailAddress'
                          required
                          error={fieldState.invalid}
                          helperText={fieldState.error?.message}
                          InputLabelProps={{ shrink: true }}
                        />
                      </FormControl>
                    )}
                  />
                </Grid>
                <Grid item xs={12} sx={{ marginTop: '10px' }}>
                  {t.SCREEN_TITLE_SHOP_LOCATION}
                </Grid>
                <Grid item xs={12}>
                  <Controller
                    name={`ShopBasicalInfo.ShopLocation.CountryCd`}
                    {...shopBasicalInfoService.ShopBasicalInfoForm}
                    rules={validationRules.country}
                    render={({ field, fieldState }) => (
                      <FormControl fullWidth error={fieldState.invalid}>
                        <InputLabel id='area-label' shrink={true} required>
                          {t.SCREEN_COL_SHOP_LOCATION_COUNTRY}
                        </InputLabel>
                        <Select
                          labelId='area-label'
                          id='ShopBasicalInfo.ShopLocation.CountryCd'
                          required
                          label={t.SCREEN_COL_SHOP_LOCATION_COUNTRY}
                          notched={true}
                          MenuProps={{
                            sx: {
                              maxHeight: 300
                            }
                          }}
                          name={field.name}
                          onBlur={field.onBlur}
                          onChange={field.onChange}
                          value={field.value}
                        >
                          {shopBasicalInfoService.countryCd.map((c, j) => {
                            return (
                              <MenuItem
                                value={String(c.country_cd)}
                                key={`ShopBasicalInfo.ShopLocation.CountryCd.${j}`}
                              >
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
                <Grid item xs={12}>
                  <Controller
                    name={`ShopBasicalInfo.ShopLocation.StateCd`}
                    {...shopBasicalInfoService.ShopBasicalInfoForm}
                    rules={validationRules.state}
                    render={({ field, fieldState }) => (
                      <FormControl fullWidth error={fieldState.invalid}>
                        <InputLabel id='area-label' shrink={true} required>
                          {t.SCREEN_COL_SHOP_LOCATION_STATE}
                        </InputLabel>
                        <Select
                          labelId='area-label'
                          id='ShopBasicalInfo.ShopLocation.StateCd'
                          required
                          label={t.SCREEN_COL_SHOP_LOCATION_STATE}
                          notched={true}
                          MenuProps={{
                            sx: {
                              maxHeight: 300
                            }
                          }}
                          name={field.name}
                          onBlur={field.onBlur}
                          onChange={field.onChange}
                          value={field.value}
                        >
                          {shopBasicalInfoService.stateCd.map((c, j) => {
                            return (
                              <MenuItem value={String(c.state_cd)} key={`ShopBasicalInfo.ShopLocation.StateCd.${j}`}>
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
                <Grid item xs={12}>
                  <Controller
                    name={`ShopBasicalInfo.ShopLocation.Address1`}
                    {...shopBasicalInfoService.ShopBasicalInfoForm}
                    rules={validationRules.address1}
                    render={({ field, fieldState }) => (
                      <FormControl fullWidth>
                        <TextField
                          {...field}
                          {...register(`ShopBasicalInfo.ShopLocation.Address1`)}
                          fullWidth
                          type='text'
                          label={t.SCREEN_COL_SHOP_LOCATION_ADDRESS1}
                          id='ShopBasicalInfo.ShopLocation.Address1'
                          required
                          error={fieldState.invalid}
                          helperText={fieldState.error?.message}
                          InputLabelProps={{ shrink: true }}
                        />
                      </FormControl>
                    )}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Controller
                    name={`ShopBasicalInfo.ShopLocation.Address2`}
                    {...shopBasicalInfoService.ShopBasicalInfoForm}
                    rules={validationRules.address2}
                    render={({ field, fieldState }) => (
                      <FormControl fullWidth>
                        <TextField
                          {...field}
                          {...register(`ShopBasicalInfo.ShopLocation.Address2`)}
                          fullWidth
                          type='text'
                          label={t.SCREEN_COL_SHOP_LOCATION_ADDRESS2}
                          id='ShopBasicalInfo.ShopLocation.Address2'
                          error={fieldState.invalid}
                          helperText={fieldState.error?.message}
                          InputLabelProps={{ shrink: true }}
                        />
                      </FormControl>
                    )}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Controller
                    name={`ShopBasicalInfo.ShopLocation.Address3`}
                    {...shopBasicalInfoService.ShopBasicalInfoForm}
                    rules={validationRules.address3}
                    render={({ field, fieldState }) => (
                      <FormControl fullWidth>
                        <TextField
                          {...field}
                          {...register(`ShopBasicalInfo.ShopLocation.Address3`)}
                          fullWidth
                          type='text'
                          label={t.SCREEN_COL_SHOP_LOCATION_ADDRESS3}
                          id='ShopBasicalInfo.ShopLocation.Address3'
                          error={fieldState.invalid}
                          helperText={fieldState.error?.message}
                          InputLabelProps={{ shrink: true }}
                        />
                      </FormControl>
                    )}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Controller
                    name={`ShopBasicalInfo.ShopLocation.Latitude`}
                    {...shopBasicalInfoService.ShopBasicalInfoForm}
                    rules={validationRules.latitude}
                    render={({ field, fieldState }) => (
                      <FormControl fullWidth>
                        <TextField
                          {...field}
                          {...register(`ShopBasicalInfo.ShopLocation.Latitude`)}
                          fullWidth
                          type='text'
                          label={t.SCREEN_COL_SHOP_LOCATION_LATITUDE}
                          id='ShopBasicalInfo.ShopLocation.Latitude'
                          required
                          error={fieldState.invalid}
                          helperText={fieldState.error?.message}
                          InputLabelProps={{ shrink: true }}
                        />
                      </FormControl>
                    )}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Controller
                    name={`ShopBasicalInfo.ShopLocation.Longitude`}
                    {...shopBasicalInfoService.ShopBasicalInfoForm}
                    rules={validationRules.longitude}
                    render={({ field, fieldState }) => (
                      <FormControl fullWidth>
                        <TextField
                          {...field}
                          {...register(`ShopBasicalInfo.ShopLocation.Longitude`)}
                          fullWidth
                          type='text'
                          label={t.SCREEN_COL_SHOP_LOCATION_LONGITUDE}
                          id='ShopBasicalInfo.ShopLocation.Longitude'
                          required
                          error={fieldState.invalid}
                          helperText={fieldState.error?.message}
                          InputLabelProps={{ shrink: true }}
                        />
                      </FormControl>
                    )}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Controller
                    name={`ShopBasicalInfo.ShopLocation.MapUrl`}
                    {...shopBasicalInfoService.ShopBasicalInfoForm}
                    rules={validationRules.mapUrl}
                    render={({ field, fieldState }) => (
                      <FormControl fullWidth>
                        <TextField
                          {...field}
                          {...register(`ShopBasicalInfo.ShopLocation.MapUrl`)}
                          fullWidth
                          type='text'
                          label={t.SCREEN_COL_SHOP_LOCATION_MAP_URL}
                          id='ShopBasicalInfo.ShopLocation.MapUrl'
                          required
                          error={fieldState.invalid}
                          helperText={fieldState.error?.message}
                          InputLabelProps={{ shrink: true }}
                        />
                      </FormControl>
                    )}
                  />
                </Grid>
                <Grid item xs={12} sx={{ marginTop: '10px' }}>
                  {t.SCREEN_TITLE_EQUIPMENT}
                </Grid>
                <Grid item xs={12}>
                  <Controller
                    name={`ShopBasicalInfo.ShopEquipment.Quantity`}
                    {...shopBasicalInfoService.ShopBasicalInfoForm}
                    rules={validationRules.quantity}
                    render={({ field, fieldState }) => (
                      <FormControl fullWidth>
                        <TextField
                          {...field}
                          {...register(`ShopBasicalInfo.ShopEquipment.Quantity`)}
                          fullWidth
                          type='number'
                          label={t.SCREEN_COL_SHOP_EQUIPMENT_QUANTITY}
                          id='ShopBasicalInfo.ShopEquipment.Quantity'
                          required
                          error={fieldState.invalid}
                          helperText={fieldState.error?.message}
                          InputLabelProps={{ shrink: true }}
                        />
                      </FormControl>
                    )}
                  />
                </Grid>
                <Grid item xs={12} sx={{ marginTop: '10px' }}>
                  {t.SCREEN_TITLE_CHIP}
                </Grid>
                <Grid item xs={12}>
                  <Controller
                    name={`ShopBasicalInfo.ShopChip.NeedShopChip`}
                    {...shopBasicalInfoService.ShopBasicalInfoForm}
                    render={({ field, fieldState }) => (
                      <FormControl fullWidth error={fieldState.invalid}>
                        <FormControlLabel
                          label={t.SCREEN_COL_SHOP_NEED_CHIP}
                          control={
                            <Checkbox
                              id='shop-chip-card-needShopChip'
                              defaultChecked={field.value}
                              onChange={v => {
                                if (!v.target.checked) {
                                  shopBasicalInfoService.ShopBasicalInfoForm.setValue(
                                    `ShopBasicalInfo.ShopChip.ShopChipStandardAmmount`,
                                    ''
                                  )
                                  shopBasicalInfoService.ShopBasicalInfoForm.clearErrors(
                                    `ShopBasicalInfo.ShopChip.ShopChipStandardAmmount`
                                  )
                                }
                                shopBasicalInfoService.ShopBasicalInfoForm.setValue(
                                  `ShopBasicalInfo.ShopChip.NeedShopChip`,
                                  v.target.checked
                                )
                              }}
                            />
                          }
                        />
                      </FormControl>
                    )}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Controller
                    name={`ShopBasicalInfo.ShopChip.ShopChipStandardAmmount`}
                    {...shopBasicalInfoService.ShopBasicalInfoForm}
                    rules={{
                      required: shopBasicalInfoService.ShopChipWatchField?.NeedShopChip
                        ? t.MESSAGE_REQUIRED_TEXTFIELD
                        : ''
                    }}
                    render={({ field, fieldState }) => (
                      <FormControl fullWidth>
                        <TextField
                          {...field}
                          {...shopBasicalInfoService.ShopBasicalInfoForm.register(
                            `ShopBasicalInfo.ShopChip.ShopChipStandardAmmount`
                          )}
                          fullWidth
                          type='text'
                          label={t.SCREEN_COL_SHOP_STANDARD_CHIP_AMMOUNT}
                          id='ShopBasicalInfo.ShopChip.ShopChipStandardAmmount'
                          required={shopBasicalInfoService.ShopChipWatchField?.NeedShopChip}
                          error={shopBasicalInfoService.ShopChipWatchField?.NeedShopChip && fieldState.invalid}
                          helperText={fieldState.error?.message}
                          disabled={!shopBasicalInfoService.ShopChipWatchField?.NeedShopChip}
                          InputLabelProps={{ shrink: true }}
                          InputProps={{
                            inputComponent: NumericFormatCustom as any
                          }}
                        />
                      </FormControl>
                    )}
                  />
                </Grid>
                <Grid item xs={12} sx={{ marginTop: '10px' }}>
                  {t.SCREEN_TITLE_BUSSINESS_HOUR}
                </Grid>
                {shopBasicalInfoService.ShopBussinessHoursControlledFields.length > 0 &&
                  shopBasicalInfoService.ShopBussinessHoursControlledFields.map((field, index) => {
                    return (
                      <>
                        <Grid item xs={12} key={`ShopBasicalInfo.ShopBussinessHour.${index}`}>
                          <Grid container spacing={4}>
                            <Grid item xs={4} md={2}>
                              <Typography variant='body1'>{field.WeekdayName}</Typography>
                            </Grid>
                            <Grid item xs={8} md={2}>
                              <Controller
                                name={`ShopBasicalInfo.ShopBussinessHours.${index}.IsHoliday`}
                                {...shopBasicalInfoService.ShopBasicalInfoForm}
                                render={({ field, fieldState }) => (
                                  <FormControl fullWidth error={fieldState.invalid}>
                                    <FormControlLabel
                                      label={t.SCREEN_COL_BUSSINESS_HOUR_ISHOLIDAY}
                                      autoFocus={false}
                                      {...field}
                                      control={
                                        <Checkbox
                                          id='shop-BussinessHour-card-needShopBussinessHour'
                                          defaultChecked={field.value}
                                          autoFocus={false}
                                          onChange={v => {
                                            if (v.target.checked) {
                                              shopBasicalInfoService.ShopBasicalInfoForm.setValue(
                                                `ShopBasicalInfo.ShopBussinessHours.${index}.BussinessHoursStart`,
                                                ''
                                              )
                                              shopBasicalInfoService.ShopBasicalInfoForm.clearErrors(
                                                `ShopBasicalInfo.ShopBussinessHours.${index}.BussinessHoursStart`
                                              )
                                              shopBasicalInfoService.ShopBasicalInfoForm.setValue(
                                                `ShopBasicalInfo.ShopBussinessHours.${index}.BussinessHoursEnd`,
                                                ''
                                              )
                                              shopBasicalInfoService.ShopBasicalInfoForm.clearErrors(
                                                `ShopBasicalInfo.ShopBussinessHours.${index}.BussinessHoursEnd`
                                              )
                                            }
                                            shopBasicalInfoService.ShopBasicalInfoForm.setValue(
                                              `ShopBasicalInfo.ShopBussinessHours.${index}.IsHoliday`,
                                              v.target.checked
                                            )
                                          }}
                                        />
                                      }
                                    />
                                  </FormControl>
                                )}
                              />
                            </Grid>
                            <Grid item xs={6} md={4}>
                              <Controller
                                name={`ShopBasicalInfo.ShopBussinessHours.${index}.BussinessHoursStart`}
                                {...shopBasicalInfoService.ShopBasicalInfoForm}
                                rules={{
                                  validate: v => {
                                    if (
                                      !shopBasicalInfoService.ShopBasicalInfoForm.getValues(
                                        `ShopBasicalInfo.ShopBussinessHours.${index}.IsHoliday`
                                      ) &&
                                      v == ''
                                    ) {
                                      return t.MESSAGE_REQUIRED_TEXTFIELD
                                    }
                                  }
                                }}
                                render={({ field, fieldState }) => (
                                  <FormControl fullWidth>
                                    <TextField
                                      {...field}
                                      {...shopBasicalInfoService.ShopBasicalInfoForm.register(
                                        `ShopBasicalInfo.ShopBussinessHours.${index}.BussinessHoursStart`
                                      )}
                                      fullWidth
                                      autoFocus={false}
                                      type='time'
                                      disabled={
                                        shopBasicalInfoService.ShopBussinessHoursControlledFields[index].IsHoliday
                                      }
                                      label={t.SCREEN_COL_BUSSINESS_HOUR_TIME_START}
                                      id='ShopBasicalInfo.ShopBussinessHours.${index}.BussinessHoursStart'
                                      required={
                                        !shopBasicalInfoService.ShopBussinessHoursControlledFields[index].IsHoliday
                                      }
                                      error={
                                        !shopBasicalInfoService.ShopBussinessHoursControlledFields[index].IsHoliday &&
                                        fieldState.invalid
                                      }
                                      helperText={fieldState.error?.message}
                                      InputLabelProps={{ shrink: true }}
                                    />
                                  </FormControl>
                                )}
                              />
                            </Grid>
                            <Grid item xs={6} md={4}>
                              <Controller
                                name={`ShopBasicalInfo.ShopBussinessHours.${index}.BussinessHoursEnd`}
                                {...shopBasicalInfoService.ShopBasicalInfoForm}
                                rules={{
                                  validate: (value: string) => {
                                    if (
                                      !shopBasicalInfoService.ShopBasicalInfoForm.getValues(
                                        `ShopBasicalInfo.ShopBussinessHours.${index}.IsHoliday`
                                      ) &&
                                      value == ''
                                    ) {
                                      return t.MESSAGE_REQUIRED_TEXTFIELD
                                    }
                                    if (
                                      value != '' &&
                                      shopBasicalInfoService.ShopBasicalInfoForm.getValues(
                                        `ShopBasicalInfo.ShopBussinessHours.${index}.BussinessHoursStart`
                                      ) != '' &&
                                      value <
                                        shopBasicalInfoService.ShopBasicalInfoForm.getValues(
                                          `ShopBasicalInfo.ShopBussinessHours.${index}.BussinessHoursStart`
                                        )
                                    ) {
                                      return t.MESSAGE_INPUT_START_END_UNMATCH
                                    }
                                  }
                                }}
                                render={({ field, fieldState }) => (
                                  <FormControl fullWidth>
                                    <TextField
                                      {...field}
                                      {...shopBasicalInfoService.ShopBasicalInfoForm.register(
                                        `ShopBasicalInfo.ShopBussinessHours.${index}.BussinessHoursEnd`
                                      )}
                                      fullWidth
                                      autoFocus={false}
                                      type='time'
                                      label={t.SCREEN_COL_BUSSINESS_HOUR_TIME_END}
                                      disabled={
                                        shopBasicalInfoService.ShopBussinessHoursControlledFields[index].IsHoliday
                                      }
                                      id={`ShopBasicalInfo.ShopBussinessHours.${index}.BussinessHoursEnd`}
                                      required={
                                        !shopBasicalInfoService.ShopBussinessHoursControlledFields[index].IsHoliday
                                      }
                                      error={
                                        !shopBasicalInfoService.ShopBussinessHoursControlledFields[index].IsHoliday &&
                                        fieldState.invalid
                                      }
                                      helperText={fieldState.error?.message}
                                      InputLabelProps={{ shrink: true }}
                                    />
                                  </FormControl>
                                )}
                              />
                            </Grid>
                          </Grid>
                        </Grid>
                      </>
                    )
                  })}
                <Grid item xs={12} sx={{ marginTop: '10px' }}>
                  {t.SCREEN_TITLE_SERVICE}
                </Grid>
                {shopBasicalInfoService.ShopServicesControlledFields &&
                  shopBasicalInfoService.ShopServicesControlledFields.map((v, i) => {
                    return (
                      <>
                        <Grid item xs={10} key={`ShopBasicalInfo.ShopServices.${i}`}>
                          <Controller
                            name={`ShopBasicalInfo.ShopServices.${i}.ServiceCd`}
                            {...shopBasicalInfoService.ShopBasicalInfoForm}
                            rules={validationRules.service}
                            render={({ field, fieldState }) => (
                              <FormControl fullWidth error={fieldState.invalid}>
                                <InputLabel id='area-label' shrink={true}>
                                  {t.SCREEN_COL_SERVICE}
                                </InputLabel>
                                <Select
                                  labelId='area-label'
                                  id={`ShopBasicalInfo.ShopServices.${i}.ServiceCd`}
                                  label={t.SCREEN_COL_SERVICE}
                                  notched={true}
                                  MenuProps={{
                                    sx: {
                                      maxHeight: 300
                                    }
                                  }}
                                  name={field.name}
                                  onBlur={field.onBlur}
                                  onChange={field.onChange}
                                  value={field.value}
                                >
                                  {shopBasicalInfoService.serviceCd.map((c, j) => {
                                    return (
                                      <MenuItem
                                        value={String(c.service_cd)}
                                        key={`ShopBasicalInfo.ShopServices.${i}.ServiceCd.${j}`}
                                      >
                                        {c.service_name}
                                      </MenuItem>
                                    )
                                  })}
                                </Select>
                                <FormHelperText>{fieldState.error?.message}</FormHelperText>
                              </FormControl>
                            )}
                          />
                        </Grid>
                        <Grid item xs={2} key={`ShopBasicalInfo.ShopServices.${i}.delete`}>
                          <IconButton
                            aria-label='delete'
                            size='medium'
                            onClick={() => {
                              shopBasicalInfoService.RemoveShopService(i)
                            }}
                          >
                            <GridDeleteIcon fontSize='inherit' />
                          </IconButton>
                        </Grid>
                      </>
                    )
                  })}
                <Grid item xs={12} sx={{ marginBottom: 4 }}>
                  <IconButton
                    aria-label='add'
                    size='medium'
                    onClick={() => {
                      shopBasicalInfoService.AddShopService(props.shopId)
                    }}
                  >
                    <GridAddIcon fontSize='inherit' />
                  </IconButton>
                </Grid>
              </Grid>
            ) : (
              <Stack spacing={3} sx={{ marginBottom: 4 }}>
                <Skeleton variant='rounded' height={56} />
                <Skeleton variant='rounded' height={56} />
                <Skeleton variant='rounded' height={56} />
              </Stack>
            )}
            <Grid>
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
                  <Button type='submit' variant='contained' size='large'>
                    {t.BUTTON_UPDATE}
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </Stack>
          <Backdrop
            sx={{ color: '#fff', zIndex: theme => theme.zIndex.drawer + 1 }}
            open={shopBasicalInfoService.submitLoading}
          >
            <CircularProgress color='inherit' />
          </Backdrop>
          <Snackbar
            open={successOpen}
            onClose={() => {
              setSuccessOpen(false)
            }}
            autoHideDuration={3000}
            message={t.MESSAGE_SUCCESS_SUBMIT}
            anchorOrigin={{ horizontal: 'right', vertical: 'top' }}
          >
            <Alert
              elevation={3}
              variant='filled'
              onClose={() => {
                setSuccessOpen(false)
              }}
              sx={{ width: '100%' }}
              severity={'success'}
            >
              {t.MESSAGE_SUCCESS_SUBMIT}
            </Alert>
          </Snackbar>
        </CardContent>
      </Card>
    </Box>
  )
}

export default ShopBasicalInfoCard
