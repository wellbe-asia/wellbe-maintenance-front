import axios from '@/@core/api/BaseAxios'
import { ShopImageRequestType, ShopImageResponseType, ShopImageType } from '../type/shopImage'

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
        `${process.env.NEXT_PUBLIC_SERVER_SHOP_URL}/shop/delete_shop_image`,
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
  BulkCreateShopImage: async (
    shopImages: ShopImageType[]
  ): Promise<{ status: number; data: ShopImageResponseType | null }> => {
    try {
      const shopRequestImages = [] as ShopImageRequestType[]
      for (const v of shopImages) {
        const categories = [] as string[]
        for (const d of v.ShopImageCategories) {
          if (d) {
            categories.push(d)
          }
        }
        shopRequestImages.push({
          id: v.Id,
          shop_id: v.ShopId,
          language_cd: v.LanguageCd,
          shop_image_alt: v.ShopImageAlt,
          shop_image_description: v.ShopImageDescription,
          shop_image_filter_category_cds: categories,
          shop_image_path: v.ShopImagePath,
          image_category: v.ImageCategory
        })
      }

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER_SHOP_URL}/shop/bulk/create_shop_image`,
        JSON.stringify({
          shop_images: shopRequestImages
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
  UploadShopImage: async (shopImages: ShopImageType[]) => {
    try {
      const formData = new FormData()
      for (const v of shopImages) {
        const categories = [] as string[]
        for (const d of v.ShopImageCategories) {
          if (d) {
            categories.push(d)
          }
        }
        if (v.ShopImage) {
          formData.append('images', v.ShopImage)
          formData.append('language_cd', v.LanguageCd)
          formData.append('shop_id', v.ShopId)
          formData.append('image_category', v.ImageCategory)
          formData.append('shop_image_alt', v.ShopImageAlt)
          formData.append('shop_image_description', v.ShopImageDescription)
          formData.append('shop_image_filter_category_cd', categories.join(','))
        } else {
          return Promise.resolve({ data: null, result_code: 200 })
        }
      }
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
