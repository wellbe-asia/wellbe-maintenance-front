import React, { useEffect, useState } from 'react'
import { Control, UseFormReturn, Controller } from 'react-hook-form'

// ** Material UI
import ImageList from '@mui/material/ImageList'
import ImageListItem from '@mui/material/ImageListItem'
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import TextField from '@mui/material/TextField'
import FormControl from '@mui/material/FormControl'
import Chip from '@mui/material/Chip'
import Snackbar from '@mui/material/Snackbar'
import Alert from '@mui/material/Alert'
import UploadFileIcon from '@mui/icons-material/UploadFile'
import DeleteIcon from '@mui/icons-material/Delete'
import Typography from '@mui/material/Typography'

import { useDropzone } from 'react-dropzone'

// ** Service
import { ShopDescriptionContentFormType } from '@/service/ShopDescriptionContentService'
import ShopDescriptionContentContentImageService from '@/service/ShopDescriptionContentContentImageService'

// ** API
import { FileExtendsPreview, ShopContentImageType } from '@/@core/api/type/shopContentImage'

// ** hook
import { useLocale } from 'src/@core/hooks/useLocal'
import { ValidationRules } from './validationRule'
import { IMAGE_CATEGORY } from '@/@core/utils/constant'
import { LanguageType } from '@/@core/api/type/cLanguage'

type props = {
  control: Control<ShopDescriptionContentFormType>
  form: UseFormReturn<ShopDescriptionContentFormType, any>
  languageIndex: number
  contentIndex: number
  languageCds: LanguageType[]
  SetAddShopContentImage: (languageCd: string, func: (image: ShopContentImageType) => void) => void
  AddShopContentImage: (excludeLanguageCd: string, shopImage: ShopContentImageType) => void
  SetRemoveShopContentImage: (languageCd: string, func: (index: number) => void) => void
  RemoveShopContentImage: (excludeLanguageCd: string, index: number) => void
}

