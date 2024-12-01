import { renderHook, act } from '@testing-library/react-hooks'
import PaymentMethodCdService from '../PaymentMethodCdService'
import paymentMethodCdServiceInitSuccess from './json/paymentMethodCdServiceInitSuccess.json'

// eslint-disable-next-line @typescript-eslint/no-var-requires
const useRouter = jest.spyOn(require('next/router'), 'useRouter')

describe('ShopEquipmentService', () => {
  beforeEach(() => {
    useRouter.mockImplementation(() => ({
      locale: 'en'
    }))
  })

  test('init', async () => {
    const { paymentMethodCd, FetchPaymentMethodCd } = renderHook(() => PaymentMethodCdService()).result.current
    await act(async () => FetchPaymentMethodCd('1'))
    const f = paymentMethodCd
    f.map((v, i) => {
      expect(v.language_cd).toBe(paymentMethodCdServiceInitSuccess[i].language_cd)
      expect(v.payment_method_cd).toBe(paymentMethodCdServiceInitSuccess[i].payment_method_cd)
      expect(v.payment_name).toBe(paymentMethodCdServiceInitSuccess[i].payment_name)
    })
  })
})
