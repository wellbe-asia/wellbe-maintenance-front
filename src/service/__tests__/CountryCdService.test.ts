import { renderHook, act } from '@testing-library/react-hooks'
import CountryCdService from '../CountryCdService'
import countryCdServiceInitSuccess from './json/countryCdServiceInitSuccess.json'

// eslint-disable-next-line @typescript-eslint/no-var-requires
const useRouter = jest.spyOn(require('next/router'), 'useRouter')

describe('ShopEquipmentService', () => {
  beforeEach(() => {
    useRouter.mockImplementation(() => ({
      locale: 'en'
    }))
  })

  test('init', async () => {
    const { countryCd, FetchCountryCd } = renderHook(() => CountryCdService()).result.current
    await act(async () => FetchCountryCd('1'))
    const f = countryCd
    f.map((v, i) => {
      expect(v.language_cd).toBe(countryCdServiceInitSuccess[i].language_cd)
      expect(v.country_cd).toBe(countryCdServiceInitSuccess[i].country_cd)
      expect(v.country_cd_iso).toBe(countryCdServiceInitSuccess[i].country_cd_iso)
      expect(v.country_name).toBe(countryCdServiceInitSuccess[i].country_name)
    })
  })
})
