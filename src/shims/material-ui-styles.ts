// Shim for @material-ui/core/styles -> @mui/material/styles + @mui/styles
// mui-datatables still imports makeStyles/withStyles from @material-ui/core/styles,
// but these were removed from @mui/material/styles in MUI v5+.
// This shim re-exports everything from @mui/material/styles and adds back
// makeStyles and withStyles from the @mui/styles compatibility package.

export * from '@mui/material/styles'
export { makeStyles, withStyles } from '@mui/styles'
