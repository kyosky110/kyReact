import { renderComponent } from './diff/index'

const stateTaskQueue = []
const renderQueue = []

/**
 * 进入任务栈(需要了解EventLoop 宏观任务，微观任务)
 * @param {*} fn 
 */
function defer(fn) {
  return Promise.resolve().then(fn)
}

export function enqueueSetState(stateChange, component) {
  // if ( stateTaskQueue.length === 0 ) {
  //   defer( flush );
  // }

  stateTaskQueue.push({
    stateChange,
    component
  })

  if (!renderQueue.some(item => item === component)) {
    renderQueue.push(component)
  }
  
  defer( flush );
}

/**
 * 清空栈
 */
function flush() {
  let item, component

  while (item = stateTaskQueue.shift()) {
    const { stateChange, component } = item

    // 如果没有prevState，则将当前的state作为初始的prevState
    if (!component.prevState) {
      component.prevState = Object.assign({}, component.state)
    }

    // 如果stateChange是一个方法，也就是setState的第二种形式
    if (typeof stateChange === 'function') {
      Object.assign(component.state, stateChange(component.prevState, component.props))
    } else {
      // 如果stateChange是一个对象，则直接合并到setState中
      Object.assign(component.state, stateChange)
    }

    component.prevState = component.state
  }

  while(component = renderQueue.shift()) {
    renderComponent(component)
  }
}