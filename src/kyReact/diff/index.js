import { diffChildren } from './children'
import { diffAttributes } from './props'
import { isSameNodeType, removeNode } from './utils'
/**
 * 
 * @param {HTMLElement} dom 真实dom
 * @param {vnode} vnode 虚拟dom
 * @param {HTMLElement} container 容器
 * @returns {HTMLElement} 更新后的DOM
 */
export function diff(dom, vnode, container) {

  const ret = diffNode(dom, vnode)

  if (container && ret.parentNode !== container) {
    container.appendChild(ret)
  }

  return ret
}


export function diffNode(dom, vnode) {

  let newDom = dom

  if (vnode === undefined || vnode === null || typeof vnode === 'boolean') {
    vnode = ''
  }
  if (typeof vnode === 'number') {
    vnode = String(vnode)
  }

  const {
    type,
    props
  } = vnode

  // 注意 有性能问题， 文本 加{} 可能会生成多个数组，会多次遍历，可以打断点观看
  // 如果是文本
  // debugger
  if (typeof vnode === 'string') {
    // 如果当前的DOM就是文本节点，则直接更新内容
    if (dom && dom.nodeType === 3) {
      if (dom.textContent !== vnode) {
        dom.textContent = vnode
      }
    }else {
      // 如果DOM不是文本节点，则新建一个文本节点DOM，并移除掉原来的
      newDom = document.createTextNode(vnode)
      if (dom && dom.parentNode) {
        dom.parentNode.replaceChild(newDom, dom)
      }
    }

    return newDom
  }else if (typeof type === 'function'){

    return diffComponent(dom, vnode)
  }

  if (!dom || !isSameNodeType(dom, vnode)) {
    newDom = document.createElement(type)

    if (dom) {
      [...dom.childNodes].map(newDom.appendChild)// 将原来的子节点移到新节点下
      if (dom.parentNode) {
        dom.parentNode.replaceChild(newDom, dom) // 移除掉原来的DOM对象
      }
    }
  }

  if (props && props.children && props.children.length > 0
     || (newDom.childNodes && newDom.childNodes.length > 0)) {
      diffChildren(newDom, props.children)
  }

  diffAttributes(newDom, vnode)
  return newDom
}

/**
 * 对比 自定义组件
 * @param {*} dom 
 * @param {*} vnode 
 */
function diffComponent(dom, vnode) {

  let c = dom && dom._component
  let oldDom = dom

  // 如果组件类型没有变化，则重新set props
  if (c && c.constructor === vnode.type) {
    setComponentProps(c, vnode.props)
    dom = c.base
  }else {
    // 如果组件类型变化，则移除掉原来组件，并渲染新的组件
    if (c) {
      unmountComponent(c)
      oldDom = null
    }
    c = createComponent(vnode)
    setComponentProps(c, vnode.props)
    dom = c.base

    if (oldDom && dom !== oldDom) {
      oldDom._component = null
      removeNode(oldDom)
    }
  }

  return dom
}

function createComponent(vnode) {
  const {
    type,
    props
  } = vnode
  let component
  if (type.prototype && type.prototype.render) {
    // 如果是类
    component = new type(props)
  } else {
    // 如果是函数
    component = new Component(props)
    component.constructor = type;
    component.render = function() {
        return this.constructor(props);
    }
  }
  return component
}

// set props
function setComponentProps(component, props) {

  if (!component.base) {
    component.componentWillMount && (component.componentWillMount())
  } else if (component.componentWillReceiveProps) {
    component.componentWillReceiveProps(props)
  }

  component.props = props;

  renderComponent(component);

}

export function renderComponent(component) {
  let base;
  const renderM = component.render()

  if (component.base && component.componentWillUpdate) {
    component.componentWillUpdate()
  }
  base = diffNode(component.base, renderM)

  if (component.base) {
    component.componentDidUpdate && (component.componentDidUpdate())
  } else if (component.componentDidMount) {
    component.componentDidMount()
  }

  component.base = base
  base._component = component
}

function unmountComponent(component) {
  if ( component.componentWillUnmount ) component.componentWillUnmount();
  removeNode(component.base);
}
