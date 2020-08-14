import Vue from 'vue'
// import { Convert } from 'tsjs-xpx-chain-sdk/dist/src/core/format/Convert'
import { PlainMessage } from 'tsjs-xpx-chain-sdk/dist/src/model/transaction/PlainMessage'
import { MessageType } from 'tsjs-xpx-chain-sdk/dist/src/model/transaction/MessageType'
const config = {
  format: 'data:image/png;base64,'
}

/**
 * get an array from a base64 image
 * @param {*} base64Img
 * @param {*} lengthSubs
 */
function arrayToBase64Img (base64Img, lengthSubs = 1000) {
  const str = base64Img.split(',')[1]
  if (!isBase64(str)) {
    throw new Error('not Base64')
  }
  const type = base64Img.split(';')[0].split('/')[1]
  let arrayString = []
  const l = Math.ceil(str.length / lengthSubs)
  let cont = 0
  for (let t = 0; t < l; t++) {
    let extra = str.substring(cont, cont + lengthSubs)
    cont = cont + lengthSubs
    arrayString.push({ s: extra, i: t, t: 0 })
  }
  return { arrayString: arrayString, type: type }
}

/**
 *
 * @param {*} array
 */
function base64ImgFromArray (array) {
  let base64Img = ''
  const arraSort = array.sort((a, b) => { return a.i - b.i })
  // console.log('arraSort', arraSort)
  for (let t = 0; t < arraSort.length; t++) {
    if (arraSort[t].s) { base64Img += arraSort[t].s }
  }
  if (!isBase64(base64Img)) {
    throw new Error('not Base64')
  }
  return `${config.format}${base64Img}`
}
function base64ImgFromArrayCom (array) {
  let base64Img = ''
  const arraSort = array.sort((a, b) => { return a.i - b.i })
  for (let t = 0; t < arraSort.length; t++) {
    if (arraSort[t].s) { base64Img += arraSort[t].s }
  }
  if (!isBase64(base64Img)) {
    throw new Error('not Base64')
  }
  return `${config.format}${base64Img}`
}

/**
 *
 * @param {*} innerTransactions
 * @param {*} type
 */
function filtersInnerTx (innerTransactions = [], type = Vue.prototype.$blockchainProvider.typeTransactions().transfer.id) {
  return innerTransactions.filter(l => l.type === type)
}

/**
 *
 * @param {*} aggregateTx
 */
function base64IconFromAggregateTx (aggregateTx) {
  let messagePayload = []
  if (aggregateTx) {
    for (let i of filtersInnerTx(aggregateTx.innerTransactions)) {
      messagePayload.push(arrayAggregateTxTransfer(i))
    }
  }
  return base64ImgFromArray(messagePayload)
}
/**
 *
 * @param {*} txTransfer
 */
function arrayAggregateTxTransfer (txTransfer) {
  let msjPayload = null
  if (MessageType.PlainMessage === txTransfer.message.type) {
    const valueJson = JSON.parse(txTransfer.message.payload)
    if (('t' in valueJson)) {
      msjPayload = valueJson
    } else {
      throw new Error('Type is not present in the Json (key = t )')
    }
  }
  return msjPayload
}
/**
 *
 * @param {*} array
 * @param {*} publicKey
 */
function aggregateTxFromArray (array, publicKey) {
  let txsTransfer = []
  const address = Vue.prototype.$blockchainProvider.getAddressFromPublicKey(publicKey)
  if (array) {
    for (let x of array.arrayString) {
      const msj = JSON.stringify(x)
      if (msj.length > 1024) throw new Error('length message')
      const tx = Vue.prototype.$blockchainProvider.transferTransaction(address, [], PlainMessage.create(msj))
      txsTransfer.push(tx)
    }
  }

  // if()
  return txsTransfer
}
/**
 * validate base64
 * @param {*} str
 */
function isBase64 (str) {
  var base64regex = /^([0-9a-zA-Z+/]{4})*(([0-9a-zA-Z+/]{2}==)|([0-9a-zA-Z+/]{3}=))?$/
  return base64regex.test(str)
}
/**
 * validate image width and height
 * @param {*} base64Img
 */
function validateDimensionImg (base64Img) {
  return new Promise(resolve => {
    let valid = {
      msj: null,
      status: true
    }
    let image = new Image()
    image.src = base64Img
    image.addEventListener('load', () => {
      const configForm = Vue.prototype.$configForm.iconMosaic()
      if (image.width === configForm.width && image.height === configForm.height) {
        valid = {
          msj: 'success',
          status: true
        }
      } else {
        valid = {
          msj: `image must be (${configForm.width}x${configForm.height})`,
          status: false
        }
      }
      resolve(valid)
    })
  })
}

export { config, validateDimensionImg, arrayToBase64Img, base64ImgFromArrayCom, aggregateTxFromArray, base64IconFromAggregateTx }
