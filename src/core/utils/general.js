/**
 *
 *
 * @param {*} amount
 * @param {number} [d=6]
 * @returns
 */
function amountFormatter (amount, d = 6) {
  const amountDivisibility = Number(amount) / Math.pow(10, d)
  return amountDivisibility.toLocaleString('en-us', {
    minimumFractionDigits: d
  })
}

/**
 *
 *
 * @param {*} title
 * @param {*} show
 * @param {*} description
 * @param {*} image
 * @param {*} route
 * @param {*} children
 * @param {*} viewChildren
 * @param {*} className
 * @returns
 */
function buildBoxServices (title, show, description, image, route, children, viewChildren, className) {
  return {
    title: title,
    show: show,
    description: description,
    image: image,
    route: route,
    children: children,
    viewChildren: viewChildren,
    className: className
  }
}

/**
 *
 *
 * @param {*} action
 * @param {*} disabled
 * @param {*} color
 * @param {*} loading
 * @param {*} text
 * @returns
 */
function buildButton (action, disabled, color, loading, text) {
  return {
    action,
    disabled,
    color,
    loading,
    text
  }
}

/**
 *
 *
 * @param {*} text
 * @param {*} value
 * @param {boolean} [sortable=false]
 * @returns
 */
function buildTableHeader (text, value, sortable = false) {
  return {
    text,
    value,
    sortable
  }
}
/**
 *
 *
 * @param {*} data
 * @param {*} cantPart
 * @returns
 */
function getDataPart (data, cantPart) {
  return {
    part1: data.slice(0, data.length - cantPart),
    part2: data.slice(-cantPart)
  }
}

/**
 *
 *
 * @param {*} d
 * @param {*} e
 * @param {*} r
 * @returns
 */
function replaceData (d, e, r) {
  return (d.includes(e) === true) ? d.split(e).join(r) : d
}

/**
 *
 *
 * @param {*} value1
 * @param {*} value2
 * @param {string} [text='']
 * @returns
 */
function validateMatch (value1, value2, text = '') {
  return value1 === value2 || `${text} must match`
}

export {
  amountFormatter,
  buildBoxServices,
  buildButton,
  buildTableHeader,
  getDataPart,
  replaceData,
  validateMatch
}
