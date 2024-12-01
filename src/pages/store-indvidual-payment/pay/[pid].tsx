import { ForwardedRef, forwardRef, useState } from 'react'
import { useForm } from 'react-hook-form'

// ** MUI Imports
import {
  Box,
  Container,
  TextField,
  Grid,
  Button,
  FormControl,
  Snackbar,
  Alert,
  AlertColor,
  FormHelperText,
  Typography
} from '@mui/material'

// ** css
import styles from 'styles/signup.module.scss'

// ** hook
import { useLocale } from 'src/@core/hooks/useLocal'
import DatePicker from 'react-datepicker'

import { Stack } from '@mui/system'
import { Controller } from 'react-hook-form'
import { ValidationRules } from '@/validationRules/indvidualPayment'
import { useRouter } from 'next/router'
import PayoutService from '@/service/PayoutService'
import { dateFormatApi, getAgoDateFromCurrentDate, getCurrentDate } from '@/@core/utils/date'

// ** Types
import { DateType } from 'src/types/forms/reactDatepickerTypes'

// ** Styled Component
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'

type paymentForm = {
  closingDate: DateType
  paymentDate: DateType
}
const CustomInput = forwardRef(({ ...props }: PickerProps, ref: ForwardedRef<HTMLElement>) => {
  return <TextField size='small' inputRef={ref} sx={{ width: { sm: '250px', xs: '170px' } }} {...props} />
})
interface PickerProps {
  label?: string
}

export default function AccountSettings() {
  const { t } = useLocale()
  const router = useRouter()
  const { pid } = router.query
  const shopId = pid && [pid].flat(1).length > 0 ? [pid].flat(1)[0] : ''

  const Form = useForm<paymentForm>({
    mode: 'onChange',
    defaultValues: { closingDate: getAgoDateFromCurrentDate(5), paymentDate: getCurrentDate() }
  })

  const [openError, setOpenError] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [severity, setSeverity] = useState<AlertColor | undefined>('error')
  const [loading, setLoading] = useState(false)

  const validationRule = ValidationRules()

  // service
  const payoutService = PayoutService()

  const onSubmit = async () => {
    try {
      setLoading(true)
      const f = Form.getValues()
      if (f.closingDate && f.paymentDate) {
        const payoutDateApi = dateFormatApi(f.closingDate)
        const closingDateApi = dateFormatApi(f.paymentDate)
        const res = await payoutService.CreatePayout(shopId, payoutDateApi, closingDateApi)
        if (res.message != undefined && res.message != '') {
          setSeverity('error')
          setErrorMessage(res.message)
          setOpenError(true)

          return
        }

        setSeverity('success')
        setErrorMessage(t.MESSAGE_SUCCESS_SUBMIT)
        setOpenError(true)
      }

      router.push('/payout')
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }
  const handleCloseSnackbar = () => {
    setOpenError(false)
  }

  return (
    <Box>
      <DatePickerWrapper sx={{ '& .react-datepicker-wrapper': { width: 'auto' } }}>
        <Stack component='form' noValidate onSubmit={Form.handleSubmit(onSubmit)}>
          <Box className={styles.signup_box}>
            <Box className={styles.signup_box_inner}>
              <Box className={styles.signup_head}>
                <h2>{t.SCREEN_TITLE_SHOP_INDVIDUAL_PAYMENT}</h2>
              </Box>
              <Box className={styles.signup_inner}>
                <Container maxWidth='sm' sx={{ pt: 5, pb: 5 }}>
                  <Grid container sx={{ marginBottom: 4 }} spacing={5}>
                    <Grid item xs={12}>
                      <span className={styles.form_label}>{t.SCREEN_COL_SHOP_INDVIDUAL_PAYMENT_CLOSING_DATE}*</span>
                      <Controller
                        control={Form.control}
                        name={`closingDate`}
                        rules={validationRule.closingDate}
                        render={({ field, fieldState }) => (
                          <FormControl fullWidth>
                            <DatePicker
                              dateFormat={'yyyy/MM/dd'}
                              customInput={<CustomInput />}
                              selected={field.value}
                              onChange={e => {
                                Form.setValue('closingDate', e)
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
                      <span className={styles.form_label}>{t.SCREEN_COL_SHOP_INDVIDUAL_PAYMENT_PAYMENT_DATE}*</span>
                      <Controller
                        control={Form.control}
                        name={`paymentDate`}
                        rules={validationRule.closingDate}
                        render={({ field, fieldState }) => (
                          <FormControl fullWidth>
                            <DatePicker
                              dateFormat={'yyyy/MM/dd'}
                              customInput={<CustomInput />}
                              selected={field.value}
                              onChange={e => {
                                Form.setValue('paymentDate', e)
                              }}
                            />
                            <FormHelperText>
                              <Typography color='error'>{fieldState.error?.message}</Typography>
                            </FormHelperText>
                          </FormControl>
                        )}
                      />
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
                      <Button type='submit' variant='contained' disabled={loading} size='medium'>
                        {t.BUTTON_PAY}
                      </Button>
                    </Box>
                  </Grid>
                </Container>
              </Box>
            </Box>
          </Box>
        </Stack>
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
      </DatePickerWrapper>
    </Box>
  )
}
