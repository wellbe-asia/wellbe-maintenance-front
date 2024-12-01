import { renderHook, act } from '@testing-library/react-hooks'
import StateCdService from '../StateCdService'
import stateCdServiceInitSuccess from './json/stateCdServiceInitSuccess.json'

// eslint-disable-next-line @typescript-eslint/no-var-requires
const useRouter = jest.spyOn(require('next/router'), 'useRouter')

describe('ShopEquipmentService', () => {
  beforeEach(() => {
    useRouter.mockImplementation(() => ({
      locale: 'en'
    }))
  })

  test('init', async () => {
    const { stateCd, FetchStateCd } = renderHook(() => StateCdService()).result.current
    await act(async () => FetchStateCd('1', '1'))
    const f = stateCd
    f.map((v, i) => {
      expect(v.language_cd).toBe(stateCdServiceInitSuccess[i].language_cd)
      expect(v.state_cd).toBe(stateCdServiceInitSuccess[i].state_cd)
      expect(v.state_cd_iso).toBe(stateCdServiceInitSuccess[i].state_cd_iso)
      expect(v.state_name).toBe(stateCdServiceInitSuccess[i].state_name)
    })
  })
})
