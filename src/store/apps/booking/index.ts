// ** Redux Imports
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

// ** Axios Imports
import axios from 'axios'

// ** Types
import { AddEventType, EventType, FilterType } from 'src/types/apps/shopBookingTypes'

// ** Constants
import { BOOKING_STATUS, BOOKING_STATUS_FILTER_NAME, SESSION_STORAGE_KEY_KEYWORD } from '@/@core/utils/constant'
import { datetimeFormatApiDate } from '@/@core/utils/date'
import ShopBookingAPI from '@/@core/api/factoryShopBooking'

const convertFilter = (cBookingStatusCd: number): string => {
  switch (String(cBookingStatusCd)) {
    case BOOKING_STATUS.REQUEST:
      return BOOKING_STATUS_FILTER_NAME.REQUEST
    case BOOKING_STATUS.FIXED:
      return BOOKING_STATUS_FILTER_NAME.FIXED
    case BOOKING_STATUS.CANCELD:
      return BOOKING_STATUS_FILTER_NAME.CANCELD
    default:
      return ''
  }
}

// ** Fetch Events
export const fetchEvents = createAsyncThunk('appBooking/fetchEvents', async (filter: FilterType) => {
  const token = localStorage.getItem(SESSION_STORAGE_KEY_KEYWORD.TOKEN)
  const response = await ShopBookingAPI.GetWithShopId(
    token || '',
    filter.shopId,
    filter.languageCd,
    filter.startDate,
    ''
  )

  const data = { events: [] as EventType[] }
  if (response.data?.shop_bookings) {
    for (const v of response.data.shop_bookings) {
      const startDate = datetimeFormatApiDate(v.date_of_booking, v.time_of_booking)
      let endDate = datetimeFormatApiDate(v.date_of_booking, v.time_of_booking)
      if (v.end_date && v.end_time) {
        endDate = datetimeFormatApiDate(v.end_date, v.end_time)
      }
      data.events.push({
        title: v.customer_name,
        id: v.id,
        allDay: false,
        start: startDate.toISOString(),
        end: endDate.toISOString(),
        url: '',
        extendedProps: {
          calendar: convertFilter(v.booking_status_cd),
          shopBooking: v
        }
      })
    }
  }

  return data.events
})

// ** Add Event
export const addEvent = createAsyncThunk('appBooking/addEvent', async (event: AddEventType) => {
  const response = await axios.post('/apps/calendar/add-event', {
    data: {
      event
    }
  })

  return response.data.event
})

// ** Update Event
export const updateEvent = createAsyncThunk('appBooking/updateEvent', async (event: EventType) => {
  const response = await axios.post('/apps/calendar/update-event', {
    data: {
      event
    }
  })

  return response.data.event
})

// ** Delete Event
export const deleteEvent = createAsyncThunk('appBooking/deleteEvent', async (id: number | string) => {
  const response = await axios.delete('/apps/calendar/remove-event', {
    params: { id }
  })

  return response.data
})

export const appBookingSlice = createSlice({
  name: 'appBooking',
  initialState: {
    events: [] as EventType[],
    initialEvents: [] as EventType[],
    selectedEvent: null,
    selectedCalendars: ['Request', 'Fixed']
  },
  reducers: {
    handleSelectEvent: (state, action) => {
      state.selectedEvent = action.payload
    },
    handleCalendarsUpdate: (state, action) => {
      const filterIndex = state.selectedCalendars.findIndex(i => i === action.payload)
      if (state.selectedCalendars.includes(action.payload)) {
        state.selectedCalendars.splice(filterIndex, 1)
      } else {
        state.selectedCalendars.push(action.payload)
      }

      if (state.selectedCalendars.length === 0) {
        state.events.length = 0
      }
    },
    handleAllCalendars: (state, action) => {
      const value = action.payload
      if (value === true) {
        state.selectedCalendars = ['Request', 'Fixed', 'Canceled']
      } else {
        state.selectedCalendars = []
      }
    }
  },
  extraReducers: builder => {
    builder.addCase(fetchEvents.fulfilled, (state, action) => {
      const events = [] as EventType[]
      for (const event of action.payload) {
        if (state.selectedCalendars.includes(event.extendedProps.calendar || '')) {
          events.push(event)
        }
      }
      state.events = events
    })
  }
})
export const { handleSelectEvent, handleCalendarsUpdate, handleAllCalendars } = appBookingSlice.actions

export default appBookingSlice.reducer
