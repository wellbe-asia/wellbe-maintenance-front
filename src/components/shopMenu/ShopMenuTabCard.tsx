// ** React Imports
import { useState, useEffect, forwardRef } from 'react'
import { Controller, SubmitHandler, UseFormReturn } from 'react-hook-form'
import { useRouter } from 'next/router'

// ** MUI Imports
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Grid from '@mui/material/Grid'
import TextField from '@mui/material/TextField'
import FormControl from '@mui/material/FormControl'
import FormHelperText from '@mui/material/FormHelperText'
import Stack from '@mui/material/Stack'
import DeleteIcon from '@mui/icons-material/Delete'
import AddIcon from '@mui/icons-material/Add'
import MenuItem from '@mui/material/MenuItem'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogTitle from '@mui/material/DialogTitle'
import {
  Alert,
  AlertColor,
  Checkbox,
  FormControlLabel,
  FormGroup,
  IconButton,
  InputLabel,
  Snackbar
} from '@mui/material'
import Select from '@mui/material/Select'
import DragHandleIcon from '@mui/icons-material/DragHandle'
import Divider from '@mui/material/Divider'

import { NumericFormat, NumericFormatProps } from 'react-number-format'

// ** API
import { MenuLabelType } from '@/@core/api/type/cMenuLabel'

// ** ValidationRules
import { ValidationRules } from './validationRule'

// ** hook
import { useLocale } from 'src/@core/hooks/useLocal'

// ** Service
import { ShopMenuFormType } from 'src/service/ShopMenuService'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'
import MenuLabelCdService from '@/service/MenuLabelCdService'
import RecommendLabelCdService from '@/service/RecommendLabelCdService'
import { getDefaultLanguageCd, getLanguageCdWithValue } from '@/configs/locales/locales'
import { ShopMenuType } from '@/@core/api/type/shopMenu'
import MenuAmountLimiMasterService from '@/service/MenuAmountLimiMasterService'

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

