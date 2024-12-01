import { DEFAULT_SESSION_STORAGE, SESSION_STORAGE_KEY_KEYWORD } from '@/@core/utils/constant'
import { renderHook, act } from '@testing-library/react-hooks'
import ShopContactService from '../ShopContactService'
import shopContactServiceInitSuccess from './json/shopContactServiceInitSuccess.json'
import shopContactServiceInitError from './json/shopContactServiceInitError.json'
import useLocalStorage from '@/@core/hooks/useLocalStorage'

// eslint-disable-next-line @typescript-eslint/no-var-requires
const useRouter = jest.spyOn(require('next/router'), 'useRouter')

describe('ShopContactService', () => {
  beforeEach(() => {
    useRouter.mockImplementation(() => ({
      locale: 'en'
    }))
  })

  test('init', async () => {
    const { Form, Init } = renderHook(() => ShopContactService()).result.current
    await act(async () => Init('10'))
    const f = Form.getValues()
    f.ShopContacts.map((v, i) => {
      expect(v.Id).toBe(shopContactServiceInitSuccess[i].id)
      expect(v.ShopId).toBe(shopContactServiceInitSuccess[i].shop_id)
      expect(v.ShopTellCountryNo).toBe(shopContactServiceInitSuccess[i].shop_tell_country_no)
      expect(v.ShopTellNo).toBe(shopContactServiceInitSuccess[i].shop_tell_no)
      expect(v.ShopEmailAddress).toBe(shopContactServiceInitSuccess[i].shop_email_address)
    })
  })

  test('create', async () => {
    const { Init, Create, FieldArray } = renderHook(() => ShopContactService()).result.current
    const { append } = FieldArray
    await act(async () => Init('10'))
    act(() =>
      append({
        Id: '1',
        ShopId: '1',
        ShopTellCountryNo: '1',
        ShopTellNo: '1',
        ShopEmailAddress: '1'
      })
    )
    act(() =>
      append({
        Id: '2',
        ShopId: '2',
        ShopTellCountryNo: '2',
        ShopTellNo: '2',
        ShopEmailAddress: '2'
      })
    )
    const messages = await Create()
    expect(messages.length).toBe(0)
  })

  test('delete', async () => {
    const { Init, Delete } = renderHook(() => ShopContactService()).result.current
    await act(async () => Init('10'))
    const messages = await Delete(0)
    expect(messages.length).toBe(0)
  })
})

describe('ShopContactService Error', () => {
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
    const { Form, Init } = renderHook(() => ShopContactService()).result.current
    await act(async () => Init('10'))
    const f = Form.getValues()
    f.ShopContacts.map((v, i) => {
      expect(v.Id).toBe(shopContactServiceInitError[i].id)
      expect(v.ShopId).toBe(shopContactServiceInitError[i].shop_id)
      expect(v.ShopTellCountryNo).toBe(shopContactServiceInitError[i].shop_tell_country_no)
      expect(v.ShopTellNo).toBe(shopContactServiceInitError[i].shop_tell_no)
      expect(v.ShopEmailAddress).toBe(shopContactServiceInitError[i].shop_email_address)
    })
  })

  test('update error', async () => {
    const { Init, Create, FieldArray } = renderHook(() => ShopContactService()).result.current
    const { append } = FieldArray
    await act(async () => Init('10'))
    act(() =>
      append({
        Id: '1',
        ShopId: '1',
        ShopTellCountryNo: '1',
        ShopTellNo: '1',
        ShopEmailAddress: '1'
      })
    )
    act(() =>
      append({
        Id: '2',
        ShopId: '2',
        ShopTellCountryNo: '2',
        ShopTellNo: '2',
        ShopEmailAddress: '2'
      })
    )
    const messages = await Create()
    expect(messages.length).toBe(1)
  })

  test('delete error', async () => {
    const { Init, Delete } = renderHook(() => ShopContactService()).result.current
    await act(async () => Init('10'))
    const messages = await Delete(0)
    expect(messages.length).toBe(1)
  })
})
