import { DEFAULT_SESSION_STORAGE, SESSION_STORAGE_KEY_KEYWORD } from '@/@core/utils/constant'
import { renderHook, act } from '@testing-library/react-hooks'
import ShopBussinessHourService from '../ShopBussinessHourService'
import shopBussinessHourServiceInitSuccess from './json/shopBussinessHourServiceInitSuccess.json'
import useLocalStorage from '@/@core/hooks/useLocalStorage'

// eslint-disable-next-line @typescript-eslint/no-var-requires
const useRouter = jest.spyOn(require('next/router'), 'useRouter')

describe('ShopBussinessHourService', () => {
  beforeEach(() => {
    useRouter.mockImplementation(() => ({
      locale: 'en'
    }))
  })

  test('init', async () => {
    const { Form, Init } = renderHook(() => ShopBussinessHourService()).result.current
    await act(async () => Init('1', '10'))
    const f = Form.getValues()
    f.ShopBussinessHours.map((v, i) => {
      expect(v.Id).toBe(shopBussinessHourServiceInitSuccess[i].id)
      expect(v.ShopId).toBe(shopBussinessHourServiceInitSuccess[i].shop_id)
      expect(v.WeekdayCd).toBe(shopBussinessHourServiceInitSuccess[i].weekday_cd)
      expect(v.WeekdayName).toBe(shopBussinessHourServiceInitSuccess[i].weekday_name)
      expect(v.WeekdayAbbreviation).toBe(shopBussinessHourServiceInitSuccess[i].weekday_abbreviation)
      expect(v.IsHoliday).toBe(shopBussinessHourServiceInitSuccess[i].is_holiday)
      expect(v.BussinessHoursStart).toBe(shopBussinessHourServiceInitSuccess[i].bussiness_hours_start)
      expect(v.BussinessHoursEnd).toBe(shopBussinessHourServiceInitSuccess[i].bussiness_hours_end)
    })
  })

  test('create', async () => {
    const { Init, Create, FieldArray } = renderHook(() => ShopBussinessHourService()).result.current
    const { append } = FieldArray
    await act(async () => Init('1', '10'))
    act(() =>
      append({
        Id: '1',
        ShopId: '1',
        WeekdayCd: '11',
        WeekdayName: '1',
        WeekdayAbbreviation: '1',
        IsHoliday: true,
        BussinessHoursStart: '1',
        BussinessHoursEnd: '2'
      })
    )
    act(() =>
      append({
        Id: '2',
        ShopId: '1',
        WeekdayCd: '2',
        WeekdayName: '2',
        WeekdayAbbreviation: '2',
        IsHoliday: true,
        BussinessHoursStart: '2',
        BussinessHoursEnd: '2'
      })
    )
    const messages = await Create()
    expect(messages.length).toBe(0)
  })

  test('delete', async () => {
    const { Init, Delete } = renderHook(() => ShopBussinessHourService()).result.current
    await act(async () => Init('1', '10'))
    const messages = await Delete(0)
    expect(messages.length).toBe(0)
  })
})

describe('ShopBussinessHourService Error', () => {
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
    const { Form, Init } = renderHook(() => ShopBussinessHourService()).result.current
    await act(async () => Init('1', '10'))
    const f = Form.getValues()
    f.ShopBussinessHours.map((v, i) => {
      expect(v.Id).toBe(shopBussinessHourServiceInitSuccess[i].id)
      expect(v.ShopId).toBe(shopBussinessHourServiceInitSuccess[i].shop_id)
      expect(v.WeekdayCd).toBe(shopBussinessHourServiceInitSuccess[i].weekday_cd)
      expect(v.WeekdayName).toBe(shopBussinessHourServiceInitSuccess[i].weekday_name)
      expect(v.WeekdayAbbreviation).toBe(shopBussinessHourServiceInitSuccess[i].weekday_abbreviation)
      expect(v.IsHoliday).toBe(shopBussinessHourServiceInitSuccess[i].is_holiday)
      expect(v.BussinessHoursStart).toBe(shopBussinessHourServiceInitSuccess[i].bussiness_hours_start)
      expect(v.BussinessHoursEnd).toBe(shopBussinessHourServiceInitSuccess[i].bussiness_hours_end)
    })
  })

  test('update error', async () => {
    const { Init, Create, FieldArray } = renderHook(() => ShopBussinessHourService()).result.current
    const { append } = FieldArray
    await act(async () => Init('1', '10'))
    act(() =>
      append({
        Id: '1',
        ShopId: '1',
        WeekdayCd: '11',
        WeekdayName: '1',
        WeekdayAbbreviation: '1',
        IsHoliday: true,
        BussinessHoursStart: '1',
        BussinessHoursEnd: '2'
      })
    )
    act(() =>
      append({
        Id: '2',
        ShopId: '1',
        WeekdayCd: '2',
        WeekdayName: '2',
        WeekdayAbbreviation: '2',
        IsHoliday: true,
        BussinessHoursStart: '2',
        BussinessHoursEnd: '2'
      })
    )
    const messages = await Create()
    expect(messages.length).toBe(1)
  })

  test('delete error', async () => {
    const { Init, Delete } = renderHook(() => ShopBussinessHourService()).result.current
    await act(async () => Init('1', '10'))
    const messages = await Delete(0)
    expect(messages.length).toBe(0)
  })
})
