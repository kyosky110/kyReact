import { typeNumber } from '../utils'
import { ComponentStatus } from '../component'
import { flattenChildren } from '../createElement'
import { mapProp } from './mapProps'


let mountIndex = 0 // 全局变量

function mountIndexAdd() {
  return mountIndex ++
}

export function diffnew(vnode, container, isUpdate) {
  const { type, props} = vnode
  const { children } = props
  let domNode

  if (typeof type === 'function') {
    domNode = mountComponent(vnode, container)
  } else if (typeof type === 'string' && type === '#text') {
    domNode = mountTextComponent(vnode, container)
  } else {
    domNode = document.createElement(type)
  }

  if (typeNumber(children) > 2 && children !== undefined) {
    const newChild = mountChild(children, domNode)
    props.children = newChild
  }

  mapProp(domNode, props) //为元素添加props
  vnode._hostNode = domNode //缓存真实节点

  if (isUpdate) {
    return domNode
  } else {
    vnode._mountIndex = mountIndexAdd()
    if (container) container.appendChild(domNode)
  }

  return domNode
}

function mountChild(childrenVnode, parentDomNode) {

  let childType = typeNumber(childrenVnode)
  let flattenChildList = childrenVnode
  if (childrenVnode === undefined) {
    flattenChildList = flattenChildren(childrenVnode)
  }

  if (childType === 8 && childrenVnode !== undefined) {
    flattenChildList._hostNode = mountNativeElement(flattenChildList, parentDomNode)
  }
  // list
  if (childType === 7) {
    flattenChildList = flattenChildren(childrenVnode)
    flattenChildList.forEach(item => {
      diffnew(item, parentDomNode)
    });
  }
  if (childType === 4 || childType === 3) {
    flattenChildList = flattenChildren(childrenVnode)
    mountTextComponent(flattenChildList, parentDomNode)
  }

  return flattenChildList
}

function mountNativeElement(vnode, container) {
  const domNode = diffnew(vnode, container)
  vnode._hostNode = domNode
  vnode._mountIndex = mountIndexAdd()
  return domNode
}

/**
 * 创建文本组件
 * @param {*} vnode 
 * @param {*} container 
 */
function mountTextComponent(vnode, container) {
  let textDomNode = document.createTextNode(vnode.props)
  container.appendChild(textDomNode)
  vnode._hostNode = textDomNode
  vnode._mountIndex = mountIndexAdd()
  return textDomNode
}

function mountComponent(vnode, container) {
  const { type, props } = vnode

  const Component = type
  const instance = new Component(props)

  if (instance.componentWillMount) {
    instance.componentWillMount()
  }

  const render = instance.render()
  if (!render) console.warn('你可能忘记在组件render()方法中返回jsx了')

  const domNode = diffnew(render, container)

  if (instance.componentDidMount) {
    instance.lifeCycle = ComponentStatus.MOUNTTING
    instance.componentDidMount()
    instance.componentDidMount = null //暂时不知道为什么要设置为空
    instance.lifeCycle = ComponentStatus.MOUNT
  }

  instance.vnode = render
  instance.vnode._hostNode = domNode //用于在更新时期oldVnode的时候获取_hostNode
  instance.vnode._mountIndex = mountIndexAdd()

  vnode._instance = instance

  instance._updateInLifeCycle() // componentDidMount之后一次性更新

  return domNode
}