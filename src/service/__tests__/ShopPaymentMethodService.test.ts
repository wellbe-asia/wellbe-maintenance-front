import { DEFAULT_SESSION_STORAGE, SESSION_STORAGE_KEY_KEYWORD } from '@/@core/utils/constant'
import { renderHook, act } from '@testing-library/react-hooks'
import ShopPaymentMethodService from '../ShopPaymentMethodService'
import shopPaymentMethodServiceInitSuccess from './json/shopPaymentMethodServiceInitSuccess.json'
import shopPaymentMethodServiceInitError from './json/shopPaymentMethodServiceInitError.json'
import useLocalStorage from '@/@core/hooks/useLocalStorage'

// eslint-disable-next-line @typescript-eslint/no-var-requires
const useRouter = jest.spyOn(require('next/router'), 'useRouter')

describe('ShopPaymentMethodService', () => {
  beforeEach(() => {
    useRouter.mockImplementation(() => ({
      locale: 'en'
    }))
  })

  test('init', async () => {
    const { Form, Init } = renderHook(() => ShopPaymentMethodService()).result.current
    await act(async () => Init('11'))
    const f = Form.getValues()
    f.ShopPaymentMethods.map((v, i) => {
      expect(v.Id).toBe(shopPaymentMethodServiceInitSuccess[i].id)
      expect(v.ShopId).toBe(shopPaymentMethodServiceInitSuccess[i].shop_id)
      expect(v.PaymentMethodCd).toBe(shopPaymentMethodServiceInitSuccess[i].payment_method_cd)
    })
  })

  test('create', async () => {
    const { Init, Create, FieldArray } = renderHook(() => ShopPaymentMethodService()).result.current
    const { append } = FieldArray
    await act(async () => Init('11'))
    act(() =>
      append({
        Id: '1',
        ShopId: '1',
        PaymentMethodCd: '1'
      })
    )
    act(() =>
      append({
        Id: '2',
        ShopId: '2',
        PaymentMethodCd: '2'
      })
    )
    const messages = await Create()
    expect(messages.length).toBe(0)
  })

  test('delete', async () => {
    const { Init, Delete } = renderHook(() => ShopPaymentMethodService()).result.current
    await act(async () => Init('11'))
    const messages = await Delete(0)
    expect(messages.length).toBe(0)
  })
})

describe('ShopPaymentMethodService Error', () => {
  beforeEach(() => {
    const [, setShopId] = renderHook(() =>
      useLocalStorage(SESSION_STORAGE_KEY_KEYWORD.SHOPID, DEFAULT_SESSION_STORAGE.SHOPID)
    ).result.current
    act(() => setShopId('10'))
    const [, setTokenId] = renderHook(() =>
      useLocalStorage(SESSION_STORAGE_KEY_KEYWORD.TOKEN, DEFAULT_SESSION_STORAGE.TOKEN)
    ).result.current
    act(() => setTokenId('ERROR'))
    useRouter.mockImplementation(() => ({
      locale: 'en'
    }))
  })
  test('init error', async () => {
    const { Form, Init } = renderHook(() => ShopPaymentMethodService()).result.current
    await act(async () => Init('11'))
    const f = Form.getValues()
    f.ShopPaymentMethods.map((v, i) => {
      expect(v.Id).toBe(shopPaymentMethodServiceInitError[i].id)
      expect(v.ShopId).toBe(shopPaymentMethodServiceInitError[i].shop_id)
      expect(v.PaymentMethodCd).toBe(shopPaymentMethodServiceInitError[i].payment_method_cd)
    })
  })

  test('create error', async () => {
    const { Init, Create, FieldArray } = renderHook(() => ShopPaymentMethodService()).result.current
    const { append } = FieldArray
    await act(async () => Init('11'))
    act(() =>
      append({
        Id: '1',
        ShopId: '1',
        PaymentMethodCd: '1'
      })
    )
    act(() =>
      append({
        Id: '2',
        ShopId: '2',
        PaymentMethodCd: '2'
      })
    )
    const messages = await Create()
    expect(messages.length).toBe(1)
  })

  test('delete error', async () => {
    const { Init, Delete } = renderHook(() => ShopPaymentMethodService()).result.current
    await act(async () => Init('11'))
    const messages = await Delete(0)
    expect(messages.length).toBe(1)
  })
})
