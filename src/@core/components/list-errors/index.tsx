import { Alert, Stack } from '@mui/material'
import React from 'react'

type propsType = {
  errors: any
  setErrors: any
}

const ListErrors = ({ errors, setErrors }: propsType) => (
  <Stack spacing={2} sx={{ marginBottom: 5 }}>
    {Object.keys(errors).map(key => {
      return (
        <Alert
          key={key}
          severity='error'
          onClose={() => {
            setErrors(Object.keys(errors).filter((v, k) => k != Number(k)))
          }}
        >
          {errors[key]}
        </Alert>
      )
    })}
  </Stack>
)

export default ListErrors
