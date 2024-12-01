import { useRouter } from 'next/router'

// ** MUI Imports
import {
  Box,
  Container,
  TextField,
  Grid,
  LinearProgress,
  Snackbar,
  Alert,
  AlertColor,
  Backdrop,
  CircularProgress,
  Button
} from '@mui/material'
import Rating from '@mui/material/Rating'
import Stack from '@mui/material/Stack'

// ** css
import styles from 'styles/account.module.scss'

// ** hook
import { useLocale } from 'src/@core/hooks/useLocal'
import ReviewService from '@/service/ReviewService'
import { useEffect, useState } from 'react'
import { ReviewHeader } from '@/@core/api/type/review'
import { REVIEW_STATUS } from '@/@core/utils/constant'

export default function AccountReviewPost() {
  const router = useRouter()
  const { t } = useLocale()
  const [openError, setOpenError] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [severity] = useState<AlertColor | undefined>('error')
  const [id, setId] = useState<string | undefined>(
    [router.query.pid].flat(1).length > 0 ? [router.query.pid].flat(1)[0] : ''
  )
  const [review, setReview] = useState({} as ReviewHeader)

  const reviewService = ReviewService()

  useEffect(() => {
    if ([router.query.pid].flat(1).length > 0) {
      setId([router.query.pid].flat(1).length > 0 ? [router.query.pid].flat(1)[0] : '')
    }
  }, [router.query.pid])

  // ** config

  useEffect(() => {
    Init()

    // Only first time
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.locale])

  const Init = async () => {
    const res = await reviewService.GetReviewOne(id || '')
    setReview(res.data)
  }

  const onApprove = async () => {
    const res = await reviewService.Approve(id || '')
    if (res.message != '') {
      setOpenError(true)
      setErrorMessage(res.message)
    } else {
      reviewService.GetReviewList()
    }
  }

  const onDeny = async () => {
    const res = await reviewService.Deny(id || '')
    if (res.message != '') {
      setOpenError(true)
      setErrorMessage(res.message)
    } else {
      reviewService.GetReviewList()
    }
  }

  const handleCloseSnackbar = () => {
    setOpenError(false)
  }

  return (
    <>
      <Box className={styles.account_wrapper_gray}>
        <Box style={{ maxWidth: '1000px', margin: 'auto' }}>
          <h2>{t.SCREEN_TITLE_REVIEW}</h2>

          {!reviewService.loading && (
            <>
              <Box className={styles.account_review_post_box}>
                <Container maxWidth='sm' sx={{ pt: 5 }}>
                  <Grid container>
                    <h2>{review.shop_name}</h2>
                    <h3 className={styles.asterisk}>{t.SCREEN_REVIEW_COL_NICKNAME}</h3>
                    <Grid item xs={12} sx={{ mb: 4 }}>
                      <TextField
                        fullWidth
                        type='text'
                        id='Review.nickname'
                        variant='outlined'
                        disabled
                        value={review.nickname}
                        InputLabelProps={{ shrink: true, style: { fontSize: 16 } }}
                      />
                    </Grid>
                    <dl className={styles.common_dl}>
                      <dt>{t.SCREEN_REVIEW_COL_GENDER}</dt>
                      <dd>{review.gender_name}</dd>
                    </dl>
                    <dl className={styles.common_dl}>
                      <dt>{t.SCREEN_REVIEW_COL_AGE_GENDER}</dt>
                      <dd>{review.age_range_gender}</dd>
                    </dl>
                    <h3>{t.SCREEN_REVIEW_COL_MENUES}</h3>
                    {review.review_menues &&
                      review.review_menues.map((v, i) => {
                        return (
                          <dl className={styles.menu_dl} key={i}>
                            <dt>{v.menu_name}</dt>
                            <dd>
                              {(v.amount && v.amount.toLocaleString()) || 0} {v.basical_currency_cd_iso}
                            </dd>
                          </dl>
                        )
                      })}

                    <h3 className={styles.asterisk}>{t.SCREEN_REVIEW_COL_RATING}</h3>
                    <Stack spacing={1}>
                      <Rating
                        name='Review.evalueationValue'
                        disabled
                        value={
                          review.review_contents && review.review_contents.length > 0
                            ? review.review_contents[0].review_evaluation_value
                            : 0
                        }
                        size='large'
                      />
                    </Stack>

                    <h3 className={styles.asterisk}>{t.SCREEN_REVIEW_COL_REVIEW_COMMENT}</h3>

                    <Grid item xs={12} sx={{ mb: 4 }}>
                      <TextField
                        multiline
                        rows={8}
                        fullWidth
                        disabled
                        type='text'
                        id='Review.comment'
                        variant='outlined'
                        value={
                          review.review_contents &&
                          review.review_contents.length > 0 &&
                          review.review_contents[0].review_comment
                        }
                        inputProps={{ style: { fontSize: '14px' } }}
                        InputLabelProps={{ shrink: true, style: { fontSize: 16 } }}
                      />
                    </Grid>
                  </Grid>
                </Container>
              </Box>
              <Box className={styles.account_review_post_under_btn}>
                <Grid container spacing={2} sx={{ mb: 2 }}>
                  {review && String(review.review_status_cd) == REVIEW_STATUS.NOT_APPROVED && (
                    <Grid item xs={6}>
                      <Button variant='contained' color='primary' onClick={onApprove} sx={{ width: '100%' }}>
                        {t.BUTTON_REVIEW_APPROVE}
                      </Button>
                    </Grid>
                  )}
                  <Grid item xs={6}>
                    <Button variant='contained' color='error' onClick={onDeny} sx={{ width: '100%' }}>
                      {t.BUTTON_REVIEW_DENY}
                    </Button>
                  </Grid>
                </Grid>
              </Box>
              {reviewService.loading && (
                <Box className={styles.filter_progress}>
                  <LinearProgress />
                </Box>
              )}
            </>
          )}
        </Box>
        <Snackbar
          anchorOrigin={{ horizontal: 'center', vertical: 'top' }}
          open={openError}
          autoHideDuration={3000}
          onClose={handleCloseSnackbar}
        >
          <Alert
            onClose={handleCloseSnackbar}
            variant='filled'
            severity={severity}
            sx={{ width: '100%', fontSize: '1.5rem' }}
          >
            {errorMessage}
          </Alert>
        </Snackbar>
        <Backdrop sx={{ color: '#fff', zIndex: theme => theme.zIndex.drawer + 1 }} open={reviewService.loading}>
          <CircularProgress color='inherit' />
        </Backdrop>
      </Box>
    </>
  )
}
