// ** React
import * as React from 'react'

// ** MUI
import Stack from '@mui/material/Stack'
import Box from '@mui/material/Box'
import Stepper from '@mui/material/Stepper'
import Step from '@mui/material/Step'
import StepButton from '@mui/material/StepButton'
import Button from '@mui/material/Button'
import InputLabel from '@mui/material/InputLabel'
import Typography from '@mui/material/Typography'
import { useTheme } from '@mui/material/styles'
import { Backdrop, CircularProgress } from '@mui/material'

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

export default function ShopMaintenance(props: { shopId: string }) {
  const { t } = useLocale()
  const theme = useTheme()
  const steps = [t.SCREEN_TITLE_SHOP_BASIC_INFORMATION, t.SCREEN_TITLE_CONTENT, t.SCREEN_TITLE_SHOP_MENU]
  const [activeStep, setActiveStep] = React.useState(0)
  const [errors, setErrors] = React.useState<string[]>([])
  const [completed] = React.useState<{
    [k: number]: boolean
  }>({})
  const [successSnackbarOpen, setSuccessSnackbarOpen] = React.useState(false)
  const [errorSnackbarOpen, setErrorSnackbarOpen] = React.useState(false)

  // service
  const shopService = ShopService()
  const accountService = AccountService()

  React.useEffect(() => {
    accountService.Init(props.shopId)

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const totalSteps = () => {
    return steps.length
  }

  const completedSteps = () => {
    return Object.keys(completed).length
  }

  const allStepsCompleted = () => {
    return completedSteps() === totalSteps()
  }

  const handleStep = (step: number) => () => {
    setActiveStep(step)
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
        <Stepper nonLinear activeStep={activeStep} sx={{ marginBottom: 10 }}>
          {steps.map((label, index) => (
            <Step key={label} completed={completed[index]}>
              <StepButton color='inherit' onClick={handleStep(index)} />
              {[theme.breakpoints.up('md')] ? (
                <InputLabel id='area-label' sx={{ marginTop: 2 }}>
                  {label}
                </InputLabel>
              ) : (
                <div />
              )}
            </Step>
          ))}
        </Stepper>
        <div>
          {allStepsCompleted() ? (
            <React.Fragment>
              <Typography sx={{ mt: 2, mb: 1 }}>{t.MESSAGE_ALLSTEP_COMPLETE}</Typography>
            </React.Fragment>
          ) : (
            <React.Fragment>
              {activeStep == 0 ? (
                <Box className='content-center'>
                  <ShopBasicalInfoCard shopId={props.shopId} />
                </Box>
              ) : activeStep == 1 ? (
                <Box>
                  <ShopDescriptionContentCard shopId={props.shopId} />
                </Box>
              ) : (
                <Box>
                  <ShopMenuCard
                    shopId={props.shopId}
                    basicalCurrencyCd={String(accountService.Form.getValues('shop.ShopBasicalCurrencyCd'))}
                  />
                </Box>
              )}
            </React.Fragment>
          )}
        </div>
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
