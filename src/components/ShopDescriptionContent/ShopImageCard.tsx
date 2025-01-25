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
import Typography from '@mui/material/Typography'
import UploadFileIcon from '@mui/icons-material/UploadFile'
import DeleteIcon from '@mui/icons-material/Delete'
import MenuItem from '@mui/material/MenuItem'
import FormHelperText from '@mui/material/FormHelperText'
import { FormControl, InputLabel, Select } from '@mui/material'

import { useDropzone } from 'react-dropzone'

// ** Service
import { ShopDescriptionContentFormType } from '@/service/ShopDescriptionContentService'

// ** API
import { FileExtendsPreview, ShopImageType } from '@/@core/api/type/shopImage'

// ** hook
import { useLocale } from 'src/@core/hooks/useLocal'
import { ValidationRules } from './validationRule'
import { IMAGE_CATEGORY } from '@/@core/utils/constant'
import ShopImageFilterCategoryCdService from '@/service/ShopImageFilterCategoryCdService'
import { useRouter } from 'next/router'
import { getDefaultLanguageCd, getLanguageCdWithValue } from '@/configs/locales/locales'
import { ShopImageFilterCategoryType } from '@/@core/api/type/cShopImageFilterCategory'

type props = {
  control: Control<ShopDescriptionContentFormType>
  form: UseFormReturn<ShopDescriptionContentFormType, any>
  shopImages: ShopImageType[]
  shopId: string
  AddShopImage: (image: ShopImageType) => void
  RemoveShopImage: (index: number) => void
}

export default function ShopImageCard(props: props) {
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

  const { getRootProps, getInputProps, fileRejections } = useDropzone({
    onDrop: (acceptedFiles: File[]) => {
      acceptedFiles.map(file => {
        Object.assign(file, {
          preview: URL.createObjectURL(file)
        })
        props.AddShopImage({
          Id: '',
          ImageCategory: IMAGE_CATEGORY.MAIN_IMAGE,
          ShopImage: file as FileExtendsPreview,
          ShopId: props.shopId,
          LanguageCd: props.form.getValues(`ShopDescriptionContent.LanguageCd`),
          ShopImageAlt: '',
          ShopImageDescription: '',
          ShopImagePath: '',
          ShopImageCategories: []
        })
      })
    },
    maxSize: 5242880
  })

  const OnDelete = async (index: number) => {
    props.RemoveShopImage(index)
  }

  const onChangeCategory = (index: number, s: string[] | string) => {
    props.form.setValue(`ShopDescriptionContent.ShopImages.${index}.ShopImageCategories`, Array.isArray(s) ? s : [s])
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
            <Grid container alignItems='center' justifyContent='center'>
              <Typography sx={{ alignContent: 'center' }} fontSize='medium'>
                {t.SCREEN_COL_SHOP_IMAGE_SIZE}
              </Typography>
            </Grid>
          </Grid>
        </Box>
      </ImageListItem>
      {props.shopImages.map((field, index) => (
        <ImageListItem key={field.Id} sx={{ width: 200 }}>
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
                  key={field.Id}
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
                name={`ShopDescriptionContent.ShopImages.${index}.ShopImageCategories`}
                {...props.form}
                rules={validationRules.shopImageCategory}
                render={({ field, fieldState }) => (
                  <FormControl fullWidth error={fieldState.invalid}>
                    <InputLabel id='area-label' shrink={true}>
                      {t.SCREEN_COL_SHOP_IMAGE_IMAGE_CATEGORY}
                    </InputLabel>
                    <Select
                      labelId='area-label'
                      id={`ShopDescriptionContent.ShopImages.${index}.ShopImageCategories`}
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
          sx={{ width: '100%', color: '#fff' }}
        >
          {error}
        </Alert>
      </Snackbar>
    </ImageList>
  )
}
