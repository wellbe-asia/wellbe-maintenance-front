// ** Type import
import { useLocale } from '@/@core/hooks/useLocal'
import { VerticalNavItemsType } from 'src/@core/layouts/types'

const Navigation = (): VerticalNavItemsType => {
  const { t } = useLocale()

  return [
    {
      sectionTitle: t.MENU_MANAGEMENT
    },
    {
      title: t.MENU_DASHBOARD,
      icon: 'mdi:google-analytics',
      path: '/dashboards/analytics'
    },
    {
      title: t.SCREEN_TITLE_BOOKING_LIST,
      icon: 'mdi:calendar-check',
      path: '/booking/list'
    },
    {
      title: t.SCREEN_TITLE_PROXY_BOOKING_LIST,
      icon: 'mdi:calendar-check',
      path: '/proxy-booking/list'
    },
    {
      title: t.SCREEN_TITLE_SHOP_LIST,
      icon: 'mdi:store',
      path: '/store'
    },
    {
      title: t.SCREEN_TITLE_SHOP_LIST_SCRAPED,
      icon: 'mdi:store',
      path: '/store-scraped'
    },
    {
      title: t.SCREEN_TITLE_SHOP_LIST_APPLICATED,
      icon: 'mdi:store',
      path: '/store-applicated'
    },
    {
      title: t.SCREEN_TITLE_SCRAPING_KEYWORD_LIST,
      icon: 'mdi:search-web',
      path: '/scraping-keyword'
    },
    {
      title: t.SCREEN_TITLE_SCRAPING_LIST,
      icon: 'mdi:home-search-outline',
      path: '/scraping-shop-list'
    },
    {
      title: t.SCREEN_TITLE_SHOP_INDVIDUAL_PAYMENT_LIST,
      icon: 'mdi:store-alert',
      path: '/store-indvidual-payment'
    },
    {
      title: t.SCREEN_TITLE_CHECKOUT_LIST,
      icon: 'mdi:credit-card-outline',
      path: '/checkout'
    },
    {
      title: t.SCREEN_TITLE_PAYOUT_LIST,
      icon: 'mdi:bank',
      path: '/payout'
    },
    {
      title: t.SCREEN_TITLE_INVOICE_LIST,
      icon: 'mdi:bank',
      path: '/invoice'
    },
    {
      title: t.SCREEN_TITLE_REVIEW,
      icon: 'mdi:comment-account-outline',
      path: '/review'
    },
    {
      title: t.SCREEN_TITLE_ACCOUNT_LIST,
      icon: 'mdi:account',
      path: '/wellbe-account'
    },
    {
      title: t.SCREEN_TITLE_CONTENTS_LIST,
      icon: 'mdi:table-of-contents',
      path: '/contents'
    }
  ]
}

export default Navigation
