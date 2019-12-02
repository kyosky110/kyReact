import { diff } from './diff/index'

export function render(vnode, container, dom) {
  // const dom = _render(vnode)
  return diff(dom, vnode, container);
}