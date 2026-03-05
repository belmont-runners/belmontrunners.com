import React, { Component } from 'react'
import * as PropTypes from 'prop-types'

class ErrorBoundary extends Component {
  constructor(props: any) {
    super(props)
    this.state = { hasError: false }
  }

  componentDidCatch(err: Error, info: React.ErrorInfo) {
    this.setState({ hasError: true })
    console.error(err)
  }

  render() {
    return this.props.children
  }
}

// @ts-ignore
ErrorBoundary.propTypes = {
  children: PropTypes.node.isRequired
}

export default ErrorBoundary
