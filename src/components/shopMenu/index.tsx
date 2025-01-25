// ** react
import { useState, SyntheticEvent, useEffect } from 'react'

// ** Material
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'

// ** service
import ShopMenuService from '@/service/ShopMenuService'

// ** component
import ShopMenuTabCard from '@/components/shopMenu/ShopMenuTabCard'

// ** hook
import { Backdrop, Badge, CircularProgress } from '@mui/material'

export default function ShopMenuCard(props: { shopId: string; basicalCurrencyCd: string }) {
  const [currentTab, setCurrentTab] = useState(0)
  const shopMenuService = ShopMenuService()

  useEffect(() => {
    shopMenuService.Init(props.shopId)

    // Only first time
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleChangeTabs = (event: SyntheticEvent, newTabIndex: number) => {
    setCurrentTab(newTabIndex)
  }

  return (
    <Box sx={{ width: '100%' }}>
      <Card>
        <CardContent>
          <Box sx={{ borderBottom: 1, borderColor: 'divider', marginBottom: 4 }}>
            <Tabs value={currentTab} onChange={handleChangeTabs} aria-label='basic tabs example'>
              {shopMenuService.languageCds.map((v, i) => (
                <Tab
                  label={
                    shopMenuService.languageCdHasError[i] ? (
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
            <ShopMenuTabCard
              form={shopMenuService.Form}
              fields={shopMenuService.fields}
              basicalCurrencyCd={props.basicalCurrencyCd}
              index={currentTab}
              shopId={props.shopId}
              init={shopMenuService.Init}
              loading={shopMenuService.loading}
              submit={shopMenuService.Submit}
              append={() => {
                shopMenuService.Append(props.shopId)
              }}
              remove={shopMenuService.Remove}
              translate={shopMenuService.Translate}
            />
          </Box>
        </CardContent>
        <Backdrop sx={{ color: '#fff', zIndex: theme => theme.zIndex.drawer + 1 }} open={shopMenuService.submitLoading}>
          <CircularProgress color='inherit' />
        </Backdrop>
      </Card>
    </Box>
  )
}
