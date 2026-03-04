import { IconButton, InputBase, Paper } from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'
import React from 'react'
import * as PropTypes from 'prop-types'

interface Props {
  onChange: (arg0: string) => void
  placeholder?: string
  children?: any
}

function SearchBox({ onChange, placeholder = 'Search', children }: Props) {
  function handleSearch(event: any) {
    onChange(event.target.value)
  }

  //    {/*<div className='d-flex justify-content-center row'>*/}
  return (
    <div>
      <Paper className="mx-auto my-4" sx={{
        padding: '2px 4px',
        display: 'flex',
        alignItems: 'center',
        maxWidth: 500,
        flexGrow: 1
      }}>
        <InputBase
          sx={{ marginLeft: 1, flexGrow: 1 }}
          placeholder={placeholder}
          onChange={handleSearch}
        />
        <IconButton sx={{ padding: '10px' }} aria-label="Search">
          <SearchIcon />
        </IconButton>
      </Paper>
      {children}
    </div>
  )
}

SearchBox.propTypes = {
  onChange: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node
  ])
}

export default SearchBox
