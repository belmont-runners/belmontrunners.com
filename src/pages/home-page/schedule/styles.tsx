import { styled } from '@mui/material/styles'
import Dialog from '@mui/material/Dialog'
import DialogContent from '@mui/material/DialogContent'
import IconButton from '@mui/material/IconButton'

export const ImageLightboxDialog = styled(Dialog)({
  '& .MuiDialog-paper': {
    backgroundColor: 'rgba(0, 0, 0, 0.92)',
    maxHeight: '95vh'
  }
})

export const ImageLightboxContent = styled(DialogContent)(({ theme }) => ({
  position: 'relative',
  padding: theme.spacing(1),
  textAlign: 'center'
}))

export const ImageLightboxCloseButton = styled(IconButton)(({ theme }) => ({
  position: 'absolute',
  right: theme.spacing(0.5),
  top: theme.spacing(0.5),
  zIndex: 1,
  color: theme.palette.common.white,
  backgroundColor: 'rgba(0, 0, 0, 0.45)',
  '&:hover': {
    backgroundColor: 'rgba(0, 0, 0, 0.65)'
  }
}))

export const ImageLightboxImg = styled('img')({
  maxWidth: '100%',
  maxHeight: '88vh',
  width: 'auto',
  height: 'auto',
  objectFit: 'contain',
  verticalAlign: 'middle'
})

export const EventRow = styled('div')({
  gap: '0.75rem'
})

export const RunnerIconImg = styled('img')(({ theme }) => ({
  [theme.breakpoints.down('sm')]: {
    width: 40,
    height: 'auto'
  }
}))

export const EventDetailsColumn = styled('div')({
  minWidth: 0
})

export const EventImageStripButton = styled('button')(({ theme }) => ({
  display: 'flex',
  flexShrink: 0,
  alignSelf: 'stretch',
  width: 140,
  cursor: 'pointer',
  border: 'none',
  padding: 0,
  backgroundColor: 'transparent',
  borderRadius: theme.shape.borderRadius,
  overflow: 'hidden',
  [theme.breakpoints.down('sm')]: {
    width: 72
  }
}))

export const EventImageStripImg = styled('img')({
  width: '100%',
  height: '100%',
  objectFit: 'cover',
  minHeight: 96,
  display: 'block'
})

export const WeatherAside = styled('div')({
  flexShrink: 0,
  alignSelf: 'center',
  minWidth: 90
})

export const MembersOnlyBadgeImg = styled('img')({
  width: '5em'
})

export const MapLinkLeadingWrap = styled('span')({
  paddingRight: '1em'
})
