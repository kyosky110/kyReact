import { typeNumber } from './utils'
function createElement(type, props, ...children) {
  let normalizedProps = {}

  for(let i in props) {
    if (i !== 'key' && i !== 'ref') normalizedProps[i] = props[i];
  }
  normalizedProps.children = children

  //设置 default props
  if (typeof type === 'function' && type.defaultProps != null) {
		for (i in type.defaultProps) {
			if (normalizedProps[i] === undefined) {
				normalizedProps[i] = type.defaultProps[i];
			}
		}
	}
  return createVNode(
		type,
		normalizedProps,
		props && props.key,
		props && props.ref
	)
}

function createVNode(type, props, key, ref) {
  const vnode = {
    type,
    props,
    key,
    ref
  }
  return vnode
}

/**
 * 实际上这里做的事情就是将文字节点全部转换成Vnode
 * 相邻的string 变为一个string 减少节点数
 * @param {*} children 
 */
export function flattenChildren(children) {

  if (children === undefined) return children

  let length = children.length
  let childrenArray = [],
      isLastSimple = false, //判断上一个元素是否是string或者number
      lastString = '',
      childType = typeNumber(children)
  
  if (childType === 3 || childType === 4) {
    return children
  }

  if (childType !== 7) return children

  children.forEach((item, index) => {
    // 没有太理解这个数组 但应该很少出现吧
    /**
     * 现在理解了，比如for循环里面 item 数组[1,2,3].map((item)=>(<span></span>)) 
     * 到这儿 item=[{span},{},{}] 挨着的，所以可以取出来
     */
    if (typeNumber(item) === 7) {
      if (isLastSimple) {
        childrenArray.push(lastString)
      }
      item.forEach((item2)=>{
        childrenArray.push(item2)
      })
      lastString = ''
      isLastSimple = false
    }
    if (typeNumber(item) === 3 || typeNumber(item) === 4) {
      lastString += item
      isLastSimple = true
    }
    if (typeNumber(item) !== 3 && typeNumber(item) !== 4 && typeNumber(item) !== 7) {
      if (isLastSimple) {
        childrenArray.push(lastString)
        childrenArray.push(item)
        lastString = ''
        isLastSimple = false
      } else {
        childrenArray.push(item)
      }
    }
    if (length - 1 === index) {
      if (isLastSimple) childrenArray.push(lastString)
    }
  })

  return childrenArray
}


export {
  createElement
}