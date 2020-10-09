import {
  isValidPrivateKey
} from '@/core/utils/blockchainProvider'

const generalConfig = {
  img: {
    width: 35,
    height: 35,
    size: 4000,
    typeForm: 'image/png'
  },
  amount: {
    min: 3,
    max: 30
  },
  divisibility: {
    min: 0,
    max: 6
  },
  duration: {
    min: 1,
    max: 365
  },
  supply: {
    min: 1,
    max: 9000000000000000,
    maxTex: 9
  },
  namespace: {
    min: 1,
    max: 30
  },
  namespaceName: {
    min: 2,
    max: 16
  },
  descriptionAsset: {
    min: 4,
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
 * @param {*} width
 * @param {*} height
 * @param {*} size
 * @param {*} type
 */
function assemblyConfigFile (width, height, size, typeForm, assemblyConfig) {
  const config = { width, height, size, typeForm }

  return Object.assign(config, assemblyConfig)
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
    min: v => (v && v.length >= min) || `${name} must be at least ${min} characters.`,
    max: v => (v && v.length <= max) || `${name} must be a maximum of ${max} characters.`
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
  return value1 === value2 || `${nameValidation} must match.`
}

/**
 *
 *
 * @param {string} [label='Namespace']
 * @returns
 */
function namespaceName (label = 'namespaceName') {
  const min = generalConfig.namespaceName.min
  const max = generalConfig.namespaceName.max
  const rules = {
    required: value => !!value || `${label} is required.`,
    min: v => (v && v.length >= min) || `${label} min length ${min} alphanumerico characters.`,
    max: v => (v && v.length <= max) || `${label} max length ${max} alphanumerico characters.`
  }
  return assemblyConfig(label, '', '', min, max, rules)
}
/**
 *
 *
 * @param {string} [label='Namespace']
 * @returns
 */
function descriptionAsset (label = 'Description asset') {
  const min = generalConfig.descriptionAsset.min
  const max = generalConfig.descriptionAsset.max
  const rules = {
    required: value => !!value || `${label} is required.`,
    min: v => (v && v.length >= min) || `${label} min length ${min} alphanumerico characters.`,
    max: v => (v && v.length <= max) || `${label} max length ${max} alphanumerico characters.`
  }
  return assemblyConfig(label, '', '', min, max, rules)
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
    required: value => !!value || `${label} is required.`,
    min: v => (v && v.length >= min) || `${label} must be at least ${min} characters.`,
    max: v => (v && v.length <= max) || `${label} must be a maximum of ${max} characters.`
  }
  return assemblyConfig(label, '', '', min, max, rules)
}

/**
 *
 * @param {*} label
 */
function duration (label = 'Duration') {
  const min = generalConfig.duration.min
  const max = generalConfig.duration.max
  const rules = {
    required: value => !!value || `${label} is required.`,
    min: v => (v && Number(v) >= min) || `${label} must be at least ${min}.`,
    // max: v => (v && Number(v) <= max) || `${label} must be a maximum of ${max}`
    max: v => (v && Number(v) <= max) || `Maximum is ${max}.`
  }
  return assemblyConfig(label, '', 'number', min, max, rules)
}
/**
 *
 * @param {*} label
 */
function divisibility (label = 'Divisibility') {
  const min = generalConfig.divisibility.min
  const max = generalConfig.divisibility.max
  const rules = {
    required: value => !!value || `${label} is required.`,
    min: v => (v && Number(v) >= min) || `${label} must be at least ${min}.`,
    max: v => (v && Number(v) <= max) || `Maximum is ${max}.`
  }
  return assemblyConfig(label, '', 'number', min, max, rules)
}
/**
 *
 * @param {*} label
 */
function iconMosaic (label = `Select image icon`) {
  const size = generalConfig.img.size
  const typeForm = generalConfig.img.typeForm
  const width = generalConfig.img.width
  const height = generalConfig.img.height
  const rules = {
    required: v => !!v || `${label} is required.`,
    size: v => !v || v.size < size || 'Icon size must be at least 4 kB!',
    typeForm: v => !v || v.type === typeForm || `Allowed format (${typeForm}).`
  }
  return assemblyConfigFile(width, height, size, typeForm, assemblyConfig(label, '', 'file', null, null, rules))
}
/**
 *
 * @param {*} label
 */
function supply (label = 'Supply') {
  const min = generalConfig.supply.min
  const max = generalConfig.supply.max
  const maxTex = generalConfig.supply.maxTex
  const rules = {
    required: value => !!value || `${label} is required.`,
    min: v => (v && Number(v) >= min) || `${label} must be at least ${min}.`,
    max: v => (v && Number(v) <= max) || `Maximum is ${maxTex} billion.`
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
    required: value => !!value || `${label} is required.`,
    min: v => (v && v.length >= min) || `${label} must be at least ${min} characters.`,
    max: v => (v && v.length <= max) || `${label} must be a maximum of ${max} characters.`
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
    required: value => !!value || `${label} is required.`,
    min: v => (v && v.length >= min) || `${label} must be at least ${min} characters.`,
    max: v => (v && v.length <= max) || `${label} must be a maximum of ${max} characters.`,
    validatePvk: v => (isValidPrivateKey(v) || 'Private key must be Hexadecimal.')
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
    required: value => !!value || `${label} is required.`,
    min: v => (v && v.length >= min) || `${label} must be at least ${min} characters.`,
    max: v => (v && v.length <= max) || `${label} must be a maximum of ${max} characters.`
  }
  return assemblyConfig(label, '', '', min, max, rules)
}

export {
  amount,
  buildButton,
  duration,
  getConfigMoney,
  isMatch,
  iconMosaic,
  divisibility,
  supply,
  namespaceName,
  descriptionAsset,
  namespace,
  password,
  privateKey,
  walletAccountName
}
