// ** React Imports
import { useEffect, useState } from 'react'

// ** Hook
import { useLocale } from '@/@core/hooks/useLocal'
import Head from 'next/head'

// ** MUI Imports
import Card from '@mui/material/Card'
import Typography from '@mui/material/Typography'
import CardHeader from '@mui/material/CardHeader'
import {
  Alert,
  AlertColor,
  Backdrop,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogTitle,
  Snackbar
} from '@mui/material'
import { DataGrid, GridColDef, GridColumnVisibilityModel, GridRenderCellParams } from '@mui/x-data-grid'
import ExportToolbar from 'src/views/maintenance/ExportToolbar'

// ** Data Import
import { useRouter } from 'next/router'
import InvoiceItemService from '@/service/InvoiceItemService'
import Link from 'next/link'
import { dateFormatApi2DisplayYYYYMMDD } from '@/@core/utils/date'
import { INVOICE_STATUS } from '@/@core/utils/constant'
import InvoiceService from '@/service/InvoiceService'

const InvoiceList = () => {
  const { t, locale } = useLocale()
  const [openBillDialog, setOpenBillDialog] = useState(false)
  const [openDepositDialog, setOpenDepositDialog] = useState(false)
  const [openWithdrawDialog, setOpenWithdrawDialog] = useState(false)
  const [openDeleteItemDialog, setOpenDeleteItemDialog] = useState(false)

  const [deleteItemId, setDeleteItemId] = useState('')

  const [snackbarOpen, setSnackbarOpen] = useState(false)
  const [severity, setSeverity] = useState<AlertColor | undefined>()
  const [message, setMessage] = useState<string>()
  const router = useRouter()
  const { pid, title, stat } = router.query
  const invoiceId = pid && [pid].flat(1).length > 0 ? [pid].flat(1)[0] : ''
  const titleMeta = title && [title].flat(1).length > 0 ? [title].flat(1)[0] : ''
  const status = stat && [stat].flat(1).length > 0 ? [stat].flat(1)[0] : ''

  // ** States
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 100 })
  const [hideNameColumn, setHideNameColumn] = useState<GridColumnVisibilityModel>({ full_name: true })

  // ** Service
  const invoiceItemService = InvoiceItemService()
  const invoiceService = InvoiceService()

  const handleBillClose = () => {
    setOpenBillDialog(false)
  }
  const handleDepositClose = () => {
    setOpenDepositDialog(false)
  }
  const handleWithdrawClose = () => {
    setOpenWithdrawDialog(false)
  }
  const handleDeleteItemClose = () => {
    setOpenDeleteItemDialog(false)
  }
  const onClickBill = () => {
    setOpenBillDialog(true)
  }
  const onClickDeposit = () => {
    setOpenDepositDialog(true)
  }
  const onClickWithdraw = () => {
    setOpenWithdrawDialog(true)
  }
  const onClickDeleteItem = (id: string) => {
    setDeleteItemId(id)
    setOpenDeleteItemDialog(true)
  }

  const onClickConfirmBill = async () => {
    const res = await invoiceService.CraimeInvoice(invoiceId)
    try {
      if (res.message != '') {
        setSnackbarOpen(true)
        setMessage(res.message)
        setSeverity('error')

        return
      }
      setSnackbarOpen(true)
      setMessage(t.MESSAGE_UPDATED)
      setSeverity('success')
      router.push('/invoice')
    } finally {
      setOpenBillDialog(false)
    }
  }
  const onClickConfirmDeposit = async () => {
    const res = await invoiceService.DepoisitInvoice(invoiceId)
    try {
      if (res.message != '') {
        setSnackbarOpen(true)
        setMessage(res.message)
        setSeverity('error')

        return
      }
      setSnackbarOpen(true)
      setMessage(t.MESSAGE_UPDATED)
      setSeverity('success')
      router.push('/invoice')
    } finally {
      setOpenDepositDialog(false)
    }
  }
  const onClickConfirmWithdraw = async () => {
    const res = await invoiceService.WithdrawInvoice(invoiceId)
    try {
      if (res.message != '') {
        setSnackbarOpen(true)
        setMessage(res.message)
        setSeverity('error')

        return
      }
      setSnackbarOpen(true)
      setMessage(t.MESSAGE_UPDATED)
      setSeverity('success')
      router.push('/invoice')
    } finally {
      setOpenWithdrawDialog(false)
    }
  }
  const onClickConfirmDeleteItem = async () => {
    const res = await invoiceItemService.DeleteInvoiceItem(deleteItemId)
    try {
      if (res.message != '') {
        setSnackbarOpen(true)
        setMessage(res.message)
        setSeverity('error')

        return
      }
      setSnackbarOpen(true)
      setMessage(t.MESSAGE_UPDATED)
      setSeverity('success')
      invoiceItemService.GetInvoiceItemList(invoiceId)
    } finally {
      setOpenDeleteItemDialog(false)
    }
  }

  useEffect(() => {
    if (invoiceId) {
      invoiceItemService.GetInvoiceItemList(invoiceId)
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [invoiceId, locale])

  const columns: GridColDef[] = [
    {
      width: 300,
      field: 'id',
      headerName: t.SCREEN_COL_INVOICE_ITEM_LIST_ID,
      renderCell: (params: GridRenderCellParams) => (
        <Typography variant='body2' sx={{ color: 'text.primary' }}>
          {params.row.id}
        </Typography>
      )
    },
    {
      minWidth: 120,
      field: 'billing_date',
      headerName: t.SCREEN_COL_INVOICE_ITEM_LIST_DATE,
      renderCell: (params: GridRenderCellParams) => (
        <Typography variant='body2' sx={{ color: 'text.primary' }}>
          {dateFormatApi2DisplayYYYYMMDD(params.row.billing_date)}
        </Typography>
      )
    },
    {
      minWidth: 250,
      field: 'invoice_content',
      headerName: t.SCREEN_COL_INVOICE_ITEM_LIST_CONTENT,
      renderCell: (params: GridRenderCellParams) => (
        <Typography variant='body2' sx={{ color: 'text.primary' }}>
          {params.row.invoice_content}
        </Typography>
      )
    },
    {
      minWidth: 170,
      field: 'booking_no',
      headerName: t.SCREEN_COL_INVOICE_ITEM_LIST_BOOKING_NO,
      renderCell: (params: GridRenderCellParams) => (
        <Link href={`/booking/detail/${params.row.booking_no}`}>{params.row.booking_no}</Link>
      )
    },
    {
      width: 150,
      field: 'billing_amount',
      headerName: t.SCREEN_COL_INVOICE_ITEM_LIST_AMOUNT,
      valueGetter: params => Number(params.value || '0').toLocaleString(),
      renderCell: (params: GridRenderCellParams) => (
        <Typography variant='body2' sx={{ color: 'text.primary' }}>
          {Number(params.row.billing_amount || '0').toLocaleString()}
        </Typography>
      )
    },
    {
      width: 100,
      field: 'billing_currency_cd_iso',
      headerName: t.SCREEN_COL_INVOICE_ITEM_LIST_CURRENCY,
      renderCell: (params: GridRenderCellParams) => (
        <Typography variant='body2' sx={{ color: 'text.primary' }}>
          {params.row.billing_currency_cd_iso}
        </Typography>
      )
    },
    {
      width: 300,
      field: 'shop_status_cd',
      headerName: 'Actions',
      renderCell: (params: GridRenderCellParams) => {
        return (
          <>
            {String(status) == INVOICE_STATUS.UNCRAIMED && (
              <Button
                size='small'
                variant='outlined'
                color='secondary'
                onClick={() => onClickDeleteItem(params.row.id)}
                sx={{ mr: 2 }}
              >
                {t.BUTTON_DELETE}
              </Button>
            )}
          </>
        )
      }
    }
  ]

  return (
    <Card>
      <Head>
        <title>{titleMeta}</title>
      </Head>
      <CardHeader
        title={t.SCREEN_TITLE_INVOICE_ITEM_LIST}
        action={
          status == INVOICE_STATUS.UNCRAIMED ? (
            <>
              <Button onClick={onClickBill} variant='contained'>
                {t.BUTTON_BILL}
              </Button>
              <Button onClick={onClickDeposit} variant='contained' sx={{ ml: 3 }} color='info'>
                {t.BUTTON_DEPOSIT}
              </Button>
              <Button onClick={onClickWithdraw} variant='contained' sx={{ ml: 3 }} color='error'>
                {t.BUTTON_WITHDRAW}
              </Button>
            </>
          ) : status == INVOICE_STATUS.BILLED ? (
            <>
              <Button onClick={onClickDeposit} variant='contained' color='info'>
                {t.BUTTON_DEPOSIT}
              </Button>
              <Button onClick={onClickWithdraw} variant='contained' sx={{ ml: 3 }} color='error'>
                {t.BUTTON_WITHDRAW}
              </Button>
            </>
          ) : status == INVOICE_STATUS.DEPOSITED ? (
            <>
              <Button onClick={onClickWithdraw} variant='contained' color='error'>
                {t.BUTTON_WITHDRAW}
              </Button>
            </>
          ) : (
            <></>
          )
        }
      />
      <DataGrid
        autoHeight
        rows={invoiceItemService.invoiceList}
        columns={columns}
        slots={{ toolbar: ExportToolbar }}
        disableRowSelectionOnClick
        pageSizeOptions={[7, 10, 25, 50]}
        paginationModel={paginationModel}
        columnVisibilityModel={hideNameColumn}
        onPaginationModelChange={setPaginationModel}
        onColumnVisibilityModelChange={newValue => setHideNameColumn(newValue)}
        initialState={{
          columns: {
            columnVisibilityModel: {}
          }
        }}
      />
      <Dialog open={openBillDialog} onClose={handleBillClose} aria-labelledby='alert-dialog-title-bill'>
        <DialogTitle id='alert-dialog-title-bill'>{t.SCREEN_CONFIRM_STATUS_CHANGE_BILL}</DialogTitle>
        <DialogActions>
          <Button onClick={handleBillClose} color='secondary' autoFocus>
            {t.BUTTON_NO}
          </Button>
          <Button onClick={onClickConfirmBill}>{t.BUTTON_YES}</Button>
        </DialogActions>
      </Dialog>
      <Dialog open={openDepositDialog} onClose={handleDepositClose} aria-labelledby='alert-dialog-title-deposit'>
        <DialogTitle id='alert-dialog-title-bill'>{t.SCREEN_CONFIRM_STATUS_CHANGE_DEPOSIT}</DialogTitle>
        <DialogActions>
          <Button onClick={handleDepositClose} color='secondary' autoFocus>
            {t.BUTTON_NO}
          </Button>
          <Button onClick={onClickConfirmDeposit}>{t.BUTTON_YES}</Button>
        </DialogActions>
      </Dialog>
      <Dialog open={openWithdrawDialog} onClose={handleWithdrawClose} aria-labelledby='alert-dialog-title-withdraw'>
        <DialogTitle id='alert-dialog-title-withdraw'>{t.SCREEN_CONFIRM_STATUS_CHANGE_WITHDRAW}</DialogTitle>
        <DialogActions>
          <Button onClick={handleWithdrawClose} color='secondary' autoFocus>
            {t.BUTTON_NO}
          </Button>
          <Button onClick={onClickConfirmWithdraw}>{t.BUTTON_YES}</Button>
        </DialogActions>
      </Dialog>
      <Dialog open={openDeleteItemDialog} onClose={handleDeleteItemClose} aria-labelledby='alert-dialog-title-withdraw'>
        <DialogTitle id='alert-dialog-title-withdraw'>{t.SCREEN_CONFIRM_STATUS_CHANGE_WITHDRAW}</DialogTitle>
        <DialogActions>
          <Button onClick={handleDeleteItemClose} color='secondary' autoFocus>
            {t.BUTTON_NO}
          </Button>
          <Button onClick={onClickConfirmDeleteItem}>{t.BUTTON_YES}</Button>
        </DialogActions>
      </Dialog>
      <Snackbar
        anchorOrigin={{ horizontal: 'center', vertical: 'top' }}
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => {
          setSnackbarOpen(false)
        }}
      >
        <Alert
          onClose={() => {
            setSnackbarOpen(false)
          }}
          variant='filled'
          severity={severity}
          sx={{ width: '100%', fontSize: '1.5rem', color: '#fff' }}
        >
          {message}
        </Alert>
      </Snackbar>
      <Backdrop sx={{ color: '#fff', zIndex: theme => theme.zIndex.drawer + 1 }} open={invoiceItemService.loading}>
        <CircularProgress color='inherit' />
      </Backdrop>
    </Card>
  )
}

export default InvoiceList
