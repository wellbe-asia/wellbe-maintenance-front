// ** React Imports
import { useEffect, useState } from 'react'

// ** MUI Imports
import { Box, Backdrop, CircularProgress, Card, CardContent } from '@mui/material'

// ** Component
import ShopDescriptionContentTabCard from './ShopDescriptpionContentTabCard'

// ** Service
import ShopDescriptionContentService from '@/service/ShopDescriptionContentService'

// ** Hook
import LanguageCdService from '@/service/LanguageCdService'

const ShopDescriptionContentCard = (props: { shopId: string; basicalLanguageCd: string }) => {
  // ** Hook
  const [languageCd, setLanuageCd] = useState(props.basicalLanguageCd)

  // ** Service
  const shopDescriptionContentService = ShopDescriptionContentService()
  const languageCdService = LanguageCdService()

  useEffect(() => {
    window.scrollTo(0, 0) // ページのトップにスクロール
  }, [shopDescriptionContentService.loading])

  // ** Init screen
  useEffect(() => {
    languageCdService.Init()

    // Only first time
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // ** Init screen
  useEffect(() => {
    if (props.shopId && languageCd) {
      shopDescriptionContentService.Init(props.shopId, languageCd)
    }

    // Only first time
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.shopId, languageCd])

  useEffect(() => {
    console.log('shopDescriptionContentService.shopImageFields', shopDescriptionContentService.shopImageFields)
  }, [shopDescriptionContentService.shopImageFields])

  const onChangeLanguageCd = (languageCd: string) => {
    setLanuageCd(languageCd)
  }

  return (
    <Box sx={{ width: '100%' }}>
      <Card>
        <CardContent>
          <ShopDescriptionContentTabCard
            form={shopDescriptionContentService.ShopDescriptionContentsForm}
            loading={shopDescriptionContentService.loading}
            submit={shopDescriptionContentService.Submit}
            translate={shopDescriptionContentService.Translate}
            init={shopDescriptionContentService.Init}
            languageCd={languageCd}
            onChangeLanguageCd={onChangeLanguageCd}
            languageCds={languageCdService.languageCd}
            shopImages={shopDescriptionContentService.shopImageFields}
            shopContentImages={shopDescriptionContentService.shopContentImageFields}
            AddShopImage={shopDescriptionContentService.AddShopImage}
            RemoveShopImage={shopDescriptionContentService.RemoveShopImage}
            AddShopContentImage={shopDescriptionContentService.AddShopContentImage}
            RemoveShopContentImage={shopDescriptionContentService.RemoveShopContentImage}
            shopId={props.shopId}
          />
        </CardContent>
        <Backdrop
          sx={{ color: '#fff', zIndex: theme => theme.zIndex.drawer + 1 }}
          open={shopDescriptionContentService.submitLoading}
        >
          <CircularProgress color='inherit' />
        </Backdrop>
      </Card>
    </Box>
  )
}

export default ShopDescriptionContentCard
