import React from 'react'
import MuiTextField from '@mui/material/TextField'
import MuiSelect from '@mui/material/Select'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import FormHelperText from '@mui/material/FormHelperText'

/**
 * Adapter components to bridge React Final Form with MUI v6.
 * Replaces the deprecated `final-form-material-ui` package.
 */

export function TextField(props: any) {
  const {
    input: { name, onChange, value, ...restInput },
    meta,
    ...rest
  } = props
  const showError =
    ((meta.submitError && !meta.dirtySinceLastSubmit) || meta.error) &&
    meta.touched

  return (
    <MuiTextField
      {...rest}
      name={name}
      helperText={showError ? meta.error || meta.submitError : undefined}
      error={showError}
      inputProps={restInput}
      onChange={onChange}
      value={value}
    />
  )
}

export function Select(props: any) {
  const {
    input: { name, onChange, value, ...restInput },
    meta,
    label,
    children,
    ...rest
  } = props
  const showError =
    ((meta.submitError && !meta.dirtySinceLastSubmit) || meta.error) &&
    meta.touched

  return (
    <FormControl error={showError} {...rest}>
      {label && <InputLabel>{label}</InputLabel>}
      <MuiSelect
        name={name}
        onChange={onChange}
        value={value}
        label={label}
        inputProps={restInput}
      >
        {children}
      </MuiSelect>
      {showError && (
        <FormHelperText>{meta.error || meta.submitError}</FormHelperText>
      )}
    </FormControl>
  )
}
