import { renderHook, act } from '@testing-library/react-hooks'
import TellCountryCdService from '../TellCountryCdService'
import tellTellCountryCdServiceInitSuccess from './json/TellCountryCdServiceInitSuccess.json'

// eslint-disable-next-line @typescript-eslint/no-var-requires
const useRouter = jest.spyOn(require('next/router'), 'useRouter')

describe('ShopEquipmentService', () => {
  beforeEach(() => {
    useRouter.mockImplementation(() => ({
      locale: 'en'
    }))
  })

  test('init', async () => {
    const { tellCountryCd, FetchTellCountryCd } = renderHook(() => TellCountryCdService()).result.current
    await act(async () => FetchTellCountryCd('1'))
    const f = tellCountryCd
    f.map((v, i) => {
      expect(v.language_cd).toBe(tellTellCountryCdServiceInitSuccess[i].language_cd)
      expect(v.tell_country_cd).toBe(tellTellCountryCdServiceInitSuccess[i].tell_country_cd)
      expect(v.country_name).toBe(tellTellCountryCdServiceInitSuccess[i].country_name)
      expect(v.country_no).toBe(tellTellCountryCdServiceInitSuccess[i].country_no)
    })
  })
})
