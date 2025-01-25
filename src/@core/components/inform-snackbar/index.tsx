import * as React from 'react'
import Snackbar, { SnackbarProps } from '@mui/material/Snackbar'
import MuiAlert, { AlertProps, AlertColor } from '@mui/material/Alert'

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant='filled' {...props} />
})

type informSnackbarProps = SnackbarProps & {
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
  severity?: AlertColor
}

export default function InformSnackbar(props: informSnackbarProps) {
  const { autoHideDuration, message, setOpen, ...remainingProps } = props
  const handleClose = (event: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return
    }

    setOpen(false)
  }

  return (
    <div>
      <Snackbar {...remainingProps} autoHideDuration={autoHideDuration ? autoHideDuration : 3000} onClose={handleClose}>
        <Alert
          onClose={handleClose}
          severity={props.severity ? props.severity : 'info'}
          sx={{ width: '100%', fontSize: '1.2rem' }}
        >
          {message}
        </Alert>
      </Snackbar>
    </div>
  )
}
