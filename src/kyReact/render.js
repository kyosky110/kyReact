import { diff } from './diff/index'
import { diffnew } from './diff/vdom'

export function render(vnode, container, dom) {
  // const dom = _render(vnode)
  return diffnew(vnode, container);
}