import { useRouter } from 'next/router'
import { ForwardedRef, forwardRef, useEffect, useState } from 'react'
import { Controller, SubmitHandler } from 'react-hook-form'

// hook
import { useLocale } from '@/@core/hooks/useLocal'

// ** Components
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeRaw from 'rehype-raw'

// ** css
import styles from 'styles/contents.module.scss'

// util
import { getLanguageCdWithValue } from '@/configs/locales/locales'

// service
import ContentsService, { ContentsFormType } from '@/service/ContentsService'

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
  Chip,
  ImageList,
  ImageListItem,
  OutlinedInput,
  InputAdornment,
  IconButton,
  Tooltip,
  AlertColor,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Divider,
  FormControlLabel,
  Checkbox
} from '@mui/material'
import DatePicker from 'react-datepicker'
import UploadFileIcon from '@mui/icons-material/UploadFile'
import ContentCopyIcon from '@mui/icons-material/ContentCopy'
import DeleteIcon from '@mui/icons-material/Delete'
import ListErrors from '@/@core/components/list-errors'
import { ValidationRules } from '@/validationRules/contents'
import dynamic from 'next/dynamic'
import { useDropzone } from 'react-dropzone'
import { FileExtendsPreview } from '@/@core/api/type/contentsImage'
import ContentsLabelCdService from '@/service/ContentsLabelCdService'
import LanguageCdService from '@/service/LanguageCdService'

// ** Styled Component
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'
import ContentsAuthorService from '@/service/ContentsAuthorService'

const MdEditor = dynamic(import('@/components/MdEditor'), {
  ssr: false,
  loading: () => <div>now loading</div>
})

