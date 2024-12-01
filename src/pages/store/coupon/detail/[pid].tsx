import { useRouter } from 'next/router'
import { ForwardedRef, forwardRef, useEffect, useState } from 'react'
import { Controller, SubmitHandler } from 'react-hook-form'

// hook
import { useLocale } from '@/@core/hooks/useLocal'

// util
import { getLanguageCdWithValue } from '@/configs/locales/locales'

// service
import ShopCouponService, { ShopCouponFormType } from '@/service/ShopCouponService'

// component
import {
  FormControl,
  TextField,
  Grid,
  Stack,
  Card,
  Box,
  CardHeader,
  CardContent,
  Select,
  MenuItem,
  FormHelperText,
  Skeleton,
  Backdrop,
  CircularProgress,
  Snackbar,
  Alert,
  Button,
  Typography,
  AlertColor,
  InputAdornment,
  OutlinedInput,
  FilledInput,
  IconButton,
  Tooltip,
  ImageList,
  ImageListItem,
  Chip
} from '@mui/material'
import ClipBoard from '@mui/icons-material/CopyAll'
import DeleteIcon from '@mui/icons-material/Delete'
import UploadFileIcon from '@mui/icons-material/UploadFile'
import DatePicker from 'react-datepicker'
import ListErrors from '@/@core/components/list-errors'
import { ValidationRules } from '@/validationRules/shopCoupon'
import LanguageCdService from '@/service/LanguageCdService'

// ** Styled Component
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'
import { NumericFormat, NumericFormatProps } from 'react-number-format'
import { sleep } from '@/@core/utils/date'
import { ShopMenuQueryResponseGetType } from '@/@core/api/type/shopMenu'
import { useDropzone } from 'react-dropzone'
import { FileExtendsPreview } from '@/@core/api/type/shopCoupon'

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

