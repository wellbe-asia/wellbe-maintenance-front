import axios from '@/@core/api/BaseAxios'
import {
  ShopContentImageResponseType,
  ShopContentImageType,
  ShopContentImageRequestType
} from '../type/shopContentImage'

const ShopContentImageAPI = {
  GetShopContentImage: async (
    shopContentId: string,
    languageCd: string
  ): Promise<{ status: number; data: ShopContentImageResponseType }> => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_SERVER_SHOP_URL}/shop_content_image_proofreadings/shop_content_id_language_cd?shop_content_id=${shopContentId}&language_cd=${languageCd}`,
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
  DeleteShopContentImage: async (id: string): Promise<{ status: number; data: ShopContentImageResponseType }> => {
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER_SHOP_URL}/cud/shop_content_image_proofreading/delete`,
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
  DeleteShopContentImageContentIdLanguageCd: async (
    shopContentId: string,
    languageCd: string
  ): Promise<{ status: number; data: ShopContentImageResponseType }> => {
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER_SHOP_URL}/shop/delete_shop_content_image_with_shop_contentid_languagecd`,
        JSON.stringify({ shop_content_id: shopContentId, language_cd: languageCd }),
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
  CreateShopContentImage: async (
    shopContentImageType: ShopContentImageType
  ): Promise<{ status: number; data: ShopContentImageResponseType }> => {
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER_SHOP_URL}/cud/shop_content_image_proofreading/create`,
        JSON.stringify({
          shop_content_id: shopContentImageType.ShopContentId,
          language_cd: shopContentImageType.LanguageCd,
          image_category: shopContentImageType.ImageCategory,
          shop_image_path: shopContentImageType.ShopImagePath,
          shop_image_alt: shopContentImageType.ShopImageDescription,
          shop_image_description: shopContentImageType.ShopImageDescription
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
  BulkCreateShopContentImage: async (
    shopContentImageType: ShopContentImageType[]
  ): Promise<{ status: number; data: ShopContentImageResponseType }> => {
    try {
      const shopRequestContentImages = [] as ShopContentImageRequestType[]
      for (const v of shopContentImageType) {
        shopRequestContentImages.push({
          shop_content_id: v.ShopContentId,
          language_cd: v.LanguageCd,
          image_category: v.ImageCategory,
          shop_image_path: v.ShopImagePath,
          shop_image_alt: v.ShopImageDescription,
          shop_image_description: v.ShopImageDescription
        })
      }
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER_SHOP_URL}/shop/bulk/create_shop_content_image`,
        JSON.stringify({
          shop_content_images: shopRequestContentImages
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
  UpdateShopContentImage: async (
    token: string,
    shopContentImageType: ShopContentImageType
  ): Promise<{ status: number; data: ShopContentImageResponseType }> => {
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER_SHOP_URL}/cud/shop_content_image_proofreading/update`,
        JSON.stringify({
          id: shopContentImageType.Id,
          shop_content_id: shopContentImageType.ShopContentId,
          language_cd: shopContentImageType.LanguageCd,
          image_category: shopContentImageType.ImageCategory,
          shop_image_path: shopContentImageType.ShopImagePath,
          shop_image_alt: shopContentImageType.ShopImageDescription,
          shop_image_description: shopContentImageType.ShopImageDescription
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
  UploadShopContentImage: async (
    shopContentImage: ShopContentImageType[]
  ): Promise<{ status: number; data: ShopContentImageResponseType | null }> => {
    try {
      const formData = new FormData()
      for (const v of shopContentImage) {
        if (!v.ShopImage) {
          return Promise.resolve({ data: null, status: 200 })
        }
        formData.append('images', v.ShopImage)
        formData.append('language_cd', v.LanguageCd)
        formData.append('shop_content_id', v.ShopContentId)
        formData.append('image_category', v.ImageCategory)
        formData.append('shop_image_alt', v.ShopImageDescription)
        formData.append('shop_image_description', v.ShopImageDescription)
      }

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER_SHOP_URL}/shop/upload_shop_content_image`,
        formData,
        {
          headers: {
            Wellbe_Apikey: process.env.NEXT_PUBLIC_API_KEY_SHOP_MAINTENANCE
          }
        }
      )

      return response
    } catch (error: any) {
      return error
    }
  }
}

export default ShopContentImageAPI
