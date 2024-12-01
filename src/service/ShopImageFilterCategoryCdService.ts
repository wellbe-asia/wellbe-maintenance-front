import { useState } from 'react'
import CShopImageFilterCategoryAPI from '@/@core/api/factoryCShopImageFilterCategory'
import { ShopImageFilterCategoryType } from '@/@core/api/type/cShopImageFilterCategory'

const ShopImageFilterCategoryCdService = () => {
  const [shopImageFilterCategoryCd, setShopImageFilterCategoryCd] = useState([] as ShopImageFilterCategoryType[])
  const FetchShopImageFilterCategoryCd = async (language: string) => {
    const { data } = await CShopImageFilterCategoryAPI.GetCShopImageFilterCategory(Number(language))
    if (data?.c_shop_image_filter_categorys) {
      setShopImageFilterCategoryCd(data.c_shop_image_filter_categorys)
    }
  }

  return { shopImageFilterCategoryCd, setShopImageFilterCategoryCd, FetchShopImageFilterCategoryCd }
}

export default ShopImageFilterCategoryCdService
