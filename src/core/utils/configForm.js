// import {
//   isValidPKey
// } from '@/core/utils/blockchainProvider'

const generalConfig = {
  amount: {
    min: 3,
    max: 30
  },
  password: {
    min: 8,
    max: 30
  },
  privateKey: {
    min: 64,
    max: 66
  },
  publicKey: {
    min: 64,
    max: 66
  },
  walletName: {
    min: 3,
    max: 30
  }
}

/**
 *
 *
 * @param {*} label
 * @param {*} icon
 * @param {*} inputType
 * @param {*} min
 * @param {*} max
 * @param {*} rules
 * @param {boolean} [showIcon=false]
 * @param {boolean} [show=false]
 * @param {boolean} [showConfirm=false]
 * @returns
 */
function assemblyConfig (label, icon, inputType, min, max, rules, showIcon = false, show = false, showConfirm = false) {
  return {
    label,
    icon,
    type: inputType,
    min,
    max,
    rules,
    showIcon,
    show,
    showConfirm
  }
}

/**
 *
 *
 * @param {*} name
 * @returns
 */
function amount (name = 'Amount') {
  const min = generalConfig.amount.min
  const max = generalConfig.amount.max
  const rules = {
    required: v => !!v || `${name} is required`,
    min: v => (v && v.length >= min) || `${name} must be less than ${min} characters`,
    max: v => (v && v.length <= max) || `${name} must be a maximum of ${max} characters`
  }
  return assemblyConfig(name, '', 'number', min, max, rules)
}
/**
 *
 *
 * @returns
 */
function password (label = 'Password') {
  const min = generalConfig.password.min
  const max = generalConfig.password.max
  const rules = {
    required: value => !!value || `${label} is required`,
    min: v => (v && v.length >= min) || `${label} must be less than ${min} characters`,
    max: v => (v && v.length <= max) || `${label} must be a maximum of ${max} characters`
  }
  return assemblyConfig(label, '', 'password', min, max, rules)
}
/**
 *
 *
 * @returns
 */
function wallet () {
  const min = generalConfig.walletName.min
  const max = generalConfig.walletName.max
  const rules = {
    required: value => !!value || 'Wallet is required',
    min: v => (v && v.length >= min) || `Wallet must be less than ${min} characters`,
    max: v => (v && v.length <= max) || `Wallet must be a maximum of ${max} characters`
  }
  return assemblyConfig('Wallet', '', '', min, max, rules)
}

export {
  amount,
  password,
  wallet
}