export default function ShopContentImageCard(props: props) {
  const shopDescriptionContentContentImageService = ShopDescriptionContentContentImageService(
    props.control,
    props.languageIndex,
    props.contentIndex
  )
  const validationRule = ValidationRules()
  const { t } = useLocale()
  const [error, setError] = useState('')
  useEffect(() => {
    if (
      shopDescriptionContentContentImageService.AddShopImage != undefined &&
      shopDescriptionContentContentImageService.RemoveShopImage != undefined &&
      props.languageCds.length > 0
    ) {
      props.SetAddShopContentImage(
        props.languageCds[props.languageIndex].LanguageCd,
        shopDescriptionContentContentImageService.AddShopImage
      )
      props.SetRemoveShopContentImage(
        props.languageCds[props.languageIndex].LanguageCd,
        shopDescriptionContentContentImageService.RemoveShopImage
      )
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    shopDescriptionContentContentImageService.AddShopImage,
    shopDescriptionContentContentImageService.RemoveShopImage,
    props.languageCds
  ])

  const { getRootProps, getInputProps, fileRejections } = useDropzone({
    onDrop: (acceptedFiles: File[]) => {
      acceptedFiles.map(file => {
        Object.assign(file, {
          preview: URL.createObjectURL(file)
        })
        props.AddShopContentImage(props.form.getValues(`ShopDescriptionContents.${props.languageIndex}.LanguageCd`), {
          Id: '',
          ImageCategory: IMAGE_CATEGORY.MAIN_IMAGE,
          ShopImage: file as FileExtendsPreview,
          ShopContentId: props.form.getValues(
            `ShopDescriptionContents.${props.languageIndex}.ShopContents.${props.contentIndex}.Id`
          ),
          LanguageCd: props.form.getValues(`ShopDescriptionContents.${props.languageIndex}.LanguageCd`),
          ShopImageAlt: '',
          ShopImageDescription: '',
          ShopImagePath: ''
        })
        shopDescriptionContentContentImageService.AddShopImage({
          Id: '',
          ImageCategory: IMAGE_CATEGORY.MAIN_IMAGE,
          ShopImage: file as FileExtendsPreview,
          ShopContentId: props.form.getValues(
            `ShopDescriptionContents.${props.languageIndex}.ShopContents.${props.contentIndex}.Id`
          ),
          LanguageCd: props.form.getValues(`ShopDescriptionContents.${props.languageIndex}.LanguageCd`),
          ShopImageAlt: '',
          ShopImageDescription: '',
          ShopImagePath: ''
        })
      })
    },
    maxSize: 5242880
  })

  const OnDelete = async (index: number) => {
    props.RemoveShopContentImage(
      props.form.getValues(`ShopDescriptionContents.${props.languageIndex}.LanguageCd`),
      index
    )
    shopDescriptionContentContentImageService.RemoveShopImage(index)
  }

  useEffect(() => {
    if (fileRejections.length > 0 && fileRejections[0].errors.length > 0) {
      setError(t.SCREEN_COL_SHOP_IMAGE_SIZE)
    }
  }, [fileRejections])

  return (
    <ImageList cols={20} sx={{ width: '90%' }}>
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
                <UploadFileIcon fontSize='large' color='disabled' sx={{ width: '100%', alignItems: 'center' }} />
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
      {shopDescriptionContentContentImageService.fields.map((field, index) => (
        <ImageListItem key={field.id} sx={{ width: 200 }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              {field.ShopImagePath != '' ? (
                <img
                  src={`${field.ShopImagePath}`}
                  alt={field.ShopImageAlt}
                  loading='lazy'
                  style={{ width: 200, height: 200, position: 'relative' }}
                />
              ) : (
                <img
                  src={URL.createObjectURL(field.ShopImage as FileExtendsPreview)}
                  onLoad={() => {
                    URL.revokeObjectURL(field.ShopImage?.preview ? field.ShopImage?.preview : '')
                  }}
                  alt=''
                  loading='lazy'
                  key={field.id}
                  style={{ width: 200, height: 200, position: 'relative' }}
                />
              )}
              <Chip
                color='secondary'
                label={t.BUTTON_DELETE}
                deleteIcon={<DeleteIcon />}
                size='small'
                onDelete={() => OnDelete(index)}
                onClick={() => OnDelete(index)}
                sx={{ position: 'absolute', zIndex: 999, top: 3, right: 2 }}
              />
            </Grid>

            <Grid item xs={12}>
              <Controller
                name={`ShopDescriptionContents.${props.languageIndex}.ShopContents.${props.contentIndex}.ShopContentImages.${index}.ShopImageDescription`}
                {...props.form}
                rules={validationRule.shopImageDescription}
                render={({ field, fieldState }) => (
                  <FormControl fullWidth>
                    <TextField
                      {...field}
                      {...props.form.register(
                        `ShopDescriptionContents.${props.languageIndex}.ShopContents.${props.contentIndex}.ShopContentImages.${index}.ShopImageDescription`
                      )}
                      fullWidth
                      type='text'
                      autoFocus={false}
                      label={t.SCREEN_COL_SHOP_IMAGE_IMAGE_DESCRIPTION}
                      id='shop-contact-card-ShopImageDescription'
                      error={fieldState.invalid}
                      helperText={fieldState.error?.message}
                      InputLabelProps={{ shrink: true }}
                    />
                  </FormControl>
                )}
              />
              <span>{t.SCREEN_COL_SHOP_CONTENT_IMAGE_IMAGE_DESCRIPTION_SUPPLEMENT}</span>
            </Grid>
          </Grid>
        </ImageListItem>
      ))}
      <Snackbar
        open={error != ''}
        autoHideDuration={6000}
        onClose={() => {
          setError('')
        }}
        anchorOrigin={{ horizontal: 'center', vertical: 'top' }}
      >
        <Alert
          onClose={() => {
            setError('')
          }}
          variant='filled'
          severity='error'
          sx={{ width: '100%' }}
        >
          {error}
        </Alert>
      </Snackbar>
    </ImageList>
  )
}
