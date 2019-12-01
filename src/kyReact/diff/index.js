
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

function diffNode(dom, vnode) {

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

/**
 * 对比子节点
 * @param {*} dom 
 * @param {*} vchildren 
 */
function diffChildren(dom, vchildren) {
  const domChildren = dom.childNodes
  const children = []

  const keyed = {}

  // 将有key的节点和没有key的节点分开
  if (domChildren.length > 0){
    for (let i = 0; i < domChildren.length; i++) {
      const child = domChildren[i];
      const key = child.key
      if (key) {
        keyed[key] = child
      }else {
        children.push(child)
      }
    }
  }

  if (vchildren && vchildren.length > 0) {
    let min = 0
    let childrenLen = children.length

    for (let i = 0; i < vchildren.length; i++) {
      const vchild = vchildren[i];
      const key = vchild.key
      let child

      // 如果有key，找到对应key值的节点
      if (key) {
        if (keyed[key]) {
          child = keyed[key]
          keyed[key] = undefined
        }
      } else if (min < childrenLen) {
        // 如果没有key，则优先找类型相同的节点
        for (let j = 0; j < childrenLen; j++) {
          let c = children[j]
          if (c && isSameNodeType(c, vchild)) {
            child = c
            children[j] = undefined

            if (j === childrenLen - 1) childrenLen--
            if (j === min) min++
            break
          }
        }
      }

      // 对比
      child = diff(child, vchild)
      
      // 更新DOM
      const f = domChildren[i]
      if (child && child !== dom && child !== f) {
        // 如果更新前的对应位置为空，说明此节点是新增的
        if (!f) {
          dom.appendChild(child)
        } else if (child === f.nextSibling) {
          // 如果更新后的节点和更新前对应位置的下一个节点一样，说明当前位置的节点被移除了
          removeNode(f)
        } else {
          // 将更新后的节点移动到正确的位置
          // 注意insertBefore的用法，第一个参数是要插入的节点，第二个参数是已存在的节点
          dom.insertBefore(child, f)
        }
      }
    }
  }
}

function diffAttributes(dom, vnode) {
  const currentAttr = {} // 当前DOM的属性
  const vAttr = vnode.props // 虚拟DOM的属性

  for (let i = 0; i < dom.attributes.length; i++) {
    const attr = dom.attributes[i];
    currentAttr[attr.name] = attr.value
  }

  // 如果原来的属性不在新的属性当中，则将其移除掉（属性值设为undefined）
  for (let name in currentAttr) {
    if (!(name in vAttr)) {
      setAttribute(dom, name, undefined)
    }
  }
// 更新新的属性值
  for (let name in vAttr) {
    if (currentAttr[name] !== vAttr[name]) {
      setAttribute(dom, name, vAttr[name])
    }
  }
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

  component.props = props;

  renderComponent(component);

}

export function renderComponent(component) {
  let base;
  const renderM = component.render()
  base = diffNode(component.base, renderM)

  // if (component.base && component.base.parentNode) {
  //   component.base.parentNode.replaceChild(base, component.base)
  // }
  component.base = base
  base._component = component
}

function unmountComponent(component) {
  if ( component.componentWillUnmount ) component.componentWillUnmount();
  removeNode(component.base);
}

function isSameNodeType(dom, vnode) {
  if (typeof vnode === 'string' || typeof vnode === 'number') {
    return dom.nodeType === 3
  }

  if (typeof vnode.type === 'string') {
    return dom.nodeName.toLowerCase() === vnode.type.toLowerCase()
  }

  return dom && dom._component && dom._component.constructor === vnode.type
}

function removeNode(dom) {

  if (dom && dom.parentNode) {
    dom.parentNode.removeChild(dom)
  }
}

// 有个疑问 如果props要传给子组件 怎么办
function setAttribute(dom, key, value) {
  if (key === 'className') key = 'class'

  // 如果是监听方法
  if (/on\w+/.test(key)) {
    key = key.toLowerCase()
    dom[key] = value || ''
  } else if (key === 'style') {
    if (value) {
      if (typeof value === 'string') {
        dom.style.cssText = value
      }else if (typeof value === 'object') {
        Object.keys(value).forEach(k => {
          dom.style[k] = (typeof value[k] === 'number') ? value[k] + 'px' : value[k]
        })
      }
    }
  } else if (key === 'children') {
    return
  }else {
    if (value) {
      dom.setAttribute(key, value)
    } else {
      dom.removeAttribute(key);
    }
  }
}