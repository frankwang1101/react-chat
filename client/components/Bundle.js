import React, { Component } from 'react'

class Bundle extends Component {
  
  constructor(...args){
    super(...args);
    this.state = {
      mod: null
    }
  }

  componentWillMount() {
    this.load(this.props)
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.load !== this.props.load) {
      this.load(nextProps)
    }
  }

  load(props) {
    this.setState({
      mod: null
    })
    props.load((mod) => {
      this.setState({
        // handle both es imports and cjs
        mod: mod.default ? mod.default : mod
      })
    })
  }

  render() {
    if(!this.state.mod){
      return false;
    }
    return this.props.children(this.state.mod)
  }
}

export default Bundle;
