import { diff } from './diff/index'

export function render(vnode, container, dom) {
  // const dom = _render(vnode)
  return diff(dom, vnode, container);
}

// function _render(vnode) {

//   if (vnode === undefined || vnode === null || typeof vnode === 'boolean') {
//     vnode = ''
//   }
//   if (typeof vnode === 'number') {
//     vnode = String(vnode)
//   }
//   const {
//     type,
//     props
//   } = vnode
//   let dom

//   // 注意 有性能问题， 文本 加{} 可能会生成多个数组，会多次遍历，可以打断点观看
//   // 如果是文本
//   // debugger
//   if (typeof vnode === 'string') {
//     const textNode = document.createTextNode(vnode)
//     dom = textNode
//   }else if (typeof type === 'function'){
//     const instance = createComponent(vnode)
//     renderComponent(instance)
//     dom = instance.base
//     // const renderM = instance.render()
//     // dom = _render(renderM)
//   }else {
//     // 否则 生成对应的dom 节点
//     dom = document.createElement(vnode.type)
//   }

//   if (props) {
//     Object.keys(props).forEach(key => {
//       const value = props[key]
//       setAttribute(dom, key, value)
//     })
//   }
//   props && props.children && props.children.forEach(child => render(child, dom))
//   return dom
// }

// // 有个疑问 如果props要传给子组件 怎么办
// function setAttribute(dom, key, value) {
//   if (key === 'className') key = 'class'

//   // 如果是监听方法
//   if (/on\w+/.test(key)) {
//     key = key.toLowerCase()
//     dom[key] = value || ''
//   } else if (key === 'style') {
//     if (value) {
//       if (typeof value === 'string') {
//         dom.style.cssText = value
//       }else if (typeof value === 'object') {
//         Object.keys(value).forEach(k => {
//           dom.style[k] = (typeof value[k] === 'number') ? value[k] + 'px' : value[k]
//         })
//       }
//     }
//   } else if (key === 'children') {
//     return
//   }else {
//     if (value) {
//       dom.setAttribute(key, value)
//     } else {
//       dom.removeAttribute(key);
//     }
//   }
// }

// function createComponent(vnode) {
//   const {
//     type,
//     props
//   } = vnode
//   let component
//   if (type.prototype && type.prototype.render) {
//     // 如果是类
//     component = new type(props)
//   } else {
//     // 如果是函数
//     component = new Component(props)
//     component.constructor = type;
//     component.render = function() {
//         return this.constructor(props);
//     }
//   }
//   return component
// }

// // set props
// function setComponentProps( vnode) {
//   if ( !component.base ) {
//       if ( component.componentWillMount ) component.componentWillMount();
//   } else if ( component.componentWillReceiveProps ) {
//       component.componentWillReceiveProps( props );
//   }

//   component.props = props;

//   renderComponent( component );

// }

// export function renderComponent(component) {
//   let base;
//   const renderM = component.render()
//   base = _render(renderM)

//   if (component.base && component.base.parentNode) {
//     component.base.parentNode.replaceChild(base, component.base)
//   }
//   component.base = base
//   base._component = component
// }