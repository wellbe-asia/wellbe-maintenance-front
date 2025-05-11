import axios from '../BaseAxios'
import { AreaReaponseType, AreaType } from '../type/cArea'

const CAccountGroupAPI = {
  CreateCArea: async (cArea: AreaType): Promise<{ status: number; data: AreaReaponseType }> => {
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER_COMMON_URL}/c_area/create_based_language`,
        JSON.stringify(stringifyArea(cArea)),
        {
          headers: {
            'Content-Type': 'application/json',
            Wellbe_Apikey: process.env.NEXT_PUBLIC_API_KEY_COMMON_MAINTENANCE
          }
        }
      )

      return response
    } catch (error: any) {
      return error
    }
  },
  UpdateCArea: async (cArea: AreaType): Promise<{ status: number; data: AreaReaponseType }> => {
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER_COMMON_URL}/c_area/update_based_language`,
        JSON.stringify(stringifyArea(cArea)),
        {
          headers: {
            'Content-Type': 'application/json',
            Wellbe_Apikey: process.env.NEXT_PUBLIC_API_KEY_COMMON_MAINTENANCE
          }
        }
      )

      return response
    } catch (error: any) {
      return error
    }
  },
  GetCareasWithLanguage: async (languageCd: string): Promise<{ status: number; data: AreaReaponseType }> => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_SERVER_COMMON_URL}/c_areas/language_cd?language_cd=${languageCd}`,
        {
          headers: {
            'Content-Type': 'application/json',
            Wellbe_Apikey: process.env.NEXT_PUBLIC_API_KEY_WITHOUT_LOGIN
          }
        }
      )

      return response
    } catch (error: any) {
      return error
    }
  },
  GetCareasWithKey: async (areaCd: string, languageCd: string): Promise<{ status: number; data: AreaReaponseType }> => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_SERVER_COMMON_URL}/c_areas/key?area_cd=${areaCd}&language_cd=${languageCd}`,
        {
          headers: {
            'Content-Type': 'application/json',
            Wellbe_Apikey: process.env.NEXT_PUBLIC_API_KEY_WITHOUT_LOGIN
          }
        }
      )

      return response
    } catch (error: any) {
      return error
    }
  }
}

export default CAccountGroupAPI

const stringifyArea = (area: AreaType): Record<keyof AreaType, string> => {
  const result: Record<keyof AreaType, string> = {} as any

  for (const key in area) {
    if (Object.prototype.hasOwnProperty.call(area, key)) {
      const value = area[key as keyof AreaType]
      result[key as keyof AreaType] = String(value)
    }
  }

  return result
}
