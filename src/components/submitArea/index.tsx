import AreaApi from '@/@core/api/factoryArea'
import CStateAPI from '@/@core/api/factoryCState'
import { AreaType } from '@/@core/api/type/cArea'
import { StateType } from '@/@core/api/type/cState'
import ListErrors from '@/@core/components/list-errors'
import { useLocale } from '@/@core/hooks/useLocal'
import { SERVER_STATUS } from '@/@core/utils/constant'
import MapWithSearchBox from '@/components/googleMap'
import { getLanguageCdWithValue } from '@/configs/locales/locales'
import { Button, Card, CardHeader, Checkbox, Grid, MenuItem, Select, TextField, Typography } from '@mui/material'
import { Stack } from '@mui/system'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'

type Props = {
  areaCd?: number
}

export default function SubmitArea(props: Props) {
  const { t } = useLocale()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<string[]>([])
  const [area, setArea] = useState<AreaType>({ summary_area_flg: false } as AreaType)
  const [states, setStates] = useState<StateType[]>([])
  useEffect(() => {
    Init()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.locale])
  const Init = async () => {
    if (router.locale) {
      const languageCd = getLanguageCdWithValue(router.locale)
      setArea(prev => {
        return { ...prev, language_cd: Number(languageCd) }
      })

      const res = await CStateAPI.GetCStateLanguage(Number(languageCd))
      if (res.data.c_states && res.data.c_states.length > 0) {
        setStates(res.data.c_states)
      }

      if (props.areaCd) {
        const resArea = await AreaApi.GetCareasWithKey(String(props.areaCd), languageCd)
        if (resArea.data && resArea.data.c_areas && resArea.data.c_areas.length > 0) {
          setArea(resArea.data.c_areas[0])
        }
      }
    }
  }
  const OnSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault() // これが重要！
    setLoading(true)
    setErrors([])
    try {
      if (props.areaCd) {
        const res = await AreaApi.UpdateCArea(area)
        if (res.status != 200 || res.data.result_code != SERVER_STATUS.SUCCESS) {
          if (res.data.message) {
            setErrors([res.data.message])

            return
          }
        }
      } else {
        const res = await AreaApi.CreateCArea(area)
        if (res.status != 200 || res.data.result_code != SERVER_STATUS.SUCCESS) {
          if (res.data.message) {
            setErrors([res.data.message])

            return
          }
        }
      }

      router.push('/area')
    } finally {
      setLoading(false)
    }

    return
  }

  return (
    <Card>
      <ListErrors errors={errors} setErrors={setErrors} />
      <CardHeader title={t.SCREEN_TITLE_AREA} />
      <Stack component='form' onSubmit={OnSubmit} sx={{ m: 10 }}>
        <Grid container sx={{ marginBottom: 4 }} spacing={5}>
          <Grid item xs={12}>
            <MapWithSearchBox setArea={setArea} />
          </Grid>
          <Grid item xs={12}>
            <span>{t.SCREEN_TITLE_AREA_LIST_AREA_NAME}*</span>
            <TextField
              fullWidth
              type='text'
              size='small'
              id='area_name'
              required
              value={area?.area_name}
              onChange={e =>
                setArea(prev => {
                  return { ...prev, area_name: e.target.value }
                })
              }
              variant='outlined'
            />
          </Grid>
          <Grid item xs={12}>
            <span>{t.SCREEN_TITLE_AREA_LIST_STATE}*</span>
            <Select
              labelId='area-label'
              id='state_cd'
              required
              size='small'
              notched={true}
              value={String(area.state_cd)}
              fullWidth
              MenuProps={{
                sx: {
                  maxHeight: 300
                }
              }}
              onChange={e =>
                setArea(prev => {
                  return { ...prev, state_cd: Number(e.target.value) }
                })
              }
            >
              {states.map(c => {
                return (
                  <MenuItem value={String(c.state_cd)} key={String(c.state_cd)}>
                    <Typography fontSize={'1.0rem'}>
                      [{c.state_cd}] {c.state_name}
                    </Typography>
                  </MenuItem>
                )
              })}
            </Select>
          </Grid>
          <Grid item xs={12}>
            <span>{t.SCREEN_TITLE_AREA_LIST_URL}*</span>
            <TextField
              fullWidth
              type='text'
              size='small'
              id='url'
              required
              value={area?.search_area_name_seo}
              onChange={e =>
                setArea(prev => {
                  return { ...prev, search_area_name_seo: e.target.value }
                })
              }
              variant='outlined'
            />
          </Grid>
          <Grid item xs={12}>
            <span>{t.SCREEN_TITLE_AREA_LIST_WEST}*</span>
            <TextField
              fullWidth
              type='text'
              size='small'
              id='west'
              required
              value={area?.west_longitude}
              onChange={e =>
                setArea(prev => {
                  return { ...prev, west_longitude: Number(e.target.value) }
                })
              }
              variant='outlined'
            />
          </Grid>
          <Grid item xs={12}>
            <span>{t.SCREEN_TITLE_AREA_LIST_EAST}*</span>
            <TextField
              fullWidth
              type='text'
              size='small'
              id='east'
              required
              value={area?.east_longitude}
              onChange={e =>
                setArea(prev => {
                  return { ...prev, east_longitude: Number(e.target.value) }
                })
              }
              variant='outlined'
            />
          </Grid>
          <Grid item xs={12}>
            <span>{t.SCREEN_TITLE_AREA_LIST_NORTH}*</span>
            <TextField
              fullWidth
              type='text'
              size='small'
              id='north'
              required
              value={area?.north_latitude}
              onChange={e =>
                setArea(prev => {
                  return { ...prev, north_latitude: Number(e.target.value) }
                })
              }
              variant='outlined'
            />
          </Grid>
          <Grid item xs={12}>
            <span>{t.SCREEN_TITLE_AREA_LIST_SOUTH}*</span>
            <TextField
              fullWidth
              type='text'
              size='small'
              id='south'
              required
              value={area?.south_latitude}
              onChange={e =>
                setArea(prev => {
                  return { ...prev, south_latitude: Number(e.target.value) }
                })
              }
              variant='outlined'
            />
          </Grid>
          <Grid item xs={12}>
            <span>{t.SCREEN_TITLE_AREA_LIST_SUMMARY}*</span>
            <Checkbox
              size='small'
              id='south'
              value={area?.summary_area_flg}
              onChange={e =>
                setArea(prev => {
                  return { ...prev, summary_area_flg: Boolean(e.target.value) }
                })
              }
            />
          </Grid>
          <Grid item xs={12}>
            <span>{t.SCREEN_TITLE_AREA_LIST_KBID}*</span>
            <TextField
              fullWidth
              type='text'
              size='small'
              id='south'
              value={area?.botpress_kb_id}
              onChange={e =>
                setArea(prev => {
                  return { ...prev, botpress_kb_id: e.target.value }
                })
              }
              variant='outlined'
            />
          </Grid>
          <Grid item xs={12}>
            <Button type='submit' variant='contained' disabled={loading} size='medium' sx={{ mr: 2 }}>
              {t.BUTTON_UPDATE}
            </Button>
          </Grid>
        </Grid>
      </Stack>
    </Card>
  )
}
