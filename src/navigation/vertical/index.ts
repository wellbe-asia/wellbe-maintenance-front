// ** Type import
import AccountAPI from '@/@core/api/factoryAccount'
import { useLocale } from '@/@core/hooks/useLocal'
import { SESSION_STORAGE_KEY_KEYWORD } from '@/@core/utils/constant'
import { useEffect, useState } from 'react'
import { VerticalNavItemsType } from 'src/@core/layouts/types'

const Navigation = (): VerticalNavItemsType => {
  const { t } = useLocale()
  const [authorizedMenues, setAuthorizedMenues] = useState<Map<string, boolean>>()

  useEffect(() => {
    const accountId = window.localStorage.getItem(SESSION_STORAGE_KEY_KEYWORD.ACCOUNTID)!
    GetData(accountId)
  }, [])

  const GetData = async (accountId: string) => {
    const res = await AccountAPI.GetAuthorizedMenu(accountId)
    const data = (res.data && res.data.results) || []

    // menu_url をキー、is_prefix を値とする Map を作成
    setAuthorizedMenues(
      data.reduce((map, item) => {
        map.set(item.menu_url, item.is_prefix)

        return map
      }, new Map<string, boolean>())
    )
  }

  const baseMenues = [
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
      title: t.SCREEN_TITLE_MAINTENANCE_ACCOUNT_LIST,
      icon: 'mdi:account',
      path: '/maintenance-account'
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
    },
    {
      title: t.SCREEN_TITLE_CONTENTS_LIST,
      icon: 'mdi:map-marker',
      path: '/area'
    }
  ]

  // authorizedMenues に基づいて baseMenues をフィルタリング
  const filteredMenus = baseMenues.filter(menu => {
    if (!menu.path) return true // セクションタイトル等はそのまま残す

    if (authorizedMenues) {
      for (const [url, isPrefix] of authorizedMenues) {
        if (isPrefix && menu.path.startsWith(url)) return true // 前方一致
        if (!isPrefix && menu.path === url) return true // 完全一致
      }
    }

    return false
  })

  return filteredMenus
}

export default Navigation
