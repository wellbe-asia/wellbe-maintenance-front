// ** React
import * as React from 'react'

// ** MUI
import Stack from '@mui/material/Stack'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import { Backdrop, CircularProgress, Divider, Tab, Tabs } from '@mui/material'

// ** Compornents
import ListErrors from 'src/@core/components/list-errors'

// ** Cards
import ShopMenuCard from '@/components/shopMenu'

// ** hook
import { useLocale } from 'src/@core/hooks/useLocal'
import InformSnackbar from '@/@core/components/inform-snackbar'
import ShopBasicalInfoCard from '../shopBasicalInfo'
import ShopDescriptionContentCard from '../ShopDescriptionContent'
import ShopService from '@/service/ShopService'
import AccountService from '@/service/AccountService'

interface TabPanelProps {
  children?: React.ReactNode
  index: number
  value: number
}

function CustomTabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props

  return (
    <div
      role='tabpanel'
      hidden={value !== index}
      id={`account-setting-tabpanel-${index}`}
      aria-labelledby={`account-setting-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  )
}

function a11yProps(index: number) {
  return {
    id: `account-setting-tab-${index}`,
    'aria-controls': `account-setting-${index}`
  }
}

export default function ShopMaintenance(props: { shopId: string }) {
  const { t } = useLocale()
  const [errors, setErrors] = React.useState<string[]>([])
  const [successSnackbarOpen, setSuccessSnackbarOpen] = React.useState(false)
  const [errorSnackbarOpen, setErrorSnackbarOpen] = React.useState(false)
  const [tabValue, stTabValue] = React.useState(0)

  // service
  const shopService = ShopService()
  const accountService = AccountService()

  React.useEffect(() => {
    accountService.Init(props.shopId)

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    stTabValue(newValue)
  }

  const onClickPublish = async () => {
    const message = await shopService.Publish(props.shopId)
    if (message != '') {
      setErrorSnackbarOpen(true)
    } else {
      setSuccessSnackbarOpen(true)
    }
  }

  return (
    <Box>
      <Stack>
        <ListErrors errors={errors} setErrors={setErrors} />
        <Box sx={{ marginBottom: '15px', width: '100%', textAlign: 'right' }}>
          <Button variant='contained' onClick={onClickPublish}>
            {t.BUTTON_PUBLISH}
          </Button>
        </Box>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          aria-label='account setting tabs'
          sx={{ mt: '10px', ml: '10px', mr: '10px' }}
          scrollButtons='auto'
        >
          <Tab label={t.SCREEN_TITLE_SHOP_BASIC_INFORMATION} {...a11yProps(0)} />
          <Tab label={t.SCREEN_TITLE_SHOP_DESCRIPTION} {...a11yProps(1)} />
          <Tab label={t.SCREEN_TITLE_SHOP_MENU} {...a11yProps(2)} />
        </Tabs>
        <Divider sx={{ mt: '10px' }} />
        <CustomTabPanel value={tabValue} index={0}>
          <ShopBasicalInfoCard shopId={props.shopId} />
        </CustomTabPanel>
        <CustomTabPanel value={tabValue} index={1}>
          <ShopDescriptionContentCard
            shopId={props.shopId}
            basicalLanguageCd={String(accountService.Form.getValues('shop.ShopBasicalLanguageCd'))}
          />
        </CustomTabPanel>
        <CustomTabPanel value={tabValue} index={2}>
          <ShopMenuCard
            shopId={props.shopId}
            basicalCurrencyCd={String(accountService.Form.getValues('shop.ShopBasicalCurrencyCd'))}
          />
        </CustomTabPanel>
        <InformSnackbar
          open={successSnackbarOpen}
          setOpen={setSuccessSnackbarOpen}
          security={'success'}
          message={t.MESSAGE_PUBLISHED}
          autoHideDuration={3000}
          anchorOrigin={{ horizontal: 'right', vertical: 'top' }}
        />
        <InformSnackbar
          open={errorSnackbarOpen}
          setOpen={setErrorSnackbarOpen}
          severity={'error'}
          message={t.MESSAGE_PUBLISHED_ERROR}
          autoHideDuration={3000}
          anchorOrigin={{ horizontal: 'right', vertical: 'top' }}
        />
        <Backdrop sx={{ color: '#fff', zIndex: theme => theme.zIndex.drawer + 1 }} open={shopService.loading}>
          <CircularProgress color='inherit' />
        </Backdrop>
      </Stack>
    </Box>
  )
}
