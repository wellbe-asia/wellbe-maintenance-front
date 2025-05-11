import SubmitArea from '@/components/submitArea'
import { useRouter } from 'next/router'

export default function NewArea() {
  const router = useRouter()
  const { pid } = router.query
  const areaCd = pid && [pid].flat(1).length > 0 ? [pid].flat(1)[0] : ''

  return <SubmitArea areaCd={Number(areaCd)} />
}
