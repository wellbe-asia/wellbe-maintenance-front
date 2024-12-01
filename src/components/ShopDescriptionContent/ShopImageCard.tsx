import React, { useEffect, useState } from 'react'
import { Control, Controller, UseFormReturn } from 'react-hook-form'

// ** Material UI
import ImageList from '@mui/material/ImageList'
import ImageListItem from '@mui/material/ImageListItem'
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Chip from '@mui/material/Chip'
import Snackbar from '@mui/material/Snackbar'
import Alert from '@mui/material/Alert'
import UploadFileIcon from '@mui/icons-material/UploadFile'
import DeleteIcon from '@mui/icons-material/Delete'
import Typography from '@mui/material/Typography'
import MenuItem from '@mui/material/MenuItem'
import FormHelperText from '@mui/material/FormHelperText'
import { FormControl, InputLabel, Select } from '@mui/material'

import { useDropzone } from 'react-dropzone'

// ** Service
import ShopDescriptionContentImageService from '@/service/ShopDescriptionContentImageService'
import { ShopDescriptionContentFormType } from '@/service/ShopDescriptionContentService'

// ** API
import { FileExtendsPreview, ShopImageType } from '@/@core/api/type/shopImage'

// ** hook
import { useLocale } from 'src/@core/hooks/useLocal'
import { IMAGE_CATEGORY } from '@/@core/utils/constant'
import { LanguageType } from '@/@core/api/type/cLanguage'
import ShopImageFilterCategoryCdService from '@/service/ShopImageFilterCategoryCdService'
import { useRouter } from 'next/router'
import { getDefaultLanguageCd, getLanguageCdWithValue } from '@/configs/locales/locales'
import { ValidationRules } from './validationRule'
import { ShopImageFilterCategoryType } from '@/@core/api/type/cShopImageFilterCategory'
import { getFileType } from '@/@core/utils/file'

type props = {
  control: Control<ShopDescriptionContentFormType>
  form: UseFormReturn<ShopDescriptionContentFormType, any>
  index: number
  languageCds: LanguageType[]
  shopId: string
  SetAddShopImage: (languageCd: string, func: (image: ShopImageType) => void) => void
  AddShopImage: (excludeLanguageCd: string, shopImage: ShopImageType) => void
  SetRemoveShopImage: (languageCd: string, func: (index: number) => void) => void
  RemoveShopImage: (excludeLanguageCd: string, index: number) => void
}

