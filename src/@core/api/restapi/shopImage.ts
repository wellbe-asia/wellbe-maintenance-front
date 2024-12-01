import axios from '@/@core/api/BaseAxios'
import { ShopImageResponseType, ShopImageType } from '../type/shopImage'

const ShopImageAPI = {
  GetWithShopId: async (
    shopId: string,
    languageCd: string
  ): Promise<{ status: number; data: ShopImageResponseType | null }> => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_SERVER_SHOP_URL}/shop/shop_image_proofreadings/shop_id_language_cd?shop_id=${shopId}&language_cd=${languageCd}`,
        {
          headers: {
            Wellbe_Apikey: process.env.NEXT_PUBLIC_API_KEY_WITHOUT_LOGIN
          }
        }
      )

      return response
    } catch (error: any) {
      return error
    }
  },
  DeleteShopImage: async (id: string): Promise<{ status: number; data: ShopImageResponseType | null }> => {
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER_SHOP_URL}/cud/shop_image_proofreading/delete`,
        JSON.stringify({ id: id }),
        {
          headers: {
            'Content-Type': 'application/json',
            Wellbe_Apikey: process.env.NEXT_PUBLIC_API_KEY_SHOP_MAINTENANCE
          }
        }
      )

      return response
    } catch (error: any) {
      return error
    }
  },
  DeleteShopImageShopIdLanguageCd: async (
    shopId: string,
    languageCd: string
  ): Promise<{ status: number; data: ShopImageResponseType | null }> => {
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER_SHOP_URL}/shop/delete_shop_image_with_shopid_language_cd`,
        JSON.stringify({ shop_id: shopId, language_cd: languageCd }),
        {
          headers: {
            'Content-Type': 'application/json',
            Wellbe_Apikey: process.env.NEXT_PUBLIC_API_KEY_SHOP_MAINTENANCE
          }
        }
      )

      return response
    } catch (error: any) {
      return error
    }
  },
  CreateShopImage: async (
    shopImageType: ShopImageType
  ): Promise<{ status: number; data: ShopImageResponseType | null }> => {
    try {
      const categories = [] as string[]
      for (const v of shopImageType.ShopImageCategories) {
        if (v) {
          categories.push(v)
        }
      }
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER_SHOP_URL}/shop/create_shop_image`,
        JSON.stringify({
          shop_id: shopImageType.ShopId,
          language_cd: shopImageType.LanguageCd,
          image_category: shopImageType.ImageCategory,
          shop_image_path: shopImageType.ShopImagePath,
          shop_image_alt: shopImageType.ShopImageDescription,
          shop_image_description: shopImageType.ShopImageDescription,
          shop_image_filter_category_cds: categories
        }),
        {
          headers: {
            'Content-Type': 'application/json',
            Wellbe_Apikey: process.env.NEXT_PUBLIC_API_KEY_SHOP_MAINTENANCE
          }
        }
      )

      return response
    } catch (error: any) {
      return error
    }
  },
  UpdateShopImage: async (
    shopImageType: ShopImageType
  ): Promise<{ status: number; data: ShopImageResponseType | null }> => {
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER_SHOP_URL}/cud/shop_image_proofreading/update`,
        JSON.stringify({
          id: shopImageType.Id,
          language_cd: shopImageType.LanguageCd,
          shop_id: shopImageType.ShopId,
          image_category: shopImageType.ImageCategory,
          shop_image_path: shopImageType.ShopImagePath,
          shop_image_alt: shopImageType.ShopImageDescription,
          shop_image_description: shopImageType.ShopImageDescription
        }),
        {
          headers: {
            'Content-Type': 'application/json',
            Wellbe_Apikey: process.env.NEXT_PUBLIC_API_KEY_SHOP_MAINTENANCE
          }
        }
      )

      return response
    } catch (error: any) {
      return error
    }
  },
  UploadShopImage: async (shopImageType: ShopImageType) => {
    try {
      const formData = new FormData()
      if (!shopImageType.ShopImage) {
        return Promise.resolve({ data: null, result_code: 200 })
      }
      const categories = [] as string[]
      for (const v of shopImageType.ShopImageCategories) {
        if (v) {
          categories.push(v)
        }
      }
      formData.append('images', shopImageType.ShopImage)
      formData.append('language_cd', shopImageType.LanguageCd)
      formData.append('shop_id', shopImageType.ShopId)
      formData.append('image_category', shopImageType.ImageCategory)
      formData.append('shop_image_alt', shopImageType.ShopImageAlt)
      formData.append('shop_image_description', shopImageType.ShopImageDescription)
      formData.append('shop_image_filter_category_cd', categories.join(','))
      const response = await axios.post(`${process.env.NEXT_PUBLIC_SERVER_SHOP_URL}/shop/upload_shop_image`, formData, {
        headers: {
          Wellbe_Apikey: process.env.NEXT_PUBLIC_API_KEY_SHOP_MAINTENANCE
        }
      })

      return response
    } catch (error: any) {
      return error
    }
  }
}

export default ShopImageAPI
