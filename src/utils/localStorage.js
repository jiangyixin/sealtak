export default {
  get: (key) => {
    if (!window.localStorage) return false
    if (!Boolean(window.localStorage && window.localStorage.hasOwnProperty(key))) {
      return null
    } else {
      return JSON.parse(window.localStorage.getItem(key))
    }
  },
  set: (key, data) => {
    if (!window.localStorage) return false
    window.localStorage.setItem(key, JSON.stringify(data))
    return true
  },
  has: (key) => {
    return Boolean(window.localStorage && window.localStorage.hasOwnProperty(key))
  },
  del: (key) => {
    if (window.localStorage) window.localStorage.removeItem(key)
  },
  // 模糊删除
  delLike: (key) => {
    if (window.localStorage) {
      for(let name in window.localStorage) {
        if(name.indexOf(key) > -1) {
          window.localStorage.removeItem(key)
        }
      }
    }
  },
  clear: () => {
    if (window.localStorage) window.localStorage.clear()
  }
}