export default function ShopImageCard(props: props) {
  const shopDescriptionContentImageService = ShopDescriptionContentImageService(props.control, props.index)
  const shopImageFilterCategoryCdService = ShopImageFilterCategoryCdService()
  const { t } = useLocale()
  const router = useRouter()
  const [error, setError] = useState('')
  const validationRules = ValidationRules()

  useEffect(() => {
    const varLanguageCd = router.locale ? getLanguageCdWithValue(router.locale) : getDefaultLanguageCd()
    shopImageFilterCategoryCdService.FetchShopImageFilterCategoryCd(varLanguageCd)

    // Only first time
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.locale])

  useEffect(() => {
    SetShopImageTrigger()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    shopDescriptionContentImageService.AddShopImage,
    shopDescriptionContentImageService.RemoveShopImage,
    props.languageCds
  ])

  const SetShopImageTrigger = () => {
    if (
      shopDescriptionContentImageService.AddShopImage != undefined &&
      shopDescriptionContentImageService.RemoveShopImage != undefined &&
      props.languageCds.length > 0
    ) {
      props.SetAddShopImage(props.languageCds[props.index].LanguageCd, shopDescriptionContentImageService.AddShopImage)
      props.SetRemoveShopImage(
        props.languageCds[props.index].LanguageCd,
        shopDescriptionContentImageService.RemoveShopImage
      )
    }
  }

  const { getRootProps, getInputProps, fileRejections } = useDropzone({
    onDrop: (acceptedFiles: File[]) => {
      console.log(acceptedFiles)
      acceptedFiles.map(file => {
        Object.assign(file, {
          preview: URL.createObjectURL(file)
        })
        props.AddShopImage(props.form.getValues(`ShopDescriptionContents.${props.index}.LanguageCd`), {
          Id: '',
          ImageCategory: IMAGE_CATEGORY.MAIN_IMAGE,
          ShopImage: file as FileExtendsPreview,
          ShopId: props.shopId,
          LanguageCd: props.form.getValues(`ShopDescriptionContents.${props.index}.LanguageCd`),
          ShopImageAlt: '',
          ShopImageDescription: '',
          ShopImagePath: '',
          ShopImageCategories: []
        })
        shopDescriptionContentImageService.AddShopImage({
          Id: '',
          ImageCategory: IMAGE_CATEGORY.MAIN_IMAGE,
          ShopImage: file as FileExtendsPreview,
          ShopId: props.shopId,
          LanguageCd: props.form.getValues(`ShopDescriptionContents.${props.index}.LanguageCd`),
          ShopImageAlt: '',
          ShopImageDescription: '',
          ShopImagePath: '',
          ShopImageCategories: []
        })
      })
    }
  })

  const OnDelete = async (index: number) => {
    props.RemoveShopImage(props.form.getValues(`ShopDescriptionContents.${props.index}.LanguageCd`), index)
    shopDescriptionContentImageService.RemoveShopImage(index)
  }

  useEffect(() => {
    // if (fileRejections.length > 0 && fileRejections[0].errors.length > 0) {
    //   setError(t.SCREEN_COL_SHOP_IMAGE_SIZE)
    // }
  }, [fileRejections])

  const onChangeCategory = (index: number, s: string[] | string) => {
    for (let i = 0; i < props.languageCds.length; i++) {
      props.form.setValue(
        `ShopDescriptionContents.${i}.ShopImages.${index}.ShopImageCategories`,
        Array.isArray(s) ? s : [s]
      )
    }
  }

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
      {shopDescriptionContentImageService.fields.map((field, index) => (
        <ImageListItem key={field.id} sx={{ width: 200 }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              {field.ShopImagePath != '' ? (
                getFileType(field.ShopImagePath) == 'video' ? (
                  <video src={`${field.ShopImagePath}`} style={{ width: 200, height: 200, position: 'relative' }} />
                ) : (
                  <img
                    src={`${field.ShopImagePath}`}
                    alt={field.ShopImageAlt}
                    loading='lazy'
                    style={{ width: 200, height: 200, position: 'relative' }}
                  />
                )
              ) : getFileType(field.ShopImage?.path || '') == 'video' ? (
                <video
                  src={URL.createObjectURL(field.ShopImage as FileExtendsPreview)}
                  onLoad={() => {
                    URL.revokeObjectURL(field.ShopImage?.preview ? field.ShopImage?.preview : '')
                  }}
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
                name={`ShopDescriptionContents.${props.index}.ShopImages.${index}.ShopImageCategories`}
                {...props.form}
                rules={validationRules.shopImageCategory}
                render={({ field, fieldState }) => (
                  <FormControl fullWidth error={fieldState.invalid}>
                    <InputLabel id='area-label' shrink={true}>
                      {t.SCREEN_COL_SHOP_IMAGE_IMAGE_CATEGORY}
                    </InputLabel>
                    <Select
                      labelId='area-label'
                      id={`ShopDescriptionContents.${props.index}.ShopImages.${index}.ShopImageCategories`}
                      label={t.SCREEN_COL_SHOP_IMAGE_IMAGE_CATEGORY}
                      notched={true}
                      multiple
                      onChange={e => {
                        onChangeCategory(index, e.target.value)
                      }}
                      MenuProps={{
                        sx: {
                          maxHeight: 300
                        }
                      }}
                      value={field.value}
                    >
                      {shopImageFilterCategoryCdService.shopImageFilterCategoryCd.map(
                        (m: ShopImageFilterCategoryType) => {
                          return (
                            <MenuItem
                              value={String(m.shop_image_filter_category_cd)}
                              key={m.shop_image_filter_category_cd}
                            >
                              {m.shop_image_filter_category_name}
                            </MenuItem>
                          )
                        }
                      )}
                    </Select>
                    <FormHelperText>{fieldState.error?.message}</FormHelperText>
                  </FormControl>
                )}
              />
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