type propsType = {
  fields: ShopMenuType[]
  form: UseFormReturn<ShopMenuFormType, any>
  loading: boolean
  index: number
  shopId: string
  basicalCurrencyCd: string
  submit: (languageIndex: number) => Promise<string>
  init: (shopId: string) => void
  append: () => void
  remove: (index: number) => void
  translate: (shopId: string, languageIndex: number) => Promise<string>
}
const ShopMenuCard = (props: propsType) => {
  // ** Hook
  const { t } = useLocale()

  const router = useRouter()

  const validationRules = ValidationRules()

  // ** State
  const [snackbarOpen, setSnackbarOpen] = useState(false)
  const [severity, setSeverity] = useState<AlertColor | undefined>()
  const [message, setMessage] = useState<string>()
  const [translateOpen, setTranslateOpen] = useState(false)

  // ** Service
  const menuLabelCdService = MenuLabelCdService()
  const recommendLabelCdService = RecommendLabelCdService()
  const menuAmountLimitMasterService = MenuAmountLimiMasterService()

  // ** Init screen
  useEffect(() => {
    const varLanguageCd = router.locale ? getLanguageCdWithValue(router.locale) : getDefaultLanguageCd()
    menuLabelCdService.FetchMenuLabelCd(varLanguageCd)
    recommendLabelCdService.FetchRecommendLabelCd(varLanguageCd)
    menuAmountLimitMasterService.FetchMenuAmountLimiMaster(props.basicalCurrencyCd)

    // Only first time
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.locale])

  function handleOnDragEnd(result: any) {
    const f = props.form.getValues(`ShopMenus`)
    const [reorderedItem] = f.splice(result.source.index, 1)
    f.splice(result.destination.index, 0, reorderedItem)

    props.form.setValue(`ShopMenus`, f)
  }

  const onSubmit: SubmitHandler<ShopMenuFormType> = async () => {
    try {
      const message = await props.submit(props.index)
      if (message) {
        setMessage(message)
        setSnackbarOpen(true)
        setSeverity('error')

        return
      }
      props.init(props.shopId)
      setMessage(t.MESSAGE_SUCCESS_SUBMIT)
      setSnackbarOpen(true)
      setSeverity('success')
      setTranslateOpen(true)
    } catch (error) {
      console.error(error)
    } finally {
    }
  }

  const onTranslate = async () => {
    try {
      handleTranslateClose()
      props.translate(props.shopId, props.index)

      setMessage(t.MESSAGE_SUCCESS_TRANSLATE)
      setSnackbarOpen(true)
      setSeverity('info')
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
          <DragDropContext onDragEnd={handleOnDragEnd}>
            <Droppable droppableId='characters'>
              {provided => (
                <Box {...provided.droppableProps} ref={provided.innerRef}>
                  {props.fields.map((field, index) => {
                    return (
                      field.DeleteFlg == false && (
                        <Box key={`ShopMenus.${index}`}>
                          <Draggable key={field.SortOrder} draggableId={field.SortOrder} index={index}>
                            {provided => (
                              <Grid
                                container
                                sx={{ marginBottom: 4 }}
                                spacing={3}
                                ref={provided.innerRef}
                                alignItems='center'
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                              >
                                {field.ShopMenuNames.map((menuName, index2) => {
                                  return index2 == props.index ? (
                                    <Grid item xs={10} key={`ShopMenus.${index}.ShopMenuNames.${props.index}.MenuName`}>
                                      <Controller
                                        name={`ShopMenus.${index}.ShopMenuNames.${props.index}.MenuName`}
                                        {...props.form}
                                        rules={validationRules.menuName}
                                        render={({ field, fieldState }) => (
                                          <FormControl fullWidth>
                                            <TextField
                                              {...field}
                                              {...props.form.register(
                                                `ShopMenus.${index}.ShopMenuNames.${props.index}.MenuName`
                                              )}
                                              fullWidth
                                              type='text'
                                              label={t.SCREEN_COL_SHOP_MENU_TITLE}
                                              id={`ShopMenus.${index}.ShopMenuNames.${props.index}.MenuName`}
                                              required
                                              error={fieldState.invalid}
                                              helperText={fieldState.error?.message}
                                              InputLabelProps={{ shrink: true }}
                                            />
                                          </FormControl>
                                        )}
                                      />
                                    </Grid>
                                  ) : (
                                    <></>
                                  )
                                })}
                                <Grid item xs={1}>
                                  <IconButton
                                    aria-label='delete'
                                    size='medium'
                                    onClick={() => {
                                      props.remove(index)
                                    }}
                                  >
                                    <DeleteIcon fontSize='inherit' />
                                  </IconButton>
                                </Grid>
                                <Grid item xs={1}>
                                  <DragHandleIcon fontSize='inherit' />
                                </Grid>
                                {field.ShopMenuNames.map((menuName, index2) => {
                                  return index2 == props.index ? (
                                    <Grid item xs={10}>
                                      <Controller
                                        name={`ShopMenus.${index}.ShopMenuNames.${props.index}.MenuDescription`}
                                        {...props.form}
                                        rules={validationRules.menuDescription}
                                        render={({ field, fieldState }) => (
                                          <FormControl fullWidth>
                                            <TextField
                                              {...field}
                                              {...props.form.register(
                                                `ShopMenus.${index}.ShopMenuNames.${props.index}.MenuDescription`
                                              )}
                                              fullWidth
                                              type='text'
                                              label={t.SCREEN_COL_SHOP_MENU_DESCRIPTION}
                                              id={`ShopMenus.${index}.ShopMenuNames.${props.index}.MenuDescription`}
                                              required
                                              rows={9}
                                              multiline
                                              error={fieldState.invalid}
                                              helperText={fieldState.error?.message}
                                              InputLabelProps={{ shrink: true }}
                                            />
                                          </FormControl>
                                        )}
                                      />
                                    </Grid>
                                  ) : (
                                    <></>
                                  )
                                })}
                                <Grid item xs={2}></Grid>
                                <Grid item xs={2}>
                                  <Controller
                                    name={`ShopMenus.${index}.TreatmentTime`}
                                    {...props.form}
                                    rules={validationRules.treatmentTime}
                                    render={({ field, fieldState }) => (
                                      <FormControl fullWidth>
                                        <TextField
                                          {...field}
                                          {...props.form.register(`ShopMenus.${index}.TreatmentTime`)}
                                          fullWidth
                                          type='number'
                                          label={t.SCREEN_COL_SHOP_MENU_TREATMENT_TIME}
                                          id={`ShopMenus.${index}.TreatmentTime`}
                                          required
                                          error={fieldState.invalid}
                                          helperText={fieldState.error?.message}
                                          InputLabelProps={{ shrink: true }}
                                        />
                                      </FormControl>
                                    )}
                                  />
                                </Grid>
                                <Grid item xs={2}>
                                  <Controller
                                    name={`ShopMenus.${index}.RequiredTime`}
                                    {...props.form}
                                    rules={validationRules.requiredTime}
                                    render={({ field, fieldState }) => (
                                      <FormControl fullWidth>
                                        <TextField
                                          {...field}
                                          {...props.form.register(`ShopMenus.${index}.RequiredTime`)}
                                          fullWidth
                                          type='number'
                                          label={t.SCREEN_COL_SHOP_MENU_REQUIRED_TIME}
                                          id={`ShopMenus.${index}.RequiredTime`}
                                          required
                                          error={fieldState.invalid}
                                          helperText={fieldState.error?.message}
                                          InputLabelProps={{ shrink: true }}
                                        />
                                      </FormControl>
                                    )}
                                  />
                                </Grid>
                                <Grid item xs={4}>
                                  <Controller
                                    name={`ShopMenus.${index}.Amount`}
                                    {...props.form}
                                    rules={{
                                      max: {
                                        value:
                                          menuAmountLimitMasterService.MenuAmountLimiMaster.length > 0
                                            ? menuAmountLimitMasterService.MenuAmountLimiMaster[0].max_amount
                                            : 99999999999,
                                        message:
                                          t.MESSAGE_AMOUNT_MENU_MAX +
                                          (menuAmountLimitMasterService.MenuAmountLimiMaster.length > 0
                                            ? menuAmountLimitMasterService.MenuAmountLimiMaster[0].max_amount.toLocaleString()
                                            : '99,999,999,999')
                                      },
                                      min: {
                                        value:
                                          menuAmountLimitMasterService.MenuAmountLimiMaster.length > 0
                                            ? menuAmountLimitMasterService.MenuAmountLimiMaster[0].min_amount
                                            : 0,
                                        message:
                                          t.MESSAGE_AMOUNT_MENU_MIN +
                                          (menuAmountLimitMasterService.MenuAmountLimiMaster.length > 0
                                            ? menuAmountLimitMasterService.MenuAmountLimiMaster[0].min_amount.toLocaleString()
                                            : '0')
                                      }
                                    }}
                                    render={({ field, fieldState }) => (
                                      <FormControl fullWidth>
                                        <TextField
                                          {...field}
                                          {...props.form.register(`ShopMenus.${index}.Amount`)}
                                          fullWidth
                                          type='text'
                                          label={t.SCREEN_COL_SHOP_MENU_AMMOUNT}
                                          id={`ShopMenus.${index}.Amount`}
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
                                <Grid item xs={2}>
                                  <Controller
                                    name={`ShopMenus.${index}.CurrencyCdIso`}
                                    {...props.form}
                                    render={({ field }) => <Box>{field.value}</Box>}
                                  />
                                </Grid>
                                <Grid item xs={5}>
                                  <Controller
                                    name={`ShopMenus.${index}.ShopRecommendLabelCds`}
                                    {...props.form}
                                    rules={validationRules.menuLabelCd}
                                    render={({ field, fieldState }) => (
                                      <FormControl fullWidth error={fieldState.invalid}>
                                        <InputLabel id='area-label' shrink={true}>
                                          {t.SCREEN_COL_SHOP_RECOMMEND_LABEL}
                                        </InputLabel>
                                        <Select
                                          labelId='area-label'
                                          id={`ShopMenus.${index}.ShopRecommendLabelCds`}
                                          label={t.SCREEN_COL_SHOP_RECOMMEND_LABEL}
                                          notched={true}
                                          multiple
                                          MenuProps={{
                                            sx: {
                                              maxHeight: 300
                                            }
                                          }}
                                          {...field}
                                        >
                                          {recommendLabelCdService.recommendLabelCd.map(r => {
                                            return (
                                              <MenuItem value={String(r.recommend_label_cd)} key={r.recommend_label_cd}>
                                                {r.recommend_label_name}
                                              </MenuItem>
                                            )
                                          })}
                                        </Select>
                                        <FormHelperText>{fieldState.error?.message}</FormHelperText>
                                      </FormControl>
                                    )}
                                  />
                                </Grid>
                                <Grid item xs={5}>
                                  <Controller
                                    name={`ShopMenus.${index}.ShopMenuLabelCds`}
                                    {...props.form}
                                    rules={validationRules.menuLabelCd}
                                    render={({ field, fieldState }) => (
                                      <FormControl fullWidth error={fieldState.invalid}>
                                        <InputLabel id='area-label' shrink={true}>
                                          {t.SCREEN_COL_SHOP_MENU_LABEL}
                                        </InputLabel>
                                        <Select
                                          labelId='area-label'
                                          id={`ShopMenus.${index}.ShopMenuLabelCds`}
                                          label={t.SCREEN_COL_SHOP_MENU_LABEL}
                                          notched={true}
                                          multiple
                                          MenuProps={{
                                            sx: {
                                              maxHeight: 300
                                            }
                                          }}
                                          {...field}
                                        >
                                          {menuLabelCdService.menuLabelCd.map((m: MenuLabelType) => {
                                            return (
                                              <MenuItem value={String(m.menu_label_cd)} key={m.menu_label_cd}>
                                                {m.menu_label_name}
                                              </MenuItem>
                                            )
                                          })}
                                        </Select>
                                        <FormHelperText>{fieldState.error?.message}</FormHelperText>
                                      </FormControl>
                                    )}
                                  />
                                </Grid>
                                <Grid item xs={5}>
                                  <Controller
                                    name={`ShopMenus.${index}.CanMale`}
                                    {...props.form}
                                    render={({ field, fieldState }) => (
                                      <FormGroup {...field}>
                                        <FormControl fullWidth error={fieldState.invalid}>
                                          <FormControlLabel
                                            label={t.SCREEN_COL_SHOP_MENU_CAN_MALE}
                                            control={
                                              <Checkbox
                                                id={`ShopMenus.${index}.CanMale`}
                                                defaultChecked={field.value}
                                              />
                                            }
                                          />
                                        </FormControl>
                                      </FormGroup>
                                    )}
                                  />
                                </Grid>
                                <Grid item xs={5}>
                                  <Controller
                                    name={`ShopMenus.${index}.CanFemale`}
                                    {...props.form}
                                    render={({ field, fieldState }) => (
                                      <FormGroup {...field}>
                                        <FormControl fullWidth error={fieldState.invalid}>
                                          <FormControlLabel
                                            label={t.SCREEN_COL_SHOP_MENU_CAN_FEMALE}
                                            control={
                                              <Checkbox
                                                id={`ShopMenus.${index}.CanFemale`}
                                                defaultChecked={field.value}
                                              />
                                            }
                                          />
                                        </FormControl>
                                      </FormGroup>
                                    )}
                                  />
                                </Grid>
                                <Grid item xs={10}>
                                  <Divider variant='middle' />
                                </Grid>
                              </Grid>
                            )}
                          </Draggable>
                        </Box>
                      )
                    )
                  })}
                </Box>
              )}
            </Droppable>
          </DragDropContext>
          <Grid item xs={12} sx={{ marginBottom: 4 }}>
            <IconButton
              aria-label='add'
              size='medium'
              onClick={() => {
                props.append()
              }}
            >
              <AddIcon fontSize='inherit' />
            </IconButton>
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
              <Button type='submit' variant='contained' size='large'>
                {t.BUTTON_UPDATE}
              </Button>
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
          </Grid>
        </Grid>
      </Stack>
    </Box>
  )
}

export default ShopMenuCard
