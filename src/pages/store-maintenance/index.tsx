// ** React
import * as React from 'react'
import { useRouter } from 'next/router'

// ** MUI
import Box from '@mui/material/Box'

// ** Component
import ShopMaintenance from '@/components/shopMaintenance'

export default function ShopMaintenancePage() {
  const router = useRouter()
  const { shop_id } = router.query
  const shopId = shop_id && [shop_id].flat(1).length > 0 ? [shop_id].flat(1)[0] : ''

  return (
    <Box>
      <ShopMaintenance shopId={shopId} />
    </Box>
  )
}
