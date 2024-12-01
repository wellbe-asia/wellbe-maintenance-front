// ** React Imports
import { useEffect, useState } from 'react'
import Link from 'next/link'

// ** Hook
import { useLocale } from '@/@core/hooks/useLocal'

// ** MUI Imports
import Card from '@mui/material/Card'
import Typography from '@mui/material/Typography'
import CardHeader from '@mui/material/CardHeader'
import { Backdrop, Button, CircularProgress } from '@mui/material'
import { DataGrid, GridColDef, GridColumnVisibilityModel, GridRenderCellParams } from '@mui/x-data-grid'

// ** Data Import
import { useRouter } from 'next/router'
import ShopCouponService from '@/service/ShopCouponService'
import { getLanguageCdWithValue } from '@/configs/locales/locales'
import { dateFormatApi2DisplayYYYYMMDD } from '@/@core/utils/date'

const ShopCouponList = () => {
  const { t } = useLocale()
  const router = useRouter()

  const { pid } = router.query
  const [shopId] = useState(pid && [pid].flat(1).length > 0 ? [pid].flat(1)[0] : '')

  // ** States
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 })
  const [hideNameColumn, setHideNameColumn] = useState<GridColumnVisibilityModel>({ full_name: true })

  // ** Service
  const shopCouponService = ShopCouponService()

  useEffect(() => {
    if (router.locale && getLanguageCdWithValue(router.locale)) {
      shopCouponService.InitCoupons(shopId, getLanguageCdWithValue(router.locale))
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.locale])

  const onClickNew = () => {
    router.push(`/store/coupon/detail/new?shopid=${shopId}`)
  }

  const columns: GridColDef[] = [
    {
      width: 200,
      field: 'coupon_code',
      headerName: t.SCREEN_COL_COUPONS_LIST_ID,
      valueGetter: params => new Date(params.value),
      renderCell: (params: GridRenderCellParams) => (
        <Link href={`/store/coupon/detail/${params.row.coupon_code}?shopid=${shopId}`}>
          <Typography variant='body2' sx={{ color: 'text.primary' }}>
            {params.row.coupon_code}
          </Typography>
        </Link>
      )
    },
    {
      width: 300,
      field: 'coupon_title',
      headerName: t.SCREEN_COL_COUPONS_LIST_TITLE,
      renderCell: (params: GridRenderCellParams) => (
        <Typography variant='body2' sx={{ color: 'text.primary' }}>
          {params.row.coupon_title}
        </Typography>
      )
    },
    {
      width: 200,
      field: 'coupon_start_date',
      headerName: t.SCREEN_COL_COUPONS_LIST_START_DATE,
      renderCell: (params: GridRenderCellParams) => (
        <Typography variant='body2' sx={{ color: 'text.primary' }}>
          {dateFormatApi2DisplayYYYYMMDD(params.row.coupon_start_date || '')}
        </Typography>
      )
    },
    {
      width: 200,
      field: 'coupon_end_date',
      headerName: t.SCREEN_COL_COUPONS_LIST_END_DATE,
      renderCell: (params: GridRenderCellParams) => (
        <Typography variant='body2' sx={{ color: 'text.primary' }}>
          {dateFormatApi2DisplayYYYYMMDD(params.row.coupon_end_date || '')}
        </Typography>
      )
    }
  ]

  return (
    <Card>
      <CardHeader
        title={t.SCREEN_TITLE_COUPONS_LIST}
        action={
          <Button onClick={onClickNew} variant='contained'>
            {t.BUTTON_NEW}
          </Button>
        }
      />
      <DataGrid
        autoHeight
        rows={shopCouponService.shopCoupons}
        columns={columns}
        disableRowSelectionOnClick
        pageSizeOptions={[7, 10, 25, 50]}
        paginationModel={paginationModel}
        columnVisibilityModel={hideNameColumn}
        onPaginationModelChange={setPaginationModel}
        onColumnVisibilityModelChange={newValue => setHideNameColumn(newValue)}
      />
      <Backdrop sx={{ color: '#fff', zIndex: theme => theme.zIndex.drawer + 1 }} open={shopCouponService.loading}>
        <CircularProgress color='inherit' />
      </Backdrop>
    </Card>
  )
}

export default ShopCouponList
