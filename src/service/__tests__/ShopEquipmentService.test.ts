import { DEFAULT_SESSION_STORAGE, SESSION_STORAGE_KEY_KEYWORD } from '@/@core/utils/constant'
import { renderHook, act } from '@testing-library/react-hooks'
import ShopEquipmentService from '../ShopEquipmentService'
import shopEquipmentServiceInitSuccess from './json/shopEquipmentServiceInitSuccess.json'
import shopEquipmentServiceInitError from './json/shopEquipmentServiceInitError.json'
import useLocalStorage from '@/@core/hooks/useLocalStorage'

// eslint-disable-next-line @typescript-eslint/no-var-requires
const useRouter = jest.spyOn(require('next/router'), 'useRouter')

describe('ShopEquipmentService', () => {
  beforeEach(() => {
    useRouter.mockImplementation(() => ({
      locale: 'en'
    }))
  })

  test('init', async () => {
    const { Form, Init } = renderHook(() => ShopEquipmentService()).result.current
    await act(async () => Init('10'))
    const f = Form.getValues()
    f.ShopEqipments.map((v, i) => {
      expect(v.EquipmentCd).toBe(shopEquipmentServiceInitSuccess[i].EquipmentCd)
      expect(v.EquipmentName).toBe(shopEquipmentServiceInitSuccess[i].EquipmentName)
      expect(v.Id).toBe(shopEquipmentServiceInitSuccess[i].Id)
      expect(v.Quantity).toBe(shopEquipmentServiceInitSuccess[i].Quantity)
      expect(v.ShopId).toBe(shopEquipmentServiceInitSuccess[i].ShopId)
    })
  })

  test('create', async () => {
    const { Init, Create, FieldArray } = renderHook(() => ShopEquipmentService()).result.current
    const { append } = FieldArray
    await act(async () => Init('10'))
    act(() => append({ EquipmentCd: '1', EquipmentName: 'dummy', Id: '1', Quantity: '1', ShopId: '10' }))
    act(() => append({ EquipmentCd: '2', EquipmentName: 'dummy', Id: '2', Quantity: '2', ShopId: '10' }))
    const messages = await Create()
    expect(messages.length).toBe(0)
  })

  test('delete', async () => {
    const { Init, Delete } = renderHook(() => ShopEquipmentService()).result.current
    await act(async () => Init('10'))
    const messages = await Delete('0')
    expect(messages.length).toBe(0)
  })
})

describe('ShopEquipmentService Error', () => {
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
    const { Form, Init } = renderHook(() => ShopEquipmentService()).result.current
    await act(async () => Init('10'))
    const f = Form.getValues()
    f.ShopEqipments.map((v, i) => {
      expect(v.EquipmentCd).toBe(shopEquipmentServiceInitError[i].EquipmentCd)
      expect(v.EquipmentName).toBe(shopEquipmentServiceInitError[i].EquipmentName)
      expect(v.Id).toBe(shopEquipmentServiceInitError[i].Id)
      expect(v.Quantity).toBe(shopEquipmentServiceInitError[i].Quantity)
      expect(v.ShopId).toBe(shopEquipmentServiceInitError[i].ShopId)
    })
  })

  test('create error', async () => {
    const { Init, Create, FieldArray } = renderHook(() => ShopEquipmentService()).result.current
    const { append } = FieldArray
    await act(async () => Init('10'))
    act(() => append({ EquipmentCd: '1', EquipmentName: 'dummy', Id: '1', Quantity: '1', ShopId: '10' }))
    act(() => append({ EquipmentCd: '2', EquipmentName: 'dummy', Id: '2', Quantity: '2', ShopId: '10' }))
    const messages = await Create()
    expect(messages.length).toBe(1)
  })

  test('delete error', async () => {
    const { Init, Delete } = renderHook(() => ShopEquipmentService()).result.current
    await act(async () => Init('10'))
    const messages = await Delete('0')
    expect(messages.length).toBe(1)
  })
})
