const storage = localStorage

/**
 *
 *
 */
function clear () {
  storage.clear()
}
/**
 *
 *
 * @param {*} key
 * @returns
 */
function get (key) {
  return storage.getItem(key)
}
/**
 *
 *
 * @param {*} key
 * @param {*} value
 */
function set (key, value) {
  storage.setItem(key, value)
}

export {
  clear,
  get,
  set
}
