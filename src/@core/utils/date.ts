import dayjs, { Dayjs } from 'dayjs'

export const dateFormatDisplay = (date: Date): string => {
  const year = date.getFullYear().toString()
  const month = (date.getMonth() + 1).toString().padStart(2, '0')
  const day = date.getDate().toString().padStart(2, '0')

  return `${year}/${month}/${day}`
}

export const datejsFormatDisplay = (date: Dayjs): string => {
  const timeFormat = 'HH:mm'
  const formattedTime = date.format(timeFormat)

  return formattedTime
}

export const dateFormatApi = (date: Date): string => {
  const year = date.getFullYear().toString()
  const month = (date.getMonth() + 1).toString().padStart(2, '0')
  const day = date.getDate().toString().padStart(2, '0')

  return `${year}${month}${day}`
}

export const dateFormatApi2Date = (dateString: string): Date => {
  const year = parseInt(dateString.substring(0, 4), 10)
  const month = parseInt(dateString.substring(4, 6), 10) - 1 // 0-indexed month
  const day = parseInt(dateString.substring(6, 8), 10)

  const date = new Date(year, month, day)

  return date
}

export const datetimeFormatApiDate = (dayStr: string, timeStr: string): Date => {
  const year = parseInt(dayStr.substring(0, 4), 10)
  const month = parseInt(dayStr.substring(4, 6), 10) - 1 // 0-indexed month
  const day = parseInt(dayStr.substring(6, 8), 10)
  const hour = parseInt(timeStr.substring(0, 2), 10)
  const min = parseInt(timeStr.substring(3, 5), 10)

  const date = new Date(year, month, day, hour, min)

  return date
}

export const datetimeFormatApi2Dayjs = (dayStr: string, timeStr: string): Dayjs => {
  const dateString: string = dayStr + ' ' + timeStr
  const formattedDate: dayjs.Dayjs = dayjs(dateString, 'YYYYMMDD HH:mm')

  return formattedDate
}

export const calculateDateWithDateFormatApi = (dateString: string, calcDay: number): string => {
  const year = parseInt(dateString.substring(0, 4), 10)
  const month = parseInt(dateString.substring(4, 6), 10) - 1 // 0-indexed month
  const day = parseInt(dateString.substring(6, 8), 10)

  const date = new Date(year, month, day)
  date.setDate(date.getDate() + calcDay)

  return dateFormatApi(date)
}

export const dateFormatApi2AAA = (dateString: string): string => {
  const year = parseInt(dateString.substring(0, 4), 10)
  const month = parseInt(dateString.substring(4, 6), 10) - 1 // 0-indexed month
  const day = parseInt(dateString.substring(6, 8), 10)

  const date = new Date(year, month, day)

  const options: Intl.DateTimeFormatOptions = { weekday: 'short' }
  const formatter: Intl.DateTimeFormat = new Intl.DateTimeFormat('en-US', options)
  const abbreviatedDayOfWeek: string = formatter.format(date)

  return abbreviatedDayOfWeek
}

export const dateFormatApi2DisplayYYYYMM = (dateString: string): string => {
  if (dateString != undefined && dateString.length >= 6) {
    const year = dateString.substring(0, 4)
    const month = dateString.substring(4, 6)

    return `${year}/${month}`
  }

  return ''
}

export const dateFormatApi2DisplayYYYYMMDD = (dateString: string): string => {
  if (dateString != undefined && dateString.length == 8) {
    const year = dateString.substring(0, 4)
    const month = dateString.substring(4, 6)
    const day = dateString.substring(6, 8)

    return `${year}/${month}/${day}`
  }

  return ''
}
export const dateFormatApi2DisplayD = (dateString: string): string => {
  if (dateString != undefined && dateString.length == 8) {
    const day = parseInt(dateString.substring(6, 8), 10)

    return `${day}`
  }

  return ''
}

export const getWeekday = (date: Date): string => {
  const daysOfWeek = ['1', '2', '3', '4', '5', '6', '7']
  const dayIndex = date.getDay()

  return daysOfWeek[dayIndex]
}

export const getCurrentDate = (): Date => {
  return new Date()
}

export const getAgoDateFromCurrentDate = (date: number): Date => {
  // 今日の日付を取得
  const today = getCurrentDate()

  // 5日前の日付を計算
  const fiveDaysAgo = new Date(today)
  fiveDaysAgo.setDate(today.getDate() - date)

  return fiveDaysAgo
}

export const getCurrentWeekday = (): string => {
  const date = getCurrentDate()
  const daysOfWeek = ['1', '2', '3', '4', '5', '6', '7']
  const dayIndex = date.getDay()

  return daysOfWeek[dayIndex]
}
export const getFirstDayOfLastMonth = (): string => {
  const today = new Date()
  const lastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1)

  return dateFormatApi(lastMonth)
}

export const dateFormatHyphen2Hyphen = (dateString: string): string => {
  if (dateString && dateString != '') {
    const year = dateString.substring(0, 4)
    const month = dateString.substring(5, 7)
    const day = dateString.substring(8, 10)

    return `${year}-${month}-${day}`
  }

  return ''
}

export const getPreviousSunday = (currentDate: Date): Date => {
  const dayOfWeek = currentDate.getDay()

  const daysUntilPreviousSunday = dayOfWeek === 0 ? 7 : dayOfWeek
  const previousSunday = new Date(currentDate)
  previousSunday.setDate(currentDate.getDate() - daysUntilPreviousSunday)

  return previousSunday
}

export const sleep = (ms: number) => new Promise(res => setTimeout(res, ms))
