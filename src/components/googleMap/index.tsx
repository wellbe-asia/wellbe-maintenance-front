'use client'

import { AreaType } from '@/@core/api/type/cArea'
import { useRef, useEffect, useState, Dispatch, SetStateAction } from 'react'

declare global {
  interface Window {
    google: typeof google
  }
}

type Props = {
  setArea: Dispatch<SetStateAction<AreaType>>
}

export default function MapWithSearchBox(props: Props) {
  const mapRef = useRef<HTMLDivElement | null>(null)
  const [map, setMap] = useState<google.maps.Map | null>(null)
  const [err, setErr] = useState('')
  useEffect(() => {
    if (typeof window === 'undefined') return

    const initMap = () => {
      const center = { lat: 35.6895, lng: 139.6917 } // Tokyo
      const map = new window.google.maps.Map(mapRef.current!, {
        center,
        zoom: 10
      })
      setMap(map)
      const input = document.getElementById('search-box') as HTMLInputElement
      const autocomplete = new window.google.maps.places.Autocomplete(input)
      autocomplete.bindTo('bounds', map)
      autocomplete.addListener('place_changed', () => {
        const place = autocomplete.getPlace()
        if (!place.geometry || !place.geometry.location) {
          setErr('場所の情報が取得できませんでした')

          return
        }

        // fallback: 中心位置＋ズーム
        map.setCenter(place.geometry.location)
        map.setZoom(14)
        if (place.geometry.viewport) {
          const bounds = place.geometry.viewport.toJSON()

          console.log('Bounds:', bounds.north)
          props.setArea(prev => {
            return {
              ...prev,
              north_latitude: bounds.north,
              west_longitude: bounds.west,
              east_longitude: bounds.east,
              south_latitude: bounds.south
            }
          })
        }
        setMap(map)

        // 保存処理（省略可）
      })

      autocomplete.addListener('place_changed', () => {
        const place = autocomplete.getPlace()
        if (!place.geometry || !place.geometry.viewport) return

        //map.fitBounds(place.geometry.location)
      })
    }

    if (!map) initMap()
  }, [])

  return (
    <div>
      <input id='search-box' type='text' placeholder='地域を検索' className='border p-2 mb-2 w-full' />
      <div ref={mapRef} style={{ height: '500px', width: '100%' }} />
      <p style={{ color: 'red' }}>{err}</p>
    </div>
  )
}
