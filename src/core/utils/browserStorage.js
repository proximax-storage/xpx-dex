const storage = localStorage

function get (key) {
  return storage.getItem(key)
}

function set (key, value) {
  storage.setItem(key, value)
}

export {
  get,
  set
}
