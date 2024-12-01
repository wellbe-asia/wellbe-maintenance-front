import { useFieldArray, Control } from 'react-hook-form'

// ** API
import { ShopImageType } from '@/@core/api/type/shopImage'
import { ShopDescriptionContentFormType } from './ShopDescriptionContentService'

const useShopDescriptionContentImageFieldArray = (
  control: Control<ShopDescriptionContentFormType>,
  languageIndex: number
) => {
  return useFieldArray({
    control,
    name: `ShopDescriptionContents.${languageIndex}.ShopImages`
  })
}

const ShopDescriptionContentImageService = (
  control: Control<ShopDescriptionContentFormType>,
  languageIndex: number
) => {
  const { append, fields, remove } = useShopDescriptionContentImageFieldArray(control, languageIndex)

  const AddShopImage = (image: ShopImageType) => {
    append(image)
  }

  const RemoveShopImage = (index: number) => {
    remove(index)
  }

  return { fields, AddShopImage, RemoveShopImage }
}

export default ShopDescriptionContentImageService
