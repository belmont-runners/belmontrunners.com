import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import dayjs from 'dayjs'
import * as PropTypes from 'prop-types'
import React from 'react'

function DatePickerWrapper(props: any) {
  const {
    input: { name, onChange, value, ...restInput },
    meta,
    ...rest
  } = props
  const showError =
    ((meta.submitError && !meta.dirtySinceLastSubmit) || meta.error) &&
    meta.touched

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DatePicker
        {...rest}
        label={rest.label}
        format={'YYYY-MM-DD'}
        onChange={(newValue: dayjs.Dayjs | null) => onChange(newValue)}
        value={value === '' || value === null ? null : dayjs(value)}
        slotProps={{
          textField: {
            name,
            helperText: showError ? meta.error || meta.submitError : undefined,
            error: showError,
            inputProps: restInput,
          }
        }}
      />
    </LocalizationProvider>
  )
}

DatePickerWrapper.propTypes = {
  input: PropTypes.object,
  meta: PropTypes.object
}

export default DatePickerWrapper
