// ** React Imports
import { useState } from 'react'
import { Controller, SubmitHandler, UseFormReturn } from 'react-hook-form'

// ** MUI Imports
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Grid from '@mui/material/Grid'
import TextField from '@mui/material/TextField'
import FormControl from '@mui/material/FormControl'
import Stack from '@mui/material/Stack'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogTitle from '@mui/material/DialogTitle'

// ** ValidationRules
import { ValidationRules } from './validationRule'

// ** hook
import { useLocale } from 'src/@core/hooks/useLocal'

// ** Service
import { ShopDescriptionContentFormType } from '@/service/ShopDescriptionContentService'

// Component
import ShopImageCard from './ShopImageCard'
import { Alert, AlertColor, FormHelperText, MenuItem, Select, Snackbar } from '@mui/material'
import { LanguageType } from '@/@core/api/type/cLanguage'
import { ShopImageType } from '@/@core/api/type/shopImage'

type propsType = {
  form: UseFormReturn<ShopDescriptionContentFormType, any>
  loading: boolean
  shopId: string
  languageCd: string
  onChangeLanguageCd: (languageCd: string) => void
  languageCds: LanguageType[]
  submit: () => Promise<{
    message: string
    trace: 'shopDescription' | 'shopImage' | 'shopContent' | 'shopContentImage' | null
  }>
  init: (shopId: string, languageCd: string) => void
  translate: (shopId: string, languageCd: string) => Promise<string>
  shopImages: ShopImageType[]
  AddShopImage: (image: ShopImageType) => void
  RemoveShopImage: (index: number) => void
}
const ShopDescriptionContentTabCard = (props: propsType) => {
  // ** Hook
  const { t } = useLocale()

  const validationRules = ValidationRules()

  const [snackbarOpen, setSnackbarOpen] = useState(false)
  const [severity, setSeverity] = useState<AlertColor | undefined>()
  const [message, setMessage] = useState<string>()
  const [translateOpen, setTranslateOpen] = useState(false)

  const onSubmit: SubmitHandler<ShopDescriptionContentFormType> = async () => {
    try {
      const res = await props.submit()

      if (res.message != '') {
        setSnackbarOpen(true)
        setMessage(res.message)
        setSeverity('error')

        return
      }
      setSnackbarOpen(true)
      setMessage(t.MESSAGE_SUCCESS_SUBMIT)
      setSeverity('success')
      props.init(props.shopId, props.languageCd)
      setTranslateOpen(true)
    } catch (error) {
      console.error(error)
    } finally {
    }
  }

  const onTranslate = async () => {
    try {
      handleTranslateClose()
      const message = await props.translate(props.shopId, props.languageCd)
      if (message) {
        setMessage(message)
        setSnackbarOpen(true)
        setSeverity('error')

        return
      }
      props.init(props.shopId, props.languageCd)
      setMessage(t.MESSAGE_SUCCESS_TRANSLATE)
      setSnackbarOpen(true)
      setSeverity('success')
    } catch (error) {
      console.error(error)
    } finally {
    }
  }

  const handleTranslateClose = () => {
    setTranslateOpen(false)
  }

  return (
    <Box className='content-center'>
      <Stack component='form' noValidate onSubmit={props.form.handleSubmit(onSubmit)}>
        <Grid>
          <Grid container spacing={3} key={`shop-description`}>
            <Grid item xs={12}>
              <Controller
                name={`ShopDescriptionContent.ShopDescription.LanguageCd`}
                {...props.form}
                rules={validationRules.languageCd}
                render={({ field, fieldState }) => (
                  <FormControl fullWidth error={fieldState.invalid}>
                    <Select
                      {...field}
                      size='small'
                      labelId='area-label'
                      id='ShopDescriptionContent.ShopDescription.LanguageCd'
                      required
                      notched={true}
                      MenuProps={{
                        sx: {
                          maxHeight: 300
                        }
                      }}
                      onBlur={field.onBlur}
                      onChange={e => {
                        props.onChangeLanguageCd(e.target.value)
                        field.onChange(e)
                      }}
                      value={props.languageCd}
                    >
                      {props.languageCds.map((c, j) => {
                        return (
                          <MenuItem value={c.LanguageCd} key={`LanguageCd.${j}`}>
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
            <Grid item xs={12}>
              <Controller
                name={`ShopDescriptionContent.ShopDescription.ShopName`}
                {...props.form}
                rules={validationRules.shopName}
                render={({ field, fieldState }) => (
                  <FormControl fullWidth>
                    <TextField
                      {...field}
                      {...props.form.register(`ShopDescriptionContent.ShopDescription.ShopName`)}
                      fullWidth
                      autoFocus
                      type='text'
                      label={t.SCREEN_COL_SHOP_DESCRIPTION_SHOP_MENU}
                      id='shop-contact-card-shopEmailAddress'
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
              <ShopImageCard
                control={props.form.control}
                form={props.form}
                shopImages={props.shopImages}
                AddShopImage={props.AddShopImage}
                RemoveShopImage={props.RemoveShopImage}
                shopId={props.shopId}
              />
            </Grid>
            <Grid item xs={12} sx={{ marginTop: '10px' }}>
              {t.SCREEN_TITLE_CONTENT}
            </Grid>
            <Grid item xs={12} key={`ShopDescriptionContents-ShopContent`}>
              <Controller
                name={`ShopDescriptionContent.ShopContents.ContentTitle`}
                {...props.form}
                rules={validationRules.contentTitle}
                render={({ field, fieldState }) => (
                  <FormControl fullWidth>
                    <TextField
                      {...field}
                      {...props.form.register(`ShopDescriptionContent.ShopContents.ContentTitle`)}
                      fullWidth
                      type='text'
                      label={t.SCREEN_COL_SHOP_CONTENT_TITLE}
                      id='shop-contact-card-contentTitle'
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
                name={`ShopDescriptionContent.ShopContents.ContentBody`}
                {...props.form}
                rules={validationRules.contentBody}
                render={({ field, fieldState }) => (
                  <FormControl fullWidth>
                    <TextField
                      {...field}
                      {...props.form.register(`ShopDescriptionContent.ShopContents.ContentBody`)}
                      fullWidth
                      type='text'
                      label={t.SCREEN_COL_SHOP_CONTENT_BODY}
                      id='shop-contact-card-contentBody'
                      multiline
                      rows={9}
                      required
                      error={fieldState.invalid}
                      helperText={fieldState.error?.message}
                      InputLabelProps={{ shrink: true }}
                    />
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
                borderRadius: 1
              }}
            >
              <Button type='submit' variant='contained' size='large'>
                {t.BUTTON_UPDATE}
              </Button>
            </Box>
          </Grid>
        </Grid>
        <Box>
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
              sx={{ width: '100%', fontSize: '1.2rem', color: '#fff' }}
            >
              {message}
            </Alert>
          </Snackbar>
          <Dialog
            open={translateOpen}
            onClose={handleTranslateClose}
            aria-labelledby='alert-dialog-title'
            aria-describedby='alert-dialog-description'
          >
            <DialogTitle id='alert-dialog-title'>{t.SCREEN_CONFIRM_TRANSLATE_TITLE}</DialogTitle>
            <DialogContent>
              <DialogContentText id='alert-dialog-description'>
                {t.SCREEN_CONFIRM_TRANSLATE_BODY1}
                <br />
                {t.SCREEN_CONFIRM_TRANSLATE_BODY2}
                <br />
                {t.SCREEN_CONFIRM_TRANSLATE_BODY3}
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleTranslateClose} color='secondary'>
                {t.BUTTON_NO}
              </Button>
              <Button onClick={onTranslate} autoFocus>
                {t.BUTTON_YES}
              </Button>
            </DialogActions>
          </Dialog>
        </Box>
      </Stack>
    </Box>
  )
}

export default ShopDescriptionContentTabCard
