// ** React Imports

// ** Component
import { useLocale } from '@/@core/hooks/useLocal'
import Signup from '@/components/shopCreate'
import { Box, Card, CardHeader } from '@mui/material'

const SignupPage = () => {
  const { t } = useLocale()

  return (
    <Card>
      <CardHeader title={t.SCREEN_TITLE_SIGNUP} />
      <Box sx={{ padding: 10 }}>
        <Signup />
      </Box>
    </Card>
  )
}

export default SignupPage
