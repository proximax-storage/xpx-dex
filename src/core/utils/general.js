import store from '@/store'
import Vue from 'vue'
import { ExchangeOfferType } from 'tsjs-xpx-chain-sdk/dist/src/model/transaction/ExchangeOfferType'

/**
 *
 *
 * @param {*} amount
 * @param {number} [d=6]
 * @returns
 */
function amountFormatter (amount, divisibility = 6) {
  return Number(amount / Math.pow(10, divisibility)).toLocaleString('en-us', {
    minimumFractionDigits: divisibility
  })
}

function formValue (cant, divisibility = 6) {
  return parseFloat(cant.toString().replace(/,/g, '')).toFixed(divisibility)
}

function formValueParse (cant, price, divisibility = 6) {
  return quantityStringToInt(String(formValue(cant * price, divisibility)))
}

/**
 *
 *
 * @param {*} cant
 * @param {string} [amount='0']
 * @returns
 */
function addZerosQuantity (cant, amount = '0') {
  const data = '0'
  if (amount === '0') {
    for (let index = 0; index < cant - 1; index++) {
      amount += data
    }
  } else {
    for (let index = 0; index < cant; index++) {
      amount += data
    }
  }
  return amount
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
   * Calculate duration based in days
   *
   * @param {number} duration
   * @returns
   * @memberof GeneralService
   */
function calculateDurationforDay (duration) {
  return duration * 5760
}
/**
 *  Calculate Expire tx
 * @param {*} durationCompact
 */
function calculateDurationExpire (durationCompact) {
  let seconds = durationCompact * 15
  let days = Math.floor(seconds / (3600 * 24))
  seconds -= days * 3600 * 24
  let hrs = Math.floor(seconds / 3600)
  seconds -= hrs * 3600
  let mnts = Math.floor(seconds / 60)
  seconds -= mnts * 60
  const response = days + ' days, ' + hrs + ' Hrs, ' + mnts + ' Minutes, ' + seconds + ' Seconds'
  return response
}
/**
 *  Invert type offert
 * @param {*} durationCompact
 */
function typeInvert (type = null) {
  let typeV = null
  if (type === 'buy') {
    typeV = 'sell'
  }
  if (type === 'sell') {
    typeV = 'buy'
  }
  return typeV
}
/**
 *
 *
 * @param {*} itemName
 * @param {*} text
 */
function doCopy (itemName, text) {
  Vue.prototype.$copyText(text).then(
    e => {
      store.dispatch('showMSG', {
        snackbar: true,
        text: `${itemName} copied`,
        color: 'success'
      })
    },
    e => {
      store.dispatch('showMSG', {
        snackbar: true,
        text: `Can not copy`,
        color: 'error'
      })
    }
  )
}
/**
 *
 * @param {*} stringOne
 * @param {*} stringTwo
 */
function differString (a, b) {
  let i = 0
  let j = 0
  let result = ''

  while (j < b.length) {
    if (a[i] !== b[j] || i === a.length) { result += b[j] } else { i++ }
    j++
  }
  return result
}
/**
 *  obj type number
 * @param {*} obj
 */
function sumObject (obj) {
  let sum = 0
  if (obj) {
    for (const p in obj) {
      sum = sum + obj[p]
    }
  }
  return sum
}

/**
 *
 * @param {*} price
 */
function formatterPrice (price) {
  const priceFormatte = price.toString().split(',').join('').split('.').join('')

  return Number(priceFormatte)
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
 * @param {*} action
 * @param {*} hash
 * @param {*} typeTransaction
 * @param {*} dataRequired
 * @returns
 */
function buildMonitorHash (action, hash, typeTransaction, dataRequired = []) {
  return {
    action,
    hash,
    typeTransaction,
    dataRequired
  }
}

/**
 *
 *
 * @param {*} quantity
 * @param {number} [divisibility=6]
 * @returns
 */
function quantityStringToInt (quantity, divisibility = 6) {
  let rQuantity = null
  if (quantity !== '' && quantity !== null && Number(quantity) !== 0) {
    const arrCifraQuantity = quantity.toString().replace(/,/g, '').split('.')
    let decimal = null
    if (arrCifraQuantity.length < 2) {
      decimal = addZerosQuantity(divisibility)
    } else {
      const arrDecimals = arrCifraQuantity[1].split('')
      decimal = addZerosQuantity(divisibility - arrDecimals.length, arrCifraQuantity[1])
    }
    rQuantity = `${arrCifraQuantity[0]}${decimal}`
  }
  return Number(rQuantity)
}

/**
 *
 *
 * @param {*} quantity
 * @param {number} [divisibility=6]
 * @returns
 */
function quantityStringToIntMath (quantityValue, divisibility = 6) {
  const quantity = quantityValue
  let rQuantity = null
  if (quantity !== '' && quantity !== null && Number(quantity) !== 0) {
    const arrCifraQuantity = quantity.toString().replace(/,/g, '').split('.')
    let decimal = null
    if (arrCifraQuantity.length < 2) {
      decimal = addZerosQuantity(divisibility)
    } else {
      const arrDecimals = arrCifraQuantity[1].split('')
      decimal = addZerosQuantity(divisibility - arrDecimals.length, arrCifraQuantity[1])
    }
    rQuantity = `${arrCifraQuantity[0]}${decimal}`
  }
  return Number(rQuantity)
}

function priceFormatter (quantity) {
  const value = String(quantity)

  return Number(value.split('.').join(''))
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

/**
 *
 *
 * @param {*} [value=[]]
 * @returns
 */
function validateZero (value = []) {
  let valueR = true
  for (let index = 0; index < value.length; index++) {
    const item = value[index]
    let amount = null
    try {
      amount = parseFloat(item.split(',').join(''))
    } catch (error) {
      amount = Number(item)
    }
    if (amount === 0) {
      valueR = false
      break
    }
  }
  return valueR
}

/**
 * Verify type offer for name
 *
 * @param {number} itemType
 * @returns
 * @memberof GeneralService
 */
function verifyTypeOfferName (itemType) {
  const type = [
    {
      type: ExchangeOfferType.SELL_OFFER,
      name: 'SELL'
    },
    {
      type: ExchangeOfferType.BUY_OFFER,
      name: 'BUY'
    }
  ]
  const nameType = type.find(x => x.type === itemType).name
  return nameType
}
function showMsgStatusNode () {
  if (store.getters['nodesStoreNew/nodeStatus'] === 0) {
    store.commit('SHOW_SNACKBAR', {
      snackbar: true,
      text: 'The connection node is down',
      color: 'errorIntense'
    })
    return false
  } else if (store.getters['nodesStoreNew/nodeStatus'] === 1) {
    store.commit('SHOW_SNACKBAR', {
      snackbar: true,
      text: 'Reconnect node',
      color: 'orange'
    })
    return false
  } else {
    return true
  }
}
export {
  addZerosQuantity,
  amountFormatter,
  priceFormatter,
  buildBoxServices,
  buildButton,
  buildTableHeader,
  buildMonitorHash,
  calculateDurationforDay,
  calculateDurationExpire,
  differString,
  sumObject,
  doCopy,
  formatterPrice,
  getDataPart,
  quantityStringToInt,
  quantityStringToIntMath,
  replaceData,
  validateMatch,
  validateZero,
  verifyTypeOfferName,
  showMsgStatusNode,
  formValue,
  formValueParse,
  typeInvert
}
