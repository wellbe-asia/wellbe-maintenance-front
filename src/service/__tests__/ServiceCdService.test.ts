import { renderHook, act } from '@testing-library/react-hooks'
import ServiceCdService from '../ServiceCdService'
import serviceCdServiceInitSuccess from './json/serviceCdServiceInitSuccess.json'

// eslint-disable-next-line @typescript-eslint/no-var-requires
const useRouter = jest.spyOn(require('next/router'), 'useRouter')

describe('ShopEquipmentService', () => {
  beforeEach(() => {
    useRouter.mockImplementation(() => ({
      locale: 'en'
    }))
  })

  test('init', async () => {
    const { serviceCd, FetchServiceCd } = renderHook(() => ServiceCdService()).result.current
    await act(async () => FetchServiceCd('1'))
    const f = serviceCd
    f.map((v, i) => {
      expect(v.language_cd).toBe(serviceCdServiceInitSuccess[i].language_cd)
      expect(v.service_cd).toBe(serviceCdServiceInitSuccess[i].service_cd)
      expect(v.service_name).toBe(serviceCdServiceInitSuccess[i].service_name)
    })
  })
})
