import { renderHook, act } from '@testing-library/react-hooks'
import ShopEquipmentCdService from '../shopEquipmentCdService'
import shopEquipmentCdServiceInitSuccess from './json/shopEquipmentCdServiceInitSuccess.json'

// eslint-disable-next-line @typescript-eslint/no-var-requires
const useRouter = jest.spyOn(require('next/router'), 'useRouter')

describe('ShopEquipmentService', () => {
  beforeEach(() => {
    useRouter.mockImplementation(() => ({
      locale: 'en'
    }))
  })

  test('init', async () => {
    const { shopEquipmentCd, FetchEquipmentCd } = renderHook(() => ShopEquipmentCdService()).result.current
    await act(async () => FetchEquipmentCd('1'))
    const f = shopEquipmentCd
    f.map((v, i) => {
      expect(v.language_cd).toBe(shopEquipmentCdServiceInitSuccess[i].language_cd)
      expect(v.shop_equipment_cd).toBe(shopEquipmentCdServiceInitSuccess[i].shop_equipment_cd)
      expect(v.shop_equipment_name).toBe(shopEquipmentCdServiceInitSuccess[i].shop_equipment_name)
      expect(v.unit_name).toBe(shopEquipmentCdServiceInitSuccess[i].unit_name)
    })
  })
})
