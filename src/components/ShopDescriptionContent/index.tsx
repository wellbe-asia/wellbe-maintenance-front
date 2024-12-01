// ** React Imports
import { SyntheticEvent, useEffect, useState } from 'react'

// ** MUI Imports
import { Box, Backdrop, CircularProgress, Card, CardHeader, CardContent, Tabs, Tab, Badge } from '@mui/material'

// ** Component
import ShopDescriptionContentTabCard from './ShopDescriptpionContentTabCard'

// ** Service
import ShopDescriptionContentService from '@/service/ShopDescriptionContentService'

// ** Hook
import { useLocale } from '@/@core/hooks/useLocal'
import { sleep } from '@/@core/utils/date'

const ShopDescriptionContentCard = (props: { shopId: string }) => {
  // ** Hook
  const { t } = useLocale()
  const [currentTab, setCurrentTab] = useState(0)

  // ** Service
  const shopDescriptionContentService = ShopDescriptionContentService()

  useEffect(() => {
    window.scrollTo(0, 0) // ページのトップにスクロール
  }, [shopDescriptionContentService.loading])

  // ** Init screen
  useEffect(() => {
    shopDescriptionContentService.Init(props.shopId)

    // Only first time
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    loadAllTabs()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shopDescriptionContentService.loading, shopDescriptionContentService.languageCds])

  const loadAllTabs = async () => {
    if (
      !shopDescriptionContentService.loading &&
      shopDescriptionContentService.languageCds &&
      shopDescriptionContentService.languageCds.length > 0
    ) {
      shopDescriptionContentService.setSubmitLoading(true)
      for (let i = 0; i < shopDescriptionContentService.languageCds.length; i++) {
        await sleep(100)
        setCurrentTab(i)
      }
      await sleep(100)
      setCurrentTab(0)
      shopDescriptionContentService.setSubmitLoading(false)
    }
  }

  const handleChangeTabs = (event: SyntheticEvent, newTabIndex: number) => {
    setCurrentTab(newTabIndex)
  }

  return (
    <Box sx={{ width: '100%' }}>
      <Card>
        <CardHeader title={t.SCREEN_TITLE_SHOP_DESCRIPTION} titleTypographyProps={{ variant: 'h6' }} />
        <CardContent>
          <Box sx={{ borderBottom: 1, borderColor: 'divider', marginBottom: 4 }}>
            <Tabs value={currentTab} onChange={handleChangeTabs} aria-label='basic tabs example'>
              {shopDescriptionContentService.languageCds.map((v, i) => (
                <Tab
                  label={
                    shopDescriptionContentService.languageCdHasError[i] ? (
                      <>
                        <Badge variant='dot' color='error'>
                          {v.LanguageName}
                        </Badge>
                      </>
                    ) : (
                      <>{v.LanguageName}</>
                    )
                  }
                  key={i}
                />
              ))}
            </Tabs>
          </Box>
          <Box>
            <ShopDescriptionContentTabCard
              fields={shopDescriptionContentService.ControlledFields}
              form={shopDescriptionContentService.ShopDescriptionContentsForm}
              loading={shopDescriptionContentService.loading}
              shopId={props.shopId}
              index={currentTab}
              submit={shopDescriptionContentService.Submit}
              translate={shopDescriptionContentService.Translate}
              init={shopDescriptionContentService.Init}
              languageCds={shopDescriptionContentService.languageCds}
              SetAddShopImage={shopDescriptionContentService.SetAddShopImage}
              AddShopImage={shopDescriptionContentService.AddShopImage}
              SetRemoveShopImage={shopDescriptionContentService.SetRemoveShopImage}
              RemoveShopImage={shopDescriptionContentService.RemoveShopImage}
              AddShopContentImage={shopDescriptionContentService.AddShopContentImage}
              SetAddShopContentImage={shopDescriptionContentService.SetAddShopContentImage}
              RemoveShopContentImage={shopDescriptionContentService.RemoveShoContentpImage}
              SetRemoveShopContentImage={shopDescriptionContentService.SetRemoveShopContentImage}
              ClearAddShopImage={shopDescriptionContentService.ClearAddShopImage}
              ClearRemoveShopImage={shopDescriptionContentService.ClearRemoveShopImage}
              ClearAddShopContentImage={shopDescriptionContentService.ClearAddShopContentImage}
              ClearRemoveShopContentImage={shopDescriptionContentService.ClearRemoveShopContentImage}
            />
          </Box>
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