const Contents = () => {
  const { t, locale } = useLocale()
  const router = useRouter()
  const contentsService = ContentsService()
  const contentsLabelCdService = ContentsLabelCdService()
  const languageCdService = LanguageCdService()
  const contentsAuthorService = ContentsAuthorService()

  // ** State
  const [errors, setErrors] = useState<string[]>([])
  const [languageCd, setLanguageCd] = useState('')
  const [openTip, setOpenTip] = useState<boolean>(false)
  const [translateOpen, setTranslateOpen] = useState(false)
  const [snackbarOpen, setSnackbarOpen] = useState(false)
  const [severity, setSeverity] = useState<AlertColor | undefined>()
  const [message, setMessage] = useState<string>()

  const handleCloseTip = (): void => {
    setOpenTip(false)
  }
  const CustomInput = forwardRef(({ ...props }: PickerProps, ref: ForwardedRef<HTMLElement>) => {
    return <TextField size='small' inputRef={ref} sx={{ width: { sm: '250px', xs: '170px' } }} {...props} />
  })
  interface PickerProps {
    label?: string
  }

  const { pid } = router.query
  const [contentsId, setContentsId] = useState(pid && [pid].flat(1).length > 0 ? [pid].flat(1)[0] : '')

  const validationRules = ValidationRules()

  useEffect(() => {
    const varLanguageCd = getLanguageCdWithValue(locale || '')
    if (varLanguageCd) {
      setLanguageCd(varLanguageCd)
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    languageCdService.Init()
    if (languageCd) {
      contentsLabelCdService.FetchContentsLabelCd(languageCd)
      contentsAuthorService.FetchContentsAuthor(languageCd)
      if (contentsId && contentsId != '' && contentsId != 'new') {
        contentsService.Init(contentsId, languageCd)
      }
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [languageCd])

  const onSubmit: SubmitHandler<ContentsFormType> = async () => {
    try {
      const res = await contentsService.Submit()

      if (res.message != '') {
        setErrors([res.message])

        return
      }
      setSnackbarOpen(true)
      setMessage(t.MESSAGE_SUCCESS_SUBMIT)
      setSeverity('success')
      setContentsId(res.contentsId)
      contentsService.Init(res.contentsId, languageCd)
      setTranslateOpen(true)
    } catch (error) {
      console.error(error)
    } finally {
    }
  }

  const onTranslate = async () => {
    try {
      handleTranslateClose()
      const message = await contentsService.Translate(contentsId, languageCd)
      if (message) {
        setMessage(message)
        setSnackbarOpen(true)
        setSeverity('error')

        return
      }
      contentsService.Init(contentsId, languageCd)
      setMessage(t.MESSAGE_SUCCESS_TRANSLATE)
      setSnackbarOpen(true)
      setSeverity('success')
    } catch (error) {
      console.error(error)
    } finally {
    }
  }

  const onClickPublish = async () => {
    const message = await contentsService.Publish(contentsId)
    if (message) {
      setMessage(message)
      setSnackbarOpen(true)
      setSeverity('error')

      return
    }
    setMessage(t.MESSAGE_PUBLISHED)
    setSnackbarOpen(true)
    setSeverity('success')
  }

  const onClickHold = async () => {
    const message = await contentsService.Hold(contentsId)
    if (message) {
      setMessage(message)
      setSnackbarOpen(true)
      setSeverity('error')

      return
    }
    setMessage(t.MESSAGE_PUBLISHED)
    setSnackbarOpen(true)
    setSeverity('success')
  }

  const handleTranslateClose = () => {
    setTranslateOpen(false)
  }

  const { getRootProps, getInputProps, fileRejections } = useDropzone({
    onDrop: (acceptedFiles: File[]) => {
      acceptedFiles.map(file => {
        Object.assign(file, {
          preview: URL.createObjectURL(file)
        })
        contentsService.ContentsForm.setValue('Content.ContentsImage', {
          ContentsId: contentsService.ContentsForm.getValues('Content.Id'),
          Image: file as FileExtendsPreview
        })
      })
    },
    maxSize: 5242880
  })

  const wContentsDropzone = useDropzone({
    onDrop: (acceptedFiles: File[]) => {
      acceptedFiles.map(file => {
        Object.assign(file, {
          preview: URL.createObjectURL(file)
        })
        contentsService.WContentsImageSubmit({ Image: file as FileExtendsPreview, FileName: file.name })
      })
    },
    maxSize: 5242880
  })

  const OnDelete = async () => {
    contentsService.ContentsForm.setValue('Content.ContentsImage', { ContentsId: '' })
  }

  useEffect(() => {
    if (fileRejections.length > 0 && fileRejections[0].errors.length > 0) {
      setErrors([t.SCREEN_COL_SHOP_IMAGE_SIZE])
    }
  }, [fileRejections])

  useEffect(() => {
    if (wContentsDropzone.fileRejections.length > 0 && wContentsDropzone.fileRejections[0].errors.length > 0) {
      setErrors([t.SCREEN_COL_SHOP_IMAGE_SIZE])
    }
  }, [wContentsDropzone.fileRejections])

  return (
    <>
      <DatePickerWrapper sx={{ '& .react-datepicker-wrapper': { width: 'auto' } }}>
        <Box className='content-center'>
          <Card>
            <CardHeader title={t.SCREEN_TITLE_CONTENTS} titleTypographyProps={{ variant: 'h6' }} />
            <CardContent>
              <Stack component='form' noValidate onSubmit={contentsService.ContentsForm.handleSubmit(onSubmit)}>
                <ListErrors errors={errors} setErrors={setErrors} />
                {!contentsService.loading ? (
                  <Grid container sx={{ marginBottom: 4 }} spacing={5}>
                    <Grid item xs={12}>
                      <Box sx={{ mb: 1 }}>{t.SCREEN_COL_LANGUAGE_SELECTER_LANGUAGE}</Box>
                      <Controller
                        name={`Content.ContentsDetail.LanguageCd`}
                        {...contentsService.ContentsForm}
                        rules={validationRules.languageCd}
                        render={({ field, fieldState }) => (
                          <FormControl fullWidth error={fieldState.invalid}>
                            <Select
                              {...field}
                              size='small'
                              labelId='area-label'
                              id='Content.ContentsDetail.LanguageCd'
                              required
                              notched={true}
                              MenuProps={{
                                sx: {
                                  maxHeight: 300
                                }
                              }}
                              name={field.name}
                              onBlur={field.onBlur}
                              onChange={e => {
                                setLanguageCd(e.target.value)
                                field.onChange(e)
                              }}
                              value={field.value}
                            >
                              {languageCdService.languageCd.map((c, j) => {
                                return (
                                  <MenuItem value={c.LanguageCd} key={`Content.ContentsDetail.LanguageCd.${j}`}>
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
                      <Box sx={{ mb: 1 }}>{t.SCREEN_COL_CONTENTS_AUTHOR}</Box>
                      <Controller
                        name={`Content.ContentsAuthorId`}
                        {...contentsService.ContentsForm}
                        render={({ field, fieldState }) => (
                          <FormControl fullWidth error={fieldState.invalid}>
                            <Select
                              labelId='Content.ContentsAuthorId'
                              id={`Content.ContentsAuthorId`}
                              notched={true}
                              size='small'
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
                              {contentsAuthorService.contents.map(m => {
                                return (
                                  <MenuItem value={String(m.contents_author.id)} key={m.contents_author.id}>
                                    {m.contents_author_name.name}
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
                      <Box sx={{ mb: 1 }}>{t.SCREEN_COL_CONTENTS_TITLE}</Box>
                      <Controller
                        name={`Content.ContentsDetail.Title`}
                        {...contentsService.ContentsForm}
                        rules={validationRules.title}
                        render={({ field, fieldState }) => (
                          <FormControl fullWidth error={fieldState.invalid}>
                            <TextField
                              {...field}
                              {...contentsService.ContentsForm.register(`Content.ContentsDetail.Title`)}
                              fullWidth
                              size='small'
                              type='text'
                              id='Content.ContentsDetail.Title'
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
                      <Box sx={{ mb: 1 }}>{t.SCREEN_COL_CONTENTS_URL}</Box>
                      <Controller
                        name={`Content.Url`}
                        {...contentsService.ContentsForm}
                        rules={validationRules.url}
                        render={({ field, fieldState }) => (
                          <FormControl fullWidth error={fieldState.invalid}>
                            <TextField
                              {...field}
                              {...contentsService.ContentsForm.register(`Content.Url`)}
                              fullWidth
                              size='small'
                              type='text'
                              id='Content.Url'
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
                      <Box sx={{ mb: 1 }}>{t.SCREEN_COL_CONTENTS_PUBLISH_DATE}</Box>
                      <Controller
                        name={`Content.PublishDate`}
                        {...contentsService.ContentsForm}
                        rules={validationRules.publishDate}
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
                      <Box sx={{ mb: 1 }}>{t.SCREEN_COL_CONTENTS_SUMMARY}</Box>
                      <Controller
                        name={`Content.ContentsDetail.Summary`}
                        {...contentsService.ContentsForm}
                        rules={validationRules.summary}
                        render={({ field, fieldState }) => (
                          <FormControl fullWidth error={fieldState.invalid}>
                            <TextField
                              {...field}
                              {...contentsService.ContentsForm.register(`Content.ContentsDetail.Summary`)}
                              fullWidth
                              multiline
                              rows={3}
                              size='small'
                              type='text'
                              id='Content.ContentsDetail.Summary'
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
                        name={`Content.IsDisplay`}
                        {...contentsService.ContentsForm}
                        rules={validationRules.isDisplay}
                        render={({ field, fieldState }) => (
                          <FormControl fullWidth error={fieldState.invalid}>
                            <FormControlLabel
                              control={<Checkbox name='check' />}
                              label={t.SCREEN_COL_CONTENTS_IS_DISPLAY}
                              checked={field.value}
                              onChange={field.onChange}
                            />
                          </FormControl>
                        )}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <Box sx={{ mb: 1 }}>{t.SCREEN_COL_CONTENTS_LABEL}</Box>
                      <Controller
                        name={`Content.ContentsLabelCds`}
                        {...contentsService.ContentsForm}
                        render={({ field, fieldState }) => (
                          <FormControl fullWidth error={fieldState.invalid}>
                            <Select
                              labelId='Content.ContentsLabelCds'
                              id={`Content.ContentsLabelCds`}
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
                              {contentsLabelCdService.contentsLabel.map(m => {
                                return (
                                  <MenuItem value={String(m.contents_label_cd)} key={m.contents_label_cd}>
                                    {m.contents_label_name}
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
                      <Box sx={{ mb: 1 }}>{t.SCREEN_COL_CONTENTS_IMAGE}</Box>
                      <Controller
                        name={`Content.ContentsImage`}
                        {...contentsService.ContentsForm}
                        rules={validationRules.title}
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
                                                        field.value.Image?.preview ? field.value.Image?.preview : ''
                                                      )
                                                    }}
                                                    alt=''
                                                    loading='lazy'
                                                    key={field.value.ContentsId}
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
                    <Grid item xs={12}>
                      <Box sx={{ mb: 1 }}>{t.SCREEN_COL_CONTENTS_CONTENTS}</Box>
                      <Controller
                        name={`Content.ContentsDetail.Contents`}
                        {...contentsService.ContentsForm}
                        rules={validationRules.contents}
                        render={({ field, fieldState }) => (
                          <FormControl fullWidth error={fieldState.invalid}>
                            <MdEditor markdown={field.value} setMarkdown={field.onChange} />
                            <FormHelperText>{fieldState.error?.message}</FormHelperText>
                          </FormControl>
                        )}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <Box sx={{ mb: 1 }}>{t.SCREEN_COL_CONTENTS_WORK_IMAGE}</Box>
                      {contentsService.WContentsServicesControlledFields.map((v, i) => {
                        return (
                          <OutlinedInput
                            id='imgtag'
                            key={`imgtag-${i}`}
                            value={v.Path}
                            fullWidth
                            disabled
                            multiline
                            rows={5}
                            size='small'
                            sx={{ mb: '10px' }}
                            endAdornment={
                              <InputAdornment position='end'>
                                <Tooltip
                                  arrow
                                  open={openTip}
                                  onClose={handleCloseTip}
                                  disableHoverListener
                                  placement='top'
                                  title='Copied!'
                                >
                                  <IconButton
                                    aria-label='toggle password visibility'
                                    edge='end'
                                    onClick={async () => {
                                      await global.navigator.clipboard.writeText(v.Path || '')
                                    }}
                                  >
                                    <ContentCopyIcon />
                                  </IconButton>
                                </Tooltip>
                              </InputAdornment>
                            }
                            label='Password'
                          />
                        )
                      })}
                      <Box
                        component='span'
                        sx={{
                          p: 2,
                          border: '2px dashed',
                          borderColor: 'grey.400',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          mt: '10px'
                        }}
                        className='content-center'
                        {...wContentsDropzone.getRootProps()}
                      >
                        <input {...wContentsDropzone.getInputProps()} />
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
                      <Button
                        onClick={onClickHold}
                        color='secondary'
                        variant='contained'
                        size='large'
                        sx={{ ml: '10px' }}
                      >
                        {t.BUTTON_PUBLISH_HOLD}
                      </Button>
                      <Button
                        onClick={onClickPublish}
                        color='secondary'
                        variant='contained'
                        size='large'
                        sx={{ ml: '10px' }}
                      >
                        {t.BUTTON_PUBLISH}
                      </Button>
                      <Button type='submit' variant='contained' size='large'>
                        {t.BUTTON_UPDATE}
                      </Button>
                    </Box>
                  </Grid>
                </Grid>
              </Stack>
              <Backdrop
                sx={{ color: '#fff', zIndex: 999999 }}
                open={contentsService.submitLoading || contentsService.loading}
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
                  {message}
                </Alert>
              </Snackbar>
            </CardContent>
          </Card>

          <Dialog
            open={translateOpen}
            onClose={handleTranslateClose}
            aria-labelledby='alert-dialog-title'
            aria-describedby='alert-dialog-description'
            sx={{ zIndex: '99999' }}
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
        <Box sx={{ background: '#fff', pt: '10px', mt: '20px' }}>
          <Box sx={{ ml: '20px' }}>
            <h2>{t.SCREEN_TITLE_CONTENTS_PREVIEW}</h2>
          </Box>
          <Divider />
          <Box className={styles.blog_wrapper}>
            <Box className={styles.contents_detail_main}>
              {/* @ts-ignore rehypeRawのsignature違いでエラーとなるが無視する */}
              <Controller
                name={`Content.ContentsDetail.Contents`}
                {...contentsService.ContentsForm}
                rules={validationRules.contents}
                render={({ field }) => (
                  <div className='wmde-markdown wmde-markdown-color '>
                    <ReactMarkdown remarkPlugins={[[remarkGfm, { singleTilde: false }]]} rehypePlugins={[rehypeRaw]}>
                      {field.value?.replace(/<br\/>/g, '\n')}
                    </ReactMarkdown>
                  </div>
                )}
              />
            </Box>
          </Box>
        </Box>
      </DatePickerWrapper>
    </>
  )
}

export default Contents
