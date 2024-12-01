import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { Controller, SubmitHandler } from 'react-hook-form'

// hook
import { useLocale } from '@/@core/hooks/useLocal'

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
  Tooltip
} from '@mui/material'
import UploadFileIcon from '@mui/icons-material/UploadFile'
import ContentCopyIcon from '@mui/icons-material/ContentCopy'
import DeleteIcon from '@mui/icons-material/Delete'
import ListErrors from '@/@core/components/list-errors'
import { ValidationRules } from '@/validationRules/contents'
import dynamic from 'next/dynamic'
import { useDropzone } from 'react-dropzone'
import { FileExtendsPreview } from '@/@core/api/type/contentsImage'

const MdEditor = dynamic(import('@/components/MdEditor'), {
  ssr: false,
  loading: () => <div>now loading</div>
})

const Contents = () => {
  const { t, locale } = useLocale()
  const router = useRouter()
  const contentsService = ContentsService()

  // ** State
  const [errors, setErrors] = useState<string[]>([])
  const [successOpen, setSuccessOpen] = useState(false)
  const [languageCd, setLanguageCd] = useState('')
  const [openTip, setOpenTip] = useState<boolean>(false)

  const handleCloseTip = (): void => {
    setOpenTip(false)
  }

  const { contents_id } = router.query
  const contentsId = contents_id && [contents_id].flat(1).length > 0 ? [contents_id].flat(1)[0] : ''

  const validationRules = ValidationRules()

  useEffect(() => {
    const varLanguageCd = getLanguageCdWithValue(locale || '')
    if (varLanguageCd) {
      setLanguageCd(varLanguageCd)
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (languageCd) {
      contentsService.Init(contentsId, languageCd)
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
      setSuccessOpen(true)
      contentsService.Init(res.contentsId, languageCd)
    } catch (error) {
      console.error(error)
    } finally {
    }
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
                          {contentsService.languageCds.map((c, j) => {
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
                  <Button type='submit' variant='contained' size='large'>
                    {t.BUTTON_UPDATE}
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </Stack>
          <Backdrop
            sx={{ color: '#fff', zIndex: theme => theme.zIndex.drawer + 1 }}
            open={contentsService.submitLoading || contentsService.loading}
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

export default Contents
