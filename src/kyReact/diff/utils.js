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