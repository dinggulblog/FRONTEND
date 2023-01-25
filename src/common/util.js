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

export const searchParentComment = (parentComment, parentId = null) => {
  const { _id, childComments } = parentComment
        
  if (_id === parentId) {
    return parentComment
  }
  else if (Array.isArray(childComments)) {
    let result = null
    childComments.forEach(childComment => result = searchParentComment(childComment, parentId))
    return result
  }

  return null
}

export const resizeTextarea = (e) => {
  e.target.style.height = ''
  e.target.style.height = e.target.scrollHeight + 'px'
}



