import axios from '@/@core/api/BaseAxios'
import { ShopEquipmentResponseType, ShopEquipmentType } from './../type/shopEquipment'

const ShopEquipmentAPI = {
  GetWithShopId: async (shopId: string): Promise<{ status: number; data: ShopEquipmentResponseType | null }> => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_SERVER_SHOP_URL}/shop_equipment_proofreadings/shop_id?shop_id=${shopId}`,
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
  DeleteShopEquipment: async (id: string): Promise<{ status: number; data: ShopEquipmentResponseType | null }> => {
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER_SHOP_URL}/cud/shop_equipment_proofreading/delete`,
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
  CreateShopEquipment: async (
    shopEquipmentType: ShopEquipmentType
  ): Promise<{ status: number; data: ShopEquipmentResponseType | null }> => {
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER_SHOP_URL}/cud/shop_equipment_proofreading/create`,
        JSON.stringify({
          shop_id: shopEquipmentType.ShopId,
          equipment_cd: shopEquipmentType.EquipmentCd,
          equipment_name: shopEquipmentType.EquipmentName,
          quantity: shopEquipmentType.Quantity
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
  UpdateShopEquipment: async (
    shopEquipmentType: ShopEquipmentType
  ): Promise<{ status: number; data: ShopEquipmentResponseType | null }> => {
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER_SHOP_URL}/cud/shop_equipment_proofreading/update`,
        JSON.stringify({
          id: shopEquipmentType.Id,
          shop_id: shopEquipmentType.ShopId,
          equipment_cd: shopEquipmentType.EquipmentCd,
          equipment_name: shopEquipmentType.EquipmentName,
          quantity: shopEquipmentType.Quantity
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
  }
}

export default ShopEquipmentAPI
