import { enqueueSetState } from './setStateQueue'

export const ComponentStatus = {
  CREATE: 0,//创造节点
  MOUNT: 1,//节点已经挂载
  UPDATING: 2,//节点正在更新
  UPDATED: 3,//节点已经更新
  MOUNTTING: 4//节点正在挂载
}

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

  _updateInLifeCycle() {
    
  }

  componentWillReceiveProps() {}
  componentWillMount() {}
  componentDidMount() {}
  componentWillUnmount() {}
  componentDidUnmount() {}

  render() { }
}

export {
  Component
};