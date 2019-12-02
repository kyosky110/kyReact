export function diffAttributes(dom, vnode) {
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