const ShopCoupon = () => {
  const { t, locale } = useLocale()
  const router = useRouter()
  const shopCouponService = ShopCouponService()
  const languageCdService = LanguageCdService()

  // ** State
  const [errors, setErrors] = useState<string[]>([])
  const [languageCd, setLanguageCd] = useState(getLanguageCdWithValue(locale || ''))
  const [snackbarOpen, setSnackbarOpen] = useState(false)
  const [severity, setSeverity] = useState<AlertColor | undefined>()
  const [message, setMessage] = useState<string>()
  const [openTips, setOpenTips] = useState(false)

  const CustomInput = forwardRef(({ ...props }: PickerProps, ref: ForwardedRef<HTMLElement>) => {
    return <TextField size='small' inputRef={ref} sx={{ width: { sm: '250px', xs: '170px' } }} {...props} />
  })
  interface PickerProps {
    label?: string
  }

  const { pid, shopid } = router.query
  const [couponCode, setCouponCode] = useState(pid && [pid].flat(1).length > 0 ? [pid].flat(1)[0] : '')
  const [shopId] = useState(shopid && [shopid].flat(1).length > 0 ? [shopid].flat(1)[0] : '')

  const validationRules = ValidationRules()

  useEffect(() => {
    languageCdService.Init()

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    GetInit()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [languageCd])

  const GetInit = async () => {
    let varLanguageCd = languageCd
    let menues = [] as ShopMenuQueryResponseGetType[]
    if (!languageCd) {
      varLanguageCd = getLanguageCdWithValue(locale || '')
    }
    menues = await shopCouponService.GetShopMenu(shopId, getLanguageCdWithValue(locale || ''))

    if (varLanguageCd) {
      if (couponCode && couponCode != '') {
        if (couponCode != 'new') {
          await shopCouponService.InitCoupon(shopId, varLanguageCd, couponCode)
        } else {
          await shopCouponService.InitEmptyCoupon(shopId, varLanguageCd, menues)
          shopCouponService.ShopCouponForm.setValue('ShopCoupon.new_customer', true)
        }
      }
    }
  }

  const onSubmit: SubmitHandler<ShopCouponFormType> = async () => {
    try {
      const res = await shopCouponService.Submit()

      if (res.message != '') {
        setMessage(res.message)
        setSnackbarOpen(true)
        setSeverity('error')

        return
      }
      setSnackbarOpen(true)
      setMessage(t.MESSAGE_SUCCESS_SUBMIT)
      setSeverity('success')
      setCouponCode(res.coupon_code)
      router.push('/coupon')
    } catch (error) {
      console.error(error)
    } finally {
    }
  }

  const onClickHold = async () => {
    const res = await shopCouponService.Hold()
    if (res.message) {
      setMessage(res.message)
      setSnackbarOpen(true)
      setSeverity('error')

      return
    }
    setSnackbarOpen(true)
    setMessage(t.MESSAGE_SUCCESS_SUBMIT)
    setSeverity('success')
    setCouponCode(res.coupon_code)
    router.push('/coupon')
  }

  const { getRootProps, getInputProps, fileRejections } = useDropzone({
    onDrop: (acceptedFiles: File[]) => {
      acceptedFiles.map(file => {
        Object.assign(file, {
          preview: URL.createObjectURL(file)
        })
        shopCouponService.ShopCouponForm.setValue('ShopCoupon.shopCouponImage', {
          ShopCouponId: shopCouponService.ShopCouponForm.getValues('ShopCoupon.shopCouponImage.ShopCouponId'),
          Image: file as FileExtendsPreview
        })
      })
    },
    maxSize: 5242880
  })

  const OnDelete = async () => {
    shopCouponService.ShopCouponForm.setValue('ShopCoupon.shopCouponImage', {
      ShopCouponId: shopCouponService.ShopCouponForm.getValues('ShopCoupon.shopCouponImage.ShopCouponId'),
      Image: undefined,
      ImagePath: ''
    })
  }

  useEffect(() => {
    if (fileRejections.length > 0 && fileRejections[0].errors.length > 0) {
      setMessage(t.SCREEN_COL_SHOP_IMAGE_SIZE)
      setSnackbarOpen(true)
      setSeverity('error')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fileRejections])

  return (
    <>
      <DatePickerWrapper sx={{ '& .react-datepicker-wrapper': { width: 'auto' } }}>
        <Box className='content-center'>
          <Card>
            <CardHeader title={t.SCREEN_TITLE_COUPON} titleTypographyProps={{ variant: 'h6' }} />
            <CardContent>
              <Stack component='form' noValidate onSubmit={shopCouponService.ShopCouponForm.handleSubmit(onSubmit)}>
                <ListErrors errors={errors} setErrors={setErrors} />
                {!shopCouponService.loading ? (
                  <Grid container sx={{ marginBottom: 4 }} spacing={5}>
                    {couponCode != 'new' && (
                      <Grid item xs={12}>
                        <Box sx={{ mb: 1 }}>{t.SCREEN_COL_COUPON_CODE}</Box>
                        <Controller
                          name={`ShopCoupon.coupon_code`}
                          {...shopCouponService.ShopCouponForm}
                          render={({ field, fieldState }) => (
                            <FormControl fullWidth error={fieldState.invalid}>
                              <FilledInput
                                {...field}
                                {...shopCouponService.ShopCouponForm.register(`ShopCoupon.coupon_code`)}
                                fullWidth
                                disabled
                                size='small'
                                type='text'
                                id='ShopCoupon.coupon_code'
                                endAdornment={
                                  <InputAdornment position='end'>
                                    <Tooltip
                                      PopperProps={{
                                        disablePortal: true
                                      }}
                                      onClose={() => {
                                        setOpenTips(false)
                                      }}
                                      open={openTips}
                                      placement='top'
                                      disableFocusListener
                                      disableHoverListener
                                      disableTouchListener
                                      title='Copy!'
                                    >
                                      <IconButton
                                        aria-label='toggle password visibility'
                                        edge='end'
                                        onClick={async () => {
                                          await global.navigator.clipboard.writeText(field.value || '')
                                          setOpenTips(true)
                                          await sleep(500)
                                          setOpenTips(false)
                                        }}
                                      >
                                        <ClipBoard />
                                      </IconButton>
                                    </Tooltip>
                                  </InputAdornment>
                                }
                              />
                            </FormControl>
                          )}
                        />
                      </Grid>
                    )}
                    <Grid item xs={12}>
                      <Box sx={{ mb: 1 }}>{t.SCREEN_COL_LANGUAGE_SELECTER_LANGUAGE}</Box>
                      <Controller
                        name={`ShopCoupon.language_cd`}
                        {...shopCouponService.ShopCouponForm}
                        render={({ field, fieldState }) => (
                          <FormControl fullWidth error={fieldState.invalid}>
                            <Select
                              labelId='area-label'
                              id='ShopCoupon.language_cd'
                              required
                              size='small'
                              notched={true}
                              MenuProps={{
                                sx: {
                                  maxHeight: 300
                                }
                              }}
                              name={field.name}
                              onBlur={field.onBlur}
                              onChange={e => {
                                field.onChange(e)
                                setLanguageCd(e.target.value)
                              }}
                              value={field.value || ''}
                            >
                              {languageCdService.languageCd.map(c => {
                                return (
                                  <MenuItem value={c.LanguageCd} key={c.LanguageCd}>
                                    {c.LanguageName}
                                  </MenuItem>
                                )
                              })}
                            </Select>
                          </FormControl>
                        )}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <Box sx={{ mb: 1 }}>{t.SCREEN_COL_COUPON_TITLE}</Box>
                      <Controller
                        name={`ShopCoupon.coupon_title`}
                        {...shopCouponService.ShopCouponForm}
                        rules={validationRules.couponTitle}
                        render={({ field, fieldState }) => (
                          <FormControl fullWidth error={fieldState.invalid}>
                            <TextField
                              {...field}
                              {...shopCouponService.ShopCouponForm.register(`ShopCoupon.coupon_title`)}
                              fullWidth
                              size='small'
                              type='text'
                              id='ShopCoupon.coupon_title'
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
                      <Box sx={{ mb: 1 }}>{t.SCREEN_COL_COUPON_DESCRIPTION}</Box>
                      <Controller
                        name={`ShopCoupon.coupon_description`}
                        {...shopCouponService.ShopCouponForm}
                        rules={validationRules.couponDescription}
                        render={({ field, fieldState }) => (
                          <FormControl fullWidth error={fieldState.invalid}>
                            <TextField
                              {...field}
                              {...shopCouponService.ShopCouponForm.register(`ShopCoupon.coupon_description`)}
                              fullWidth
                              multiline
                              rows={3}
                              size='small'
                              type='text'
                              id='ShopCoupon.coupon_description'
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
                      <Box sx={{ mb: 1 }}>{t.SCREEN_COL_COUPON_DATE_START}</Box>
                      <Controller
                        name={`ShopCoupon.coupon_start_date_dt`}
                        {...shopCouponService.ShopCouponForm}
                        rules={validationRules.couponStartDateDt}
                        render={({ field, fieldState }) => (
                          <FormControl fullWidth>
                            <DatePicker
                              dateFormat={'yyyy/MM/dd'}
                              customInput={<CustomInput />}
                              selected={field.value}
                              onChange={e => {
                                field.onChange(e)
                              }}
                            />
                            <FormHelperText>
                              <Typography color='error'>{fieldState.error?.message}</Typography>
                            </FormHelperText>
                          </FormControl>
                        )}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <Box sx={{ mb: 1 }}>{t.SCREEN_COL_COUPON_DATE_END}</Box>
                      <Controller
                        name={`ShopCoupon.coupon_end_date_dt`}
                        {...shopCouponService.ShopCouponForm}
                        render={({ field, fieldState }) => (
                          <FormControl fullWidth>
                            <DatePicker
                              dateFormat={'yyyy/MM/dd'}
                              customInput={<CustomInput />}
                              selected={field.value}
                              onChange={e => {
                                field.onChange(e)
                              }}
                            />
                            <FormHelperText>
                              <Typography color='error'>{fieldState.error?.message}</Typography>
                            </FormHelperText>
                          </FormControl>
                        )}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      {t.SCREEN_COL_COUPON_AMOUNT_OR_RATE}
                    </Grid>
                    <Grid item md={6} xs={12}>
                      <Box sx={{ mb: 1 }}>{t.SCREEN_COL_COUPON_AMOUNT}</Box>
                      <Controller
                        name={`ShopCoupon.coupon_amount`}
                        {...shopCouponService.ShopCouponForm}
                        render={({ field, fieldState }) => (
                          <FormControl fullWidth>
                            <TextField
                              {...field}
                              {...shopCouponService.ShopCouponForm.register(`ShopCoupon.coupon_amount`)}
                              fullWidth
                              type='text'
                              size='small'
                              id={`ShopCoupon.coupon_amount`}
                              required
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
                    <Grid item md={6} xs={12}>
                      <Box sx={{ mb: 1 }}>{t.SCREEN_COL_COUPON_RATE}</Box>
                      <Controller
                        name={`ShopCoupon.coupon_rate_100`}
                        {...shopCouponService.ShopCouponForm}
                        rules={validationRules.couponRate}
                        render={({ field, fieldState }) => (
                          <FormControl fullWidth error={fieldState.invalid}>
                            <OutlinedInput
                              {...field}
                              {...shopCouponService.ShopCouponForm.register(`ShopCoupon.coupon_rate_100`)}
                              endAdornment={<InputAdornment position='end'>%</InputAdornment>}
                              fullWidth
                              size='small'
                              type='number'
                              id='ShopCoupon.coupon_rate_100'
                              required
                              error={fieldState.invalid}
                            />
                            <FormHelperText id='filled-weight-helper-text'>{fieldState.error?.message}</FormHelperText>
                          </FormControl>
                        )}
                      />
                    </Grid>
                    {/* <Grid item xs={12}>
                      <Box sx={{ mb: 1 }}>{'クーポン適用対象'}</Box>
                    </Grid>
                    <Grid item md={6} xs={6}>
                      <Controller
                        name={`ShopCoupon.new_customer`}
                        defaultValue={false}
                        {...shopCouponService.ShopCouponForm}
                        render={({ field, fieldState }) => (
                          <FormControl fullWidth error={fieldState.invalid}>
                            <FormControlLabel
                              control={<Checkbox name='check' />}
                              label={'新規顧客'}
                              checked={field.value}
                              onChange={field.onChange}
                            />
                          </FormControl>
                        )}
                      />
                    </Grid>
                    <Grid item md={6} xs={6}>
                      <Controller
                        name={`ShopCoupon.repeat_customer`}
                        defaultValue={false}
                        {...shopCouponService.ShopCouponForm}
                        render={({ field, fieldState }) => (
                          <FormControl fullWidth error={fieldState.invalid}>
                            <FormControlLabel
                              control={<Checkbox name='check' />}
                              label={'既存顧客'}
                              checked={field.value}
                              onChange={field.onChange}
                            />
                          </FormControl>
                        )}
                      />
                    </Grid> */}
                    <Grid item xs={12}>
                      <Box sx={{ mb: 1 }}>{t.SCREEN_COL_COUPON_MENU}</Box>
                      <Controller
                        name={`ShopCoupon.shop_coupon_menues`}
                        {...shopCouponService.ShopCouponForm}
                        render={({ field, fieldState }) => (
                          <FormControl fullWidth error={fieldState.invalid}>
                            <Select
                              labelId='ShopCoupon.shop_coupon_menues'
                              id={`ShopCoupon.shop_coupon_menues`}
                              notched={true}
                              size='small'
                              multiple
                              MenuProps={{
                                sx: {
                                  maxHeight: 300
                                }
                              }}
                              name={field.name}
                              onBlur={field.onBlur}
                              onChange={e => {
                                field.onChange(e)
                              }}
                              value={field.value || []}
                            >
                              {shopCouponService.shopMenues.map(m => {
                                return (
                                  <MenuItem value={String(m.id)} key={m.id}>
                                    {m.menu_name}
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
                      <Box sx={{ mb: 1 }}>{t.SCREEN_COL_COUPON_IMAGE}</Box>
                      <Controller
                        name={`ShopCoupon.shopCouponImage`}
                        {...shopCouponService.ShopCouponForm}
                        render={({ field, fieldState }) => (
                          <FormControl fullWidth error={fieldState.invalid}>
                            <>
                              <ImageList cols={20} sx={{ width: '90%' }}>
                                <ImageListItem sx={{ width: 200 }}>
                                  <Grid container spacing={5}>
                                    <Grid item xs={6}>
                                      <Grid container spacing={2}>
                                        <Grid item xs={12}>
                                          {field.value && (field.value.ImagePath || field.value.Image) ? (
                                            field.value.ImagePath && field.value.ImagePath != '' ? (
                                              <>
                                                <img
                                                  src={`${field.value.ImagePath}`}
                                                  alt={''}
                                                  loading='lazy'
                                                  style={{ width: 200, height: 200, position: 'relative' }}
                                                />
                                                <Chip
                                                  color='secondary'
                                                  label={t.BUTTON_DELETE}
                                                  deleteIcon={<DeleteIcon />}
                                                  size='small'
                                                  onDelete={() => OnDelete()}
                                                  onClick={() => OnDelete()}
                                                  sx={{ position: 'absolute', zIndex: 999, top: 3, right: 2 }}
                                                />
                                              </>
                                            ) : (
                                              field.value.Image && (
                                                <>
                                                  <img
                                                    src={URL.createObjectURL(field.value.Image as FileExtendsPreview)}
                                                    onLoad={() => {
                                                      URL.revokeObjectURL(
                                                        field.value && field.value.Image?.preview
                                                          ? field.value.Image?.preview
                                                          : ''
                                                      )
                                                    }}
                                                    alt=''
                                                    loading='lazy'
                                                    key={field.value.ShopCouponId}
                                                    style={{ width: 200, height: 200, position: 'relative' }}
                                                  />
                                                  <Chip
                                                    color='secondary'
                                                    label={t.BUTTON_DELETE}
                                                    deleteIcon={<DeleteIcon />}
                                                    size='small'
                                                    onDelete={() => OnDelete()}
                                                    onClick={() => OnDelete()}
                                                    sx={{ position: 'absolute', zIndex: 999, top: 3, right: 2 }}
                                                  />
                                                </>
                                              )
                                            )
                                          ) : (
                                            <ImageListItem sx={{ width: 200 }}>
                                              <Box
                                                component='span'
                                                sx={{
                                                  p: 2,
                                                  border: '2px dashed',
                                                  borderColor: 'grey.400',
                                                  display: 'flex',
                                                  height: 200,
                                                  alignItems: 'center',
                                                  justifyContent: 'center',
                                                  marginLeft: 2
                                                }}
                                                className='content-center'
                                                {...getRootProps()}
                                              >
                                                <input {...getInputProps()} />
                                                <Grid container>
                                                  <Grid item xs={12}>
                                                    <Box sx={{ width: '100%', alignItems: 'center' }}>
                                                      <UploadFileIcon
                                                        fontSize='large'
                                                        color='disabled'
                                                        sx={{ width: '100%', alignItems: 'center' }}
                                                      />
                                                    </Box>
                                                  </Grid>
                                                  <Grid item xs={12}>
                                                    <Grid container alignItems='center' justifyContent='center'>
                                                      <Typography sx={{ alignContent: 'center' }} fontSize='medium'>
                                                        {t.SCREEN_COL_SHOP_IMAGE_SIZE}
                                                      </Typography>
                                                    </Grid>
                                                  </Grid>
                                                </Grid>
                                              </Box>
                                            </ImageListItem>
                                          )}
                                        </Grid>
                                      </Grid>
                                    </Grid>
                                  </Grid>
                                </ImageListItem>
                              </ImageList>
                              <FormHelperText>{fieldState.error?.message}</FormHelperText>
                            </>
                          </FormControl>
                        )}
                      />
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
                      {couponCode != 'new' && (
                        <Button
                          onClick={onClickHold}
                          color='secondary'
                          variant='contained'
                          size='large'
                          sx={{ ml: '10px' }}
                        >
                          {t.SCREEN_COL_COUPON_STOP}
                        </Button>
                      )}
                      <Button type='submit' variant='contained' size='large'>
                        {t.BUTTON_UPDATE}
                      </Button>
                    </Box>
                  </Grid>
                </Grid>
              </Stack>
              <Backdrop
                sx={{ color: '#fff', zIndex: 999999 }}
                open={shopCouponService.submitLoading || shopCouponService.loading}
              >
                <CircularProgress color='inherit' />
              </Backdrop>
              <Snackbar
                anchorOrigin={{ horizontal: 'center', vertical: 'top' }}
                open={snackbarOpen}
                autoHideDuration={3000}
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
                  sx={{ width: '100%', fontSize: '1.5rem', color: '#fff' }}
                >
                  <Typography sx={{ width: '100%', color: '#fff' }} variant='subtitle1'>
                    {message}
                  </Typography>
                </Alert>
              </Snackbar>
            </CardContent>
          </Card>
        </Box>
      </DatePickerWrapper>
    </>
  )
}

export default ShopCoupon
