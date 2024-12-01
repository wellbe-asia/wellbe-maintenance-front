import { DEFAULT_SESSION_STORAGE, SESSION_STORAGE_KEY_KEYWORD } from '@/@core/utils/constant'
import { renderHook, act } from '@testing-library/react-hooks'
import ShopLocationService from '../ShopLocationService'
import shopLocationServiceInitSuccess from './json/shopLocationServiceInitSuccess.json'
import shopLocationServiceInitError from './json/shopLocationServiceInitError.json'
import useLocalStorage from '@/@core/hooks/useLocalStorage'

// eslint-disable-next-line @typescript-eslint/no-var-requires
const useRouter = jest.spyOn(require('next/router'), 'useRouter')

describe('ShopLocationService', () => {
  beforeEach(() => {
    useRouter.mockImplementation(() => ({
      locale: 'en'
    }))
  })

  test('init', async () => {
    const { Form, Init } = renderHook(() => ShopLocationService()).result.current
    await act(async () => Init('10'))
    const f = Form.getValues()
    f.ShopLocations.map((v, i) => {
      expect(v.Id).toBe(shopLocationServiceInitSuccess[i].id)
      expect(v.ShopId).toBe(shopLocationServiceInitSuccess[i].shop_id)
      expect(v.CountryCd).toBe(shopLocationServiceInitSuccess[i].country_cd)
      expect(v.StateCd).toBe(shopLocationServiceInitSuccess[i].state_cd)
      expect(v.Address1).toBe(shopLocationServiceInitSuccess[i].address1)
      expect(v.Address2).toBe(shopLocationServiceInitSuccess[i].address2)
      expect(v.Address3).toBe(shopLocationServiceInitSuccess[i].address3)
      expect(v.Latitude).toBe(shopLocationServiceInitSuccess[i].latitude)
      expect(v.Longitude).toBe(shopLocationServiceInitSuccess[i].longitude)
    })
  })

  test('create', async () => {
    const { Init, Create, FieldArray } = renderHook(() => ShopLocationService()).result.current
    const { append } = FieldArray
    await act(async () => Init('10'))
    act(() =>
      append({
        Id: '1',
        ShopId: '1',
        CountryCd: '1',
        StateCd: '1',
        Address1: 'dummy',
        Address2: 'dummy',
        Address3: 'dummy',
        Latitude: '1',
        Longitude: '1'
      })
    )
    act(() =>
      append({
        Id: '2',
        ShopId: '2',
        CountryCd: '2',
        StateCd: '2',
        Address1: 'dummy',
        Address2: 'dummy',
        Address3: 'dummy',
        Latitude: '2',
        Longitude: '2'
      })
    )
    const messages = await Create()
    expect(messages.length).toBe(0)
  })

  test('delete', async () => {
    const { Init, Delete } = renderHook(() => ShopLocationService()).result.current
    await act(async () => Init('10'))
    const messages = await Delete()
    expect(messages.length).toBe(0)
  })
})

describe('ShopLocationService Error', () => {
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
    const { Form, Init } = renderHook(() => ShopLocationService()).result.current
    await act(async () => Init('10'))
    const f = Form.getValues()
    f.ShopLocations.map((v, i) => {
      expect(v.Id).toBe(shopLocationServiceInitError[i].id)
      expect(v.ShopId).toBe(shopLocationServiceInitError[i].shop_id)
      expect(v.CountryCd).toBe(shopLocationServiceInitError[i].country_cd)
      expect(v.StateCd).toBe(shopLocationServiceInitError[i].state_cd)
      expect(v.Address1).toBe(shopLocationServiceInitError[i].address1)
      expect(v.Address2).toBe(shopLocationServiceInitError[i].address2)
      expect(v.Address3).toBe(shopLocationServiceInitError[i].address3)
      expect(v.Latitude).toBe(shopLocationServiceInitError[i].latitude)
      expect(v.Longitude).toBe(shopLocationServiceInitError[i].longitude)
    })
  })

  test('create error', async () => {
    const { Init, Create, FieldArray } = renderHook(() => ShopLocationService()).result.current
    const { append } = FieldArray
    await act(async () => Init('10'))
    act(() =>
      append({
        Id: '1',
        ShopId: '1',
        CountryCd: '1',
        StateCd: '1',
        Address1: 'dummy',
        Address2: 'dummy',
        Address3: 'dummy',
        Latitude: '1',
        Longitude: '1'
      })
    )
    act(() =>
      append({
        Id: '2',
        ShopId: '2',
        CountryCd: '2',
        StateCd: '2',
        Address1: 'dummy',
        Address2: 'dummy',
        Address3: 'dummy',
        Latitude: '2',
        Longitude: '2'
      })
    )
    const messages = await Create()
    expect(messages.length).toBe(1)
  })

  test('delete error', async () => {
    const { Init, Delete } = renderHook(() => ShopLocationService()).result.current
    await act(async () => Init('10'))
    const messages = await Delete()
    expect(messages.length).toBe(1)
  })
})
