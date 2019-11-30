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

export {
  createElement
}