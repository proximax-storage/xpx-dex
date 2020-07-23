import {
  isValidPrivateKey
} from '@/core/utils/blockchainProvider'

const generalConfig = {
  amount: {
    min: 3,
    max: 30
  },
  divisibility: {
    min: 0,
    max: 6
  },

  supply: {
    min: 1,
    max: 9000000000000000
  },
  namespace: {
    min: 1,
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
  walletAccountName: {
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
 * @param {*} key
 * @param {*} action
 * @param {*} disabled
 * @param {*} color
 * @param {*} textColor
 * @param {*} loading
 * @param {*} text
 * @returns
 */
function buildButton (text, key, action, color, textColor, disabled = false, loading = false) {
  return {
    text,
    key,
    action,
    color,
    textColor,
    disabled,
    loading
  }
}

/**
 *
 *
 * @param {*} [value=null]
 * @returns
 */
function getConfigMoney (decimal = '.', thousands = ',', prefix = '', suffix = '', precision = 6, masked = false) {
  return {
    decimal,
    thousands,
    prefix,
    suffix,
    precision,
    masked
  }
}

/**
 *
 *
 * @param {*} value1
 * @param {*} value2
 * @param {string} [nameValidation='']
 * @returns
 */
function isMatch (value1, value2, nameValidation = '') {
  return value1 === value2 || `${nameValidation} must match`
}

/**
 *
 *
 * @param {string} [label='Namespace']
 * @returns
 */
function namespace (label = 'Namespace') {
  const min = generalConfig.namespace.min
  const max = generalConfig.namespace.max
  const rules = {
    required: value => !!value || `${label} is required`,
    min: v => (v && v.length >= min) || `${label} must be less than ${min} characters`,
    max: v => (v && v.length <= max) || `${label} must be a maximum of ${max} characters`
  }
  return assemblyConfig(label, '', '', min, max, rules)
}

/**
 *
 * @param {*} label
 */
function divisibility (label = 'Divisibility') {
  const min = generalConfig.divisibility.min
  const max = generalConfig.divisibility.max
  const rules = {
    required: value => !!value || `${label} is required`,
    min: v => (v && Number(v) >= min) || `${label} must be less than ${min}`,
    max: v => (v && Number(v) <= max) || `${label} must be a maximum of ${max}`
  }
  return assemblyConfig(label, '', 'number', min, max, rules)
}
/**
 *
 * @param {*} label
 */
function supply (label = 'Supply') {
  const min = generalConfig.supply.min
  const max = generalConfig.supply.max
  const rules = {
    required: value => !!value || `${label} is required`,
    min: v => (v && Number(v) >= min) || `${label} must be less than ${min}`,
    max: v => (v && Number(v) <= max) || `${label} must be a maximum of ${max}`
  }
  return assemblyConfig(label, '', 'number', min, max, rules)
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
 */
function privateKey (label = 'Private key') {
  const min = generalConfig.privateKey.min
  const max = generalConfig.privateKey.max
  const rules = {
    required: value => !!value || `${label} is required`,
    min: v => (v && v.length >= min) || `${label} must be less than ${min} characters`,
    max: v => (v && v.length <= max) || `${label} must be a maximum of ${max} characters`,
    validatePvk: v => (isValidPrivateKey(v) || 'Private key must be Hexadecimal')
  }
  return assemblyConfig(label, '', 'password', min, max, rules)
}
/**
 *
 *
 * @returns
 */
function walletAccountName (label = 'Wallet') {
  const min = generalConfig.walletAccountName.min
  const max = generalConfig.walletAccountName.max
  const rules = {
    required: value => !!value || `${label} is required`,
    min: v => (v && v.length >= min) || `${label} must be less than ${min} characters`,
    max: v => (v && v.length <= max) || `${label} must be a maximum of ${max} characters`
  }
  return assemblyConfig(label, '', '', min, max, rules)
}

export {
  amount,
  buildButton,
  getConfigMoney,
  isMatch,
  divisibility,
  supply,
  namespace,
  password,
  privateKey,
  walletAccountName
}
