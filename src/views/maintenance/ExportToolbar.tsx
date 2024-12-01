// ** MUI Imports
import Box from '@mui/material/Box'
import { GridToolbarExport } from '@mui/x-data-grid'

const ExportToolbar = () => {
  return (
    <Box
      sx={{
        gap: 2,
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        p: theme => theme.spacing(2, 5, 4, 5)
      }}
    >
      <GridToolbarExport csvOptions={{ utf8WithBom: true }} printOptions={{ disableToolbarButton: false }} />
    </Box>
  )
}

export default ExportToolbar
