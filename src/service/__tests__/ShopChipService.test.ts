import { DEFAULT_SESSION_STORAGE, SESSION_STORAGE_KEY_KEYWORD } from '@/@core/utils/constant'
import { renderHook, act } from '@testing-library/react-hooks'
import ShopChipService from '../ShopChipService'
import shopChipServiceInitSuccess from './json/shopChipServiceInitSuccess.json'
import shopChipServiceInitError from './json/shopChipServiceInitError.json'
import useLocalStorage from '@/@core/hooks/useLocalStorage'

// eslint-disable-next-line @typescript-eslint/no-var-requires
const useRouter = jest.spyOn(require('next/router'), 'useRouter')

describe('ShopChipService', () => {
  beforeEach(() => {
    useRouter.mockImplementation(() => ({
      locale: 'en'
    }))
  })

  test('init', async () => {
    const { Form, Init } = renderHook(() => ShopChipService()).result.current
    await act(async () => Init('10'))
    const f = Form.getValues()
    f.ShopChips.map((v, i) => {
      expect(v.Id).toBe(shopChipServiceInitSuccess[i].id)
      expect(v.ShopId).toBe(shopChipServiceInitSuccess[i].shop_id)
      expect(v.CurrencyCd).toBe(shopChipServiceInitSuccess[i].currency_cd)
      expect(v.NeedShopChip).toBe(shopChipServiceInitSuccess[i].need_shop_chip)
      expect(v.ShopChipStandardAmmount).toBe(shopChipServiceInitSuccess[i].shop_chip_standard_ammount)
    })
  })

  test('create', async () => {
    const { Init, Create, FieldArray } = renderHook(() => ShopChipService()).result.current
    const { append } = FieldArray
    await act(async () => Init('10'))
    act(() =>
      append({
        Id: '1',
        ShopId: '1',
        CurrencyCd: '1',
        NeedShopChip: true,
        ShopChipStandardAmmount: '1'
      })
    )
    act(() =>
      append({
        Id: '2',
        ShopId: '2',
        CurrencyCd: '2',
        NeedShopChip: true,
        ShopChipStandardAmmount: '2'
      })
    )
    const messages = await Create()
    expect(messages.length).toBe(0)
  })

  test('delete', async () => {
    const { Init, Delete } = renderHook(() => ShopChipService()).result.current
    await act(async () => Init('10'))
    const messages = await Delete(0)
    expect(messages.length).toBe(0)
  })
})

describe('ShopChipService Error', () => {
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
    const { Form, Init } = renderHook(() => ShopChipService()).result.current
    await act(async () => Init('10'))
    const f = Form.getValues()
    f.ShopChips.map((v, i) => {
      expect(v.Id).toBe(shopChipServiceInitError[i].id)
      expect(v.ShopId).toBe(shopChipServiceInitError[i].shop_id)
      expect(v.CurrencyCd).toBe(shopChipServiceInitError[i].currency_cd)
      expect(v.NeedShopChip).toBe(shopChipServiceInitError[i].need_shop_chip)
      expect(v.ShopChipStandardAmmount).toBe(shopChipServiceInitError[i].shop_chip_standard_ammount)
    })
  })

  test('create error', async () => {
    const { Init, Create, FieldArray } = renderHook(() => ShopChipService()).result.current
    const { append } = FieldArray
    await act(async () => Init('10'))
    act(() =>
      append({
        Id: '1',
        ShopId: '1',
        CurrencyCd: '1',
        NeedShopChip: true,
        ShopChipStandardAmmount: '1'
      })
    )
    act(() =>
      append({
        Id: '2',
        ShopId: '2',
        CurrencyCd: '2',
        NeedShopChip: true,
        ShopChipStandardAmmount: '2'
      })
    )
    const messages = await Create()
    expect(messages.length).toBe(1)
  })

  test('delete error', async () => {
    const { Init, Delete } = renderHook(() => ShopChipService()).result.current
    await act(async () => Init('10'))
    const messages = await Delete(0)
    expect(messages.length).toBe(1)
  })
})
