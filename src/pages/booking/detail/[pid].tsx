// ** MUI Imports
import Box from '@mui/material/Box'

// ** css
import styles from 'styles/booking.module.scss'

// ** service
import BookingService from '@/service/BookingService'

// ** hook
import { useLocale } from 'src/@core/hooks/useLocal'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { getLanguageCdWithValue } from '@/configs/locales/locales'
import { Skeleton } from '@mui/material'
import ListErrors from '@/@core/components/list-errors'
import WellbeAccountService from '@/service/WellbeAccountService'

export default function BookingDetail() {
  const { t } = useLocale()
  const router = useRouter()
  const [bookingNo, setShopNo] = useState<string | undefined>(
    [router.query.pid].flat(1).length > 0 ? [router.query.pid].flat(1)[0] : ''
  )
  const [errors, setErrors] = useState<string[]>([])

  // Service
  const bookingService = BookingService()
  const wellbeAccountService = WellbeAccountService()

  useEffect(() => {
    if ([router.query.pid].flat(1).length > 0) {
      setShopNo([router.query.pid].flat(1).length > 0 ? [router.query.pid].flat(1)[0] : '')
    }
  }, [router.query.pid])

  useEffect(() => {
    if (router.locale && getLanguageCdWithValue(router.locale) && bookingNo) {
      const varLanguageCd = getLanguageCdWithValue(router.locale)
      GetBooking(bookingNo, varLanguageCd)
    }

    // Only first time
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.locale, bookingNo])

  // get Booking
  const GetBooking = async (inBookingNo: string, languageCd: string) => {
    if (inBookingNo && languageCd) {
      const res = await bookingService.GetBooking(inBookingNo, languageCd)
      if (res.data && res.data.accountId) {
        await wellbeAccountService.GetAccount(res.data.accountId)
      }
    }
  }

  return (
    <>
      <Box>
        <h2 style={{ maxWidth: '1000px', margin: '0 auto 20px auto' }}>{t.SCREEN_ACCOUNT_RESERVATION_DETAILS}</h2>
        <ListErrors errors={errors} setErrors={setErrors} />
        <Box className={styles.account_wrapper_gray_flex}>
          <Box className={styles.account_flex_wrapper_left}>
            <Box className={styles.reserve_conf_box}>
              {bookingService.bookings && bookingService.bookings.length > 0 && (
                <>
                  <dl style={{ marginBottom: 0 }}>
                    <dt>{t.SCREEN_RESERVATION_NUMBER}</dt>
                    <dd>
                      {bookingService.loading ||
                      bookingService.bookings == undefined ||
                      bookingService.bookings.length == 0 ? (
                        <Skeleton width={'100%'} />
                      ) : (
                        bookingService.bookings[0].bookingNo
                      )}
                    </dd>
                    <dt>{t.SCREEN_ACCOUNT_RESERVATION_STATUS}</dt>
                    <dd>
                      {bookingService.loading ||
                      bookingService.bookings == undefined ||
                      bookingService.bookings.length == 0 ? (
                        <Skeleton width={'100%'} />
                      ) : (
                        bookingService.bookings[0].bookingStatusName +
                        ' (' +
                        bookingService.bookings[0].checkoutStatusName +
                        ')'
                      )}
                    </dd>
                    <dt>{t.SCREEN_SETTLEMENT_DATE}</dt>
                    <dd style={{ whiteSpace: 'pre-wrap' }}>
                      {bookingService.bookings[0].checkoutDueDatetime}
                      <br className={styles.disp_sp} />
                      {t.SCREEN_CHECKOUT_CHECKOUT_DUE_DATE_LOCALTIME}
                    </dd>
                  </dl>
                  <dl>
                    <dt>{t.SCREEN_RESERVATION_DATE_AND_TIME}</dt>
                    <dd>
                      {bookingService.loading ||
                      bookingService.bookings == undefined ||
                      bookingService.bookings.length == 0 ? (
                        <Skeleton width={'100%'} />
                      ) : (
                        bookingService.bookings[0].bookingDatetime
                      )}
                    </dd>
                    <dt>{t.SCREEN_ACCOUNT_RESERVATION_SALON}</dt>
                    <dd>
                      {bookingService.loading ||
                      bookingService.bookings == undefined ||
                      bookingService.bookings.length == 0 ? (
                        <Skeleton width={'100%'} />
                      ) : (
                        <Box sx={{ width: '100%' }}>{bookingService.bookings[0].shopId}</Box>
                      )}
                      {bookingService.loading ||
                      bookingService.bookings == undefined ||
                      bookingService.bookings.length == 0 ? (
                        <Skeleton width={'100%'} />
                      ) : (
                        <Box sx={{ width: '100%' }}>{bookingService.bookings[0].shopName}</Box>
                      )}
                      <Box sx={{ width: '100%' }}>
                        {bookingService.loading ||
                        bookingService.bookings == undefined ||
                        bookingService.bookings.length == 0 ? (
                          <Skeleton width={'100%'} />
                        ) : (
                          bookingService.bookings[0].countryName +
                          ' ' +
                          bookingService.bookings[0].stateName +
                          ' ' +
                          bookingService.bookings[0].address1 +
                          ' ' +
                          bookingService.bookings[0].address2 +
                          ' ' +
                          bookingService.bookings[0].address3
                        )}
                      </Box>
                      <Box sx={{ width: '100%' }}>{bookingService.bookings[0].shopEmailAddress}</Box>
                    </dd>
                  </dl>
                  <dl>
                    <dt>{t.SCREEN_ACCOUNT_ACCOUNT_ID}</dt>
                    <dd>
                      {bookingService.loading ||
                      bookingService.bookings == undefined ||
                      bookingService.bookings.length == 0 ? (
                        <Skeleton width={'100%'} />
                      ) : (
                        <Box sx={{ width: '100%' }}>{wellbeAccountService.account?.account_no}</Box>
                      )}
                      <Box sx={{ width: '100%' }}>
                        {bookingService.loading ||
                        bookingService.bookings == undefined ||
                        bookingService.bookings.length == 0 ? (
                          <Skeleton width={'100%'} />
                        ) : (
                          wellbeAccountService.account?.family_name + ' ' + wellbeAccountService.account?.given_name
                        )}
                      </Box>
                      <Box sx={{ width: '100%' }}>
                        {bookingService.loading ||
                        bookingService.bookings == undefined ||
                        bookingService.bookings.length == 0 ? (
                          <Skeleton width={'100%'} />
                        ) : (
                          wellbeAccountService.account?.email_address
                        )}
                      </Box>
                    </dd>
                  </dl>
                  <h3>{t.SCREEN_ACCOUNT_RESERVATION_MENU}</h3>
                  {bookingService.loading ||
                  bookingService.bookings == undefined ||
                  bookingService.bookings.length == 0 ? (
                    <Skeleton width={'100%'} sx={{ marginTop: 0 }} />
                  ) : (
                    <ol>
                      {bookingService.bookings &&
                        bookingService.bookings.length > 0 &&
                        bookingService.bookings[0].bookingMenues.map(v => {
                          return (
                            <>
                              <li>{v.menuName}</li>
                              <ul>
                                <li>
                                  {v.numberOfMale == '0' || t.SCREEN_MEN + ' ' + v.numberOfMale}{' '}
                                  {v.numberOfFemale == '0' || t.SCREEN_WOMAN + ' ' + v.numberOfFemale}
                                </li>
                                <li>
                                  {v.amount} {v.currencyCdIso}
                                </li>
                              </ul>
                            </>
                          )
                        })}
                    </ol>
                  )}
                  <dl style={{ justifyContent: 'space-between' }}>
                    <dt>{t.SCREEN_ACCOUNT_RESERVATION_ADMIN_FEE}</dt>
                    <dd className={styles.price} style={{ justifyContent: 'end' }}>
                      {bookingService.loading ||
                      bookingService.bookings == undefined ||
                      bookingService.bookings.length == 0 ? (
                        <Skeleton width={'100%'} />
                      ) : (
                        bookingService.bookings[0].adminFeeBasicalCurrencyBase +
                        ' ' +
                        bookingService.bookings[0].basicalCurrencyCdIso
                      )}
                    </dd>
                    <dt>{t.SCREEN_ACCOUNT_RESERVATION_TOTAL_AMOUNT}</dt>
                    <dd className={styles.price} style={{ justifyContent: 'end' }}>
                      {bookingService.loading ||
                      bookingService.bookings == undefined ||
                      bookingService.bookings.length == 0 ? (
                        <Skeleton width={'100%'} />
                      ) : (
                        bookingService.bookings[0].totalAmountBasicalCurrencyBase +
                        ' ' +
                        bookingService.bookings[0].basicalCurrencyCdIso
                      )}
                    </dd>
                  </dl>
                  <p>
                    {bookingService.loading ||
                    bookingService.bookings == undefined ||
                    bookingService.bookings.length == 0 ? (
                      <Skeleton width={'100%'} />
                    ) : (
                      bookingService.bookings[0].request
                    )}
                  </p>
                </>
              )}
            </Box>
          </Box>
        </Box>
      </Box>
    </>
  )
}
