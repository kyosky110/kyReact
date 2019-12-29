
/**事件合成，暂时这么写 */
export function SyntheticEvent(event) {
  if (event.nativeEvent) {
    return event
  }
  for( let name in event) {
    if (!eventProto[name]) {
      this[name] = event[name]
    }
  }
  if (!this.target) {
    this.target = event.srcElement
  }
  this.fixEvent()
  this.timeStamp = new Date() - 0
  this.nativeEvent = event
}

let eventProto = SyntheticEvent.prototype = {
  fixEvent: function fixEvent() {}, //留给以后扩展用
  preventDefault: function preventDefault() {
    let e = this.nativeEvent || {}
    e.returnValue = this.returnValue = false
    if (e.preventDefault) {
      e.preventDefault()
    }
  },
  fixHooks: function fixHooks(){},
  stopPropagation: function stopPropagation() {
    let e = this.nativeEvent || {}
    e.cancelBubble = this._stopPropagation = true
    if (e.stopPropagation) {
      e.stopPropagation()
    }
  },
  persist: function noop() {},
  stopImmediatePropagation: function stopImmediatePropagation() {
    this.stopPropagation();
    this.stopImmediate = true;
  },
  toString: function toString() {
    return "[object Event]";
  }
}