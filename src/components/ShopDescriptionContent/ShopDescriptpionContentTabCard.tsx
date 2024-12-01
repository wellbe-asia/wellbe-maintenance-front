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
import { ShopDescriptionContentFormType, ShopDescriptionContentsType } from '@/service/ShopDescriptionContentService'

// Component
import ShopImageCard from './ShopImageCard'
import ShopContentImageCard from './ShopContentImageCard'
import { Alert, AlertColor, Snackbar } from '@mui/material'

// ** API
import { LanguageType } from '@/@core/api/type/cLanguage'
import { ShopImageType } from '@/@core/api/type/shopImage'
import { ShopContentImageType } from '@/@core/api/type/shopContentImage'

type propsType = {
  fields: ShopDescriptionContentsType[]
  form: UseFormReturn<ShopDescriptionContentFormType, any>
  loading: boolean
  languageCds: LanguageType[]
  shopId: string
  index: number
  SetAddShopImage: (languageCd: string, func: (image: ShopImageType) => void) => void
  AddShopImage: (excludeLanguageCd: string, shopImage: ShopImageType) => void
  SetRemoveShopImage: (languageCd: string, func: (index: number) => void) => void
  RemoveShopImage: (excludeLanguageCd: string, index: number) => void
  SetAddShopContentImage: (languageCd: string, func: (image: ShopContentImageType) => void) => void
  AddShopContentImage: (excludeLanguageCd: string, shopImage: ShopContentImageType) => void
  SetRemoveShopContentImage: (languageCd: string, func: (index: number) => void) => void
  RemoveShopContentImage: (excludeLanguageCd: string, index: number) => void
  ClearAddShopContentImage: () => void
  ClearRemoveShopContentImage: () => void
  ClearAddShopImage: () => void
  ClearRemoveShopImage: () => void
  submit: (languageIndex: number) => Promise<{
    message: string
    trace: 'shopDescription' | 'shopImage' | 'shopContent' | 'shopContentImage' | null
  }>
  init: (shopId: string) => void
  translate: (shopId: string, languageIndex: number) => Promise<string>
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
      const res = await props.submit(props.index)

      if (res.message != '') {
        setSnackbarOpen(true)
        setMessage(res.message)
        setSeverity('error')

        return
      }
      setSnackbarOpen(true)
      setMessage(t.MESSAGE_SUCCESS_SUBMIT)
      setSeverity('success')
      props.ClearAddShopContentImage()
      props.ClearRemoveShopContentImage()
      props.ClearAddShopImage()
      props.ClearRemoveShopImage()
      props.init(props.shopId)
      setTranslateOpen(true)
    } catch (error) {
      console.error(error)
    } finally {
    }
  }

  const onTranslate = async () => {
    try {
      handleTranslateClose()
      const message = await props.translate(props.shopId, props.index)
      if (message) {
        setMessage(message)
        setSnackbarOpen(true)
        setSeverity('error')

        return
      }
      props.init(props.shopId)
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
          {props.fields.map((v, i) => {
            return props.languageCds &&
              props.languageCds.length > props.index &&
              v.LanguageCd == props.languageCds[props.index].LanguageCd &&
              props.loading == false ? (
              <>
                <Grid container spacing={3} key={`shop-description-${i}`}>
                  <Grid item xs={12}>
                    <Controller
                      name={`ShopDescriptionContents.${i}.ShopDescription.ShopName`}
                      {...props.form}
                      rules={validationRules.shopName}
                      render={({ field, fieldState }) => (
                        <FormControl fullWidth>
                          <TextField
                            {...field}
                            {...props.form.register(`ShopDescriptionContents.${i}.ShopDescription.ShopName`)}
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
                      index={i}
                      shopId={props.shopId}
                      languageCds={props.languageCds}
                      SetAddShopImage={props.SetAddShopImage}
                      AddShopImage={props.AddShopImage}
                      SetRemoveShopImage={props.SetRemoveShopImage}
                      RemoveShopImage={props.RemoveShopImage}
                    />
                  </Grid>
                  <Grid item xs={12} sx={{ marginTop: '10px' }}>
                    {t.SCREEN_TITLE_CONTENT}
                  </Grid>
                  {v.ShopContents.map((d, j) => {
                    return (
                      <>
                        <Grid item xs={12} key={`ShopDescriptionContents-ShopContent-${i}`}>
                          <Controller
                            name={`ShopDescriptionContents.${i}.ShopContents.${j}.ContentTitle`}
                            {...props.form}
                            rules={validationRules.contentTitle}
                            render={({ field, fieldState }) => (
                              <FormControl fullWidth>
                                <TextField
                                  {...field}
                                  {...props.form.register(
                                    `ShopDescriptionContents.${i}.ShopContents.${j}.ContentTitle`
                                  )}
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
                            name={`ShopDescriptionContents.${i}.ShopContents.${j}.ContentBody`}
                            {...props.form}
                            rules={validationRules.contentBody}
                            render={({ field, fieldState }) => (
                              <FormControl fullWidth>
                                <TextField
                                  {...field}
                                  {...props.form.register(`ShopDescriptionContents.${i}.ShopContents.${j}.ContentBody`)}
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
                        <Grid item xs={12}>
                          <ShopContentImageCard
                            form={props.form}
                            control={props.form.control}
                            contentIndex={j}
                            languageIndex={i}
                            languageCds={props.languageCds}
                            SetAddShopContentImage={props.SetAddShopContentImage}
                            AddShopContentImage={props.AddShopContentImage}
                            SetRemoveShopContentImage={props.SetRemoveShopContentImage}
                            RemoveShopContentImage={props.RemoveShopContentImage}
                          />
                        </Grid>
                      </>
                    )
                  })}
                </Grid>
              </>
            ) : (
              <></>
            )
          })}

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
              sx={{ width: '100%', fontSize: '1.5rem', color: '#fff' }}
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
