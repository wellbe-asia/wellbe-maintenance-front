import { DEFAULT_SESSION_STORAGE, SESSION_STORAGE_KEY_KEYWORD } from '@/@core/utils/constant'
import { renderHook, act } from '@testing-library/react-hooks'
import ShopContentService from '../ShopContentService'
import shopContentServiceInitSuccess from './json/shopContentServiceInitSuccess.json'
import shopContentServiceInitError from './json/shopContentServiceInitError.json'
import useLocalStorage from '@/@core/hooks/useLocalStorage'

// eslint-disable-next-line @typescript-eslint/no-var-requires
const useRouter = jest.spyOn(require('next/router'), 'useRouter')

describe('ShopContentService', () => {
  beforeEach(() => {
    useRouter.mockImplementation(() => ({
      locale: 'en'
    }))
  })

  test('init', async () => {
    const { Form, Init } = renderHook(() => ShopContentService()).result.current
    await act(async () => Init('10'))
    const f = Form.getValues()
    f.ShopContents.map((v, i) => {
      expect(v.Id).toBe(shopContentServiceInitSuccess[i].id)
      expect(v.ShopId).toBe(shopContentServiceInitSuccess[i].shop_id)
      expect(v.ContentCategory).toBe(shopContentServiceInitSuccess[i].content_category)
      expect(v.LanguageCd).toBe(shopContentServiceInitSuccess[i].language_cd)
      expect(v.ContentTitle).toBe(shopContentServiceInitSuccess[i].content_title)
      expect(v.ContentBody).toBe(shopContentServiceInitSuccess[i].content_body)
      expect(v.SortOrder).toBe(shopContentServiceInitSuccess[i].sort_order)
    })
  })

  test('create', async () => {
    const { Init, Create, FieldArray } = renderHook(() => ShopContentService()).result.current
    const { append } = FieldArray
    await act(async () => Init('10'))
    act(() =>
      append({
        Id: '1',
        ShopId: '1',
        ContentCategory: '1',
        LanguageCd: '1',
        ContentTitle: '1',
        ContentBody: '1',
        SortOrder: '1'
      })
    )
    act(() =>
      append({
        Id: '2',
        ShopId: '2',
        ContentCategory: '2',
        LanguageCd: '2',
        ContentTitle: '2',
        ContentBody: '2',
        SortOrder: '2'
      })
    )
    const { messages } = await Create()
    expect(messages.length).toBe(0)
  })

  test('delete', async () => {
    const { Init, Delete } = renderHook(() => ShopContentService()).result.current
    await act(async () => Init('10'))
    const messages = await Delete('0')
    expect(messages.length).toBe(0)
  })
})

describe('ShopContentService Error', () => {
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
    const { Form, Init } = renderHook(() => ShopContentService()).result.current
    await act(async () => Init('10'))
    const f = Form.getValues()
    f.ShopContents.map((v, i) => {
      expect(v.Id).toBe(shopContentServiceInitError[i].id)
      expect(v.ShopId).toBe(shopContentServiceInitError[i].shop_id)
      expect(v.ContentCategory).toBe(shopContentServiceInitError[i].content_category)
      expect(v.LanguageCd).toBe(shopContentServiceInitError[i].language_cd)
      expect(v.ContentTitle).toBe(shopContentServiceInitError[i].content_title)
      expect(v.ContentBody).toBe(shopContentServiceInitError[i].content_body)
      expect(v.SortOrder).toBe(shopContentServiceInitError[i].sort_order)
    })
  })

  test('create error', async () => {
    const { Init, Create, FieldArray } = renderHook(() => ShopContentService()).result.current
    const { append } = FieldArray
    await act(async () => Init('10'))
    act(() =>
      append({
        Id: '1',
        ShopId: '1',
        ContentCategory: '1',
        LanguageCd: '1',
        ContentTitle: '1',
        ContentBody: '1',
        SortOrder: '1'
      })
    )
    act(() =>
      append({
        Id: '2',
        ShopId: '2',
        ContentCategory: '2',
        LanguageCd: '2',
        ContentTitle: '2',
        ContentBody: '2',
        SortOrder: '2'
      })
    )
    const { messages } = await Create()
    expect(messages.length).toBe(1)
  })

  test('delete error', async () => {
    const { Init, Delete } = renderHook(() => ShopContentService()).result.current
    await act(async () => Init('10'))
    const messages = await Delete('0')
    expect(messages.length).toBe(1)
  })
})
