import { renderComponent } from './diff'
class Component {

  constructor(props) {
    this.props = props
    this.state = this.state || {}
  }

  setState(update) {
    // 合并
    this.state = {...this.state, ...update}
    renderComponent(this)
  }

  render() {

  }
}

export default Component;