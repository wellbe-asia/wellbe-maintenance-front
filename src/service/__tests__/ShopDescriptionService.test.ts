import { DEFAULT_SESSION_STORAGE, SESSION_STORAGE_KEY_KEYWORD } from '@/@core/utils/constant'
import { renderHook, act } from '@testing-library/react-hooks'
import ShopDescriptionService from '../ShopDescriptionService'
import shopDescriptionServiceInitSuccess from './json/shopDescriptionServiceInitSuccess.json'
import shopDescriptionServiceInitError from './json/shopDescriptionServiceInitError.json'
import useLocalStorage from '@/@core/hooks/useLocalStorage'

// eslint-disable-next-line @typescript-eslint/no-var-requires
const useRouter = jest.spyOn(require('next/router'), 'useRouter')

describe('ShopDescriptionService', () => {
  beforeEach(() => {
    useRouter.mockImplementation(() => ({
      locale: 'en'
    }))
  })

  test('init', async () => {
    const { Form, Init } = renderHook(() => ShopDescriptionService()).result.current
    await act(async () => Init('10', '11'))
    const f = Form.getValues()
    f.ShopDescriptions.map((v, i) => {
      expect(v.Id).toBe(shopDescriptionServiceInitSuccess[i].id)
      expect(v.ShopId).toBe(shopDescriptionServiceInitSuccess[i].shop_id)
      expect(v.LanguageCd).toBe(shopDescriptionServiceInitSuccess[i].language_cd)
      expect(v.ShopName).toBe(shopDescriptionServiceInitSuccess[i].shop_name)
    })
  })

  test('create', async () => {
    const { Init, Create, FieldArray } = renderHook(() => ShopDescriptionService()).result.current
    const { append } = FieldArray
    await act(async () => Init('10', '11'))
    act(() =>
      append({
        Id: '1',
        ShopId: '1',
        LanguageCd: '11',
        ShopName: '11'
      })
    )
    act(() =>
      append({
        Id: '2',
        ShopId: '2',
        LanguageCd: '12',
        ShopName: '12'
      })
    )
    const messages = await Create()
    expect(messages.length).toBe(0)
  })

  test('delete', async () => {
    const { Init, Delete } = renderHook(() => ShopDescriptionService()).result.current
    await act(async () => Init('10', '11'))
    const messages = await Delete(0)
    expect(messages.length).toBe(0)
  })
})

describe('ShopDescriptionService Error', () => {
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
    const { Form, Init } = renderHook(() => ShopDescriptionService()).result.current
    await act(async () => Init('10', '11'))
    const f = Form.getValues()
    f.ShopDescriptions.map((v, i) => {
      expect(v.Id).toBe(shopDescriptionServiceInitError[i].id)
      expect(v.ShopId).toBe(shopDescriptionServiceInitError[i].shop_id)
      expect(v.LanguageCd).toBe(shopDescriptionServiceInitError[i].language_cd)
      expect(v.ShopName).toBe(shopDescriptionServiceInitError[i].shop_name)
    })
  })

  test('create error', async () => {
    const { Init, Create, FieldArray } = renderHook(() => ShopDescriptionService()).result.current
    const { append } = FieldArray
    await act(async () => Init('10', '11'))
    act(() =>
      append({
        Id: '1',
        ShopId: '1',
        LanguageCd: '11',
        ShopName: '11'
      })
    )
    act(() =>
      append({
        Id: '2',
        ShopId: '2',
        LanguageCd: '12',
        ShopName: '12'
      })
    )
    const messages = await Create()
    expect(messages.length).toBe(1)
  })

  test('delete error', async () => {
    const { Init, Delete } = renderHook(() => ShopDescriptionService()).result.current
    await act(async () => Init('10', '11'))
    const messages = await Delete(0)
    expect(messages.length).toBe(1)
  })
})
