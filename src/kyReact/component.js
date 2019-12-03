import { enqueueSetState } from './setStateQueue'
class Component {

  constructor(props) {
    this.props = props
    this.state = this.state || {}
  }

  setState(update) {
    // 合并
    // this.state = {...this.state, ...update}
    enqueueSetState(update, this)
  }

  render() {

  }
}

export default Component;