import { diff } from './index'
import { removeNode, isSameNodeType } from './utils'
/**
 * 对比子节点
 * @param {*} dom 
 * @param {*} vchildren 
 */
export function diffChildren(dom, vchildren) {
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