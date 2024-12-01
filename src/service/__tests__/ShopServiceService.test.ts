import { DEFAULT_SESSION_STORAGE, SESSION_STORAGE_KEY_KEYWORD } from '@/@core/utils/constant'
import { renderHook, act } from '@testing-library/react-hooks'
import ShopServiceService from '../ShopServiceService'
import shopServiceServiceInitSuccess from './json/shopServiceServiceInitSuccess.json'
import shopServiceServiceInitError from './json/shopServiceServiceInitError.json'
import useLocalStorage from '@/@core/hooks/useLocalStorage'

// eslint-disable-next-line @typescript-eslint/no-var-requires
const useRouter = jest.spyOn(require('next/router'), 'useRouter')

describe('ShopServiceService', () => {
  beforeEach(() => {
    useRouter.mockImplementation(() => ({
      locale: 'en'
    }))
  })

  test('init', async () => {
    const { Form, Init } = renderHook(() => ShopServiceService()).result.current
    await act(async () => Init('10'))
    const f = Form.getValues()
    f.ShopServices.map((v, i) => {
      expect(v.Id).toBe(shopServiceServiceInitSuccess[i].id)
      expect(v.ShopId).toBe(shopServiceServiceInitSuccess[i].shop_id)
      expect(v.ServiceCd).toBe(shopServiceServiceInitSuccess[i].service_cd)
    })
  })

  test('create', async () => {
    const { Init, Create, FieldArray } = renderHook(() => ShopServiceService()).result.current
    const { append } = FieldArray
    await act(async () => Init('10'))
    act(() =>
      append({
        Id: '1',
        ShopId: '1',
        ServiceCd: '1'
      })
    )
    act(() =>
      append({
        Id: '2',
        ShopId: '2',
        ServiceCd: '2'
      })
    )
    const messages = await Create()
    expect(messages.length).toBe(0)
  })

  test('delete', async () => {
    const { Init, Delete } = renderHook(() => ShopServiceService()).result.current
    await act(async () => Init('10'))
    const messages = await Delete(0)
    expect(messages.length).toBe(0)
  })
})

describe('ShopServiceService Error', () => {
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
    const { Form, Init } = renderHook(() => ShopServiceService()).result.current
    await act(async () => Init('10'))
    const f = Form.getValues()
    f.ShopServices.map((v, i) => {
      expect(v.Id).toBe(shopServiceServiceInitError[i].id)
      expect(v.ShopId).toBe(shopServiceServiceInitError[i].shop_id)
      expect(v.ServiceCd).toBe(shopServiceServiceInitError[i].service_cd)
    })
  })

  test('create error', async () => {
    const { Init, Create, FieldArray } = renderHook(() => ShopServiceService()).result.current
    const { append } = FieldArray
    await act(async () => Init('10'))
    act(() =>
      append({
        Id: '1',
        ShopId: '1',
        ServiceCd: '1'
      })
    )
    act(() =>
      append({
        Id: '2',
        ShopId: '2',
        ServiceCd: '2'
      })
    )
    const messages = await Create()
    expect(messages.length).toBe(1)
  })

  test('delete error', async () => {
    const { Init, Delete } = renderHook(() => ShopServiceService()).result.current
    await act(async () => Init('10'))
    const messages = await Delete(0)
    expect(messages.length).toBe(1)
  })
})
