let __type = Object.prototype.toString

let numberMap = {
  //null undefined IE6-8这里会返回[object Object]
  '[object Boolean]': 2,
  '[object Number]': 3,
  '[object String]': 4,
  '[object Function]': 5,
  '[object Symbol]': 6,
  '[object Array]': 7
}

// undefined: 0, null: 1, boolean:2, number: 3, string: 4, function: 5, symbol:6, array: 7, object:8
export function typeNumber(data) {
  if (data === null) {
    return 1
  }
  if (data === void 666) {
    return 0
  }
  let a = numberMap[__type.call(data)]
  return a || 8
}

export function isSameNodeType(dom, vnode) {
  if (typeof vnode === 'string' || typeof vnode === 'number') {
    return dom.nodeType === 3
  }

  if (typeof vnode.type === 'string') {
    return dom.nodeName.toLowerCase() === vnode.type.toLowerCase()
  }

  return dom && dom._component && dom._component.constructor === vnode.type
}

export function removeNode(dom) {

  if (dom && dom.parentNode) {
    dom.parentNode.removeChild(dom)
  }
}

export function didMount(component) {
  if (component && component.componentDidMount) {
    component.componentDidMount()
  }
}