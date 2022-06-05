export const debounce = (callback, limit = 300) => {
  let timeout
  return function (...args) {
    clearTimeout(timeout)
    timeout = setTimeout(() => { callback.apply(this, args) }, limit)
  }
}

export const throttle = (callback, limit = 300) => {
  let waiting = false
  return function () {
    if (!waiting) {
      callback.apply(this, arguments)
      waiting = true
      setTimeout(() => { waiting = false }, limit)
    }
  }
}