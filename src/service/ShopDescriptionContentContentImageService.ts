import { useFieldArray, Control } from 'react-hook-form'

// ** API
import { ShopDescriptionContentFormType } from './ShopDescriptionContentService'
import { ShopContentImageType } from '@/@core/api/type/shopContentImage'

const useShopDescriptionContentContentImageFieldArray = (
  control: Control<ShopDescriptionContentFormType>,
  languageIndex: number,
  contentIndex: number
) => {
  return useFieldArray({
    control,
    name: `ShopDescriptionContents.${languageIndex}.ShopContents.${contentIndex}.ShopContentImages`
  })
}

const ShopDescriptionContentContentImageService = (
  control: Control<ShopDescriptionContentFormType>,
  languageIndex: number,
  contentIndex: number
) => {
  const { append, fields, remove } = useShopDescriptionContentContentImageFieldArray(
    control,
    languageIndex,
    contentIndex
  )

  const AddShopImage = (image: ShopContentImageType) => {
    append(image)
  }

  const RemoveShopImage = (index: number) => {
    remove(index)
  }

  return { fields, AddShopImage, RemoveShopImage }
}

export default ShopDescriptionContentContentImageService
