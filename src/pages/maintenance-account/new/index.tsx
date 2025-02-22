// ** React Imports

// ** Component
import { useLocale } from '@/@core/hooks/useLocal'
import { useLocalStorage } from '@/@core/hooks/useLocalStorage'
import { DEFAULT_SESSION_STORAGE, SESSION_STORAGE_KEY_KEYWORD } from '@/@core/utils/constant'
import { getLanguageCdWithValue } from '@/configs/locales/locales'
import AccountGroupCdService from '@/service/AccountGroupCdService'
import MaintenanceAccountService, { MaintenanceAccountInfoType } from '@/service/MaintenanceAccountService'
import { ValidationRules } from '@/validationRules/maintenanceAccount'
import styles from 'styles/signup.module.scss'
import {
  Alert,
  AlertColor,
  Box,
  Button,
  Card,
  CardHeader,
  FormControl,
  FormHelperText,
  Grid,
  MenuItem,
  Select,
  Snackbar,
  Stack,
  TextField
} from '@mui/material'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { Controller, SubmitHandler } from 'react-hook-form'

const SignupPage = () => {
  const { t } = useLocale()
  const [message, setMessage] = useState('')
  const [openSnackbar, setOpenSnackbar] = useState(false)
  const [severity, setSeverity] = useState<AlertColor | undefined>('error')
  const router = useRouter()
  const maintenanceAccountService = MaintenanceAccountService()
  const accountGroupCdService = AccountGroupCdService()
  const token = useLocalStorage(SESSION_STORAGE_KEY_KEYWORD.TOKEN, DEFAULT_SESSION_STORAGE.TOKEN)
  const validationRules = ValidationRules()

  useEffect(() => {
    const languageCd = getLanguageCdWithValue(router.locale || '')
    if (languageCd) {
      accountGroupCdService.FetchAccountGroupCd(languageCd)
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.locale])

  // ** Actions
  const onSubmit: SubmitHandler<MaintenanceAccountInfoType> = async () => {
    let isMounted = true
    try {
      const { message } = await maintenanceAccountService.Submit(token.value)

      if (message) {
        if (isMounted) {
          setSeverity('error')
          setOpenSnackbar(true)
          setMessage(message)
        }

        return
      }
      if (isMounted) {
        router.push('/maintenance-account/')
      }
    } catch (error) {
      console.error(error)
    } finally {
    }

    return () => {
      isMounted = false
    }
  }

  return (
    <Card>
      <CardHeader title={t.SCREEN_TITLE_MAINTENANCE_ACCOUNT} />
      <Box sx={{ padding: 10 }}>
        <Stack
          component='form'
          noValidate
          onSubmit={maintenanceAccountService.MaintenanceAccountForm.handleSubmit(onSubmit)}
        >
          <Grid>
            <Grid container sx={{ marginBottom: 4 }} spacing={4}>
              <Grid item xs={12} sm={12}>
                <span className={styles.form_label}>{t.SCREEN_COL_MAINTENANCE_ACCOUNT_NAME}*</span>
                <Controller
                  name={`MaintenanceAccountType.Name`}
                  {...maintenanceAccountService.MaintenanceAccountForm}
                  rules={validationRules.emailAddress}
                  render={({ field, fieldState }) => (
                    <FormControl fullWidth>
                      <TextField
                        {...field}
                        {...maintenanceAccountService.MaintenanceAccountForm.register(`MaintenanceAccountType.Name`)}
                        fullWidth
                        type='text'
                        size='small'
                        id='name'
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
                <span className={styles.form_label}>{t.SCREEN_COL_MAINTENANCE_ACCOUNT_EMAIL}*</span>
                <Controller
                  name={`MaintenanceAccountType.EmailAddress`}
                  {...maintenanceAccountService.MaintenanceAccountForm}
                  rules={validationRules.emailAddress}
                  render={({ field, fieldState }) => (
                    <FormControl fullWidth>
                      <TextField
                        {...field}
                        {...maintenanceAccountService.MaintenanceAccountForm.register(
                          `MaintenanceAccountType.EmailAddress`
                        )}
                        fullWidth
                        type='text'
                        size='small'
                        id='email_address'
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
                <span className={styles.form_label}>{t.SCREEN_COL_MAINTENANCE_ACCOUNT_ACCOUNT_GROUP} *</span>
                <Controller
                  name={`MaintenanceAccountType.AccountGroupCd`}
                  control={maintenanceAccountService.MaintenanceAccountForm.control}
                  rules={validationRules.accountGroupCd}
                  render={({ field, fieldState }) => (
                    <FormControl fullWidth error={fieldState.invalid}>
                      <Select
                        labelId='area-label'
                        id='account_group_cd'
                        size='small'
                        required
                        notched={true}
                        MenuProps={{
                          sx: {
                            maxHeight: 300
                          }
                        }}
                        {...field}
                      >
                        {accountGroupCdService.accountGroupCd.map(c => {
                          return (
                            <MenuItem value={String(c.account_group_cd)} key={c.account_group_cd}>
                              {c.account_group_name}
                            </MenuItem>
                          )
                        })}
                      </Select>
                      <FormHelperText>{fieldState.error?.message}</FormHelperText>
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
                <Button type='submit' variant='contained' size='large' disabled={maintenanceAccountService.loading}>
                  {t.BUTTON_UPDATE}
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Stack>
        <Snackbar
          anchorOrigin={{ horizontal: 'center', vertical: 'top' }}
          open={openSnackbar}
          autoHideDuration={3000}
          onClose={() => {
            setOpenSnackbar(false)
          }}
        >
          <Alert
            onClose={() => {
              setOpenSnackbar(false)
            }}
            variant='filled'
            severity={severity}
            sx={{ width: '100%', fontSize: '1.2rem' }}
          >
            {message}
          </Alert>
        </Snackbar>
      </Box>
    </Card>
  )
}

export default SignupPage
