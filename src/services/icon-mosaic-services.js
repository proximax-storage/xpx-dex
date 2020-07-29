import Vue from 'vue'

/**
 * get an array from a base64 image
 * @param {*} base64Img
 * @param {*} lengthSubs
 */
function arrayToBase64Img (base64Img, lengthSubs = 900) {
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
    arrayString.push({ s: extra, i: t })
  }
  return { arrayString: arrayString, type: type }
}

function aggregateTxFromArray (array) {

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

export { validateDimensionImg, arrayToBase64Img, aggregateTxFromArray }
