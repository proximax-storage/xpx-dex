import store from '@/store'
import * as crypto from 'js-xpx-chain-library/dist/crypto/crypto'
import {
  Account
} from 'tsjs-xpx-chain-sdk/dist/src/model/account/Account'
import {
  AddExchangeOffer
} from 'tsjs-xpx-chain-sdk/dist/src/model/transaction/AddExchangeOffer'
import {
  AddExchangeOfferTransaction
} from 'tsjs-xpx-chain-sdk/dist/src/model/transaction/AddExchangeOfferTransaction'
import {
  Deadline
} from 'tsjs-xpx-chain-sdk/dist/src/model/transaction/Deadline'
import {
  PublicAccount
} from 'tsjs-xpx-chain-sdk/dist/src/model/account/PublicAccount'
import {
  BlockHttp
} from 'tsjs-xpx-chain-sdk/dist/src/infrastructure/BlockHttp'
import {
  QueryParams
} from 'tsjs-xpx-chain-sdk/dist/src/infrastructure/QueryParams'
import {
  Address
} from 'tsjs-xpx-chain-sdk/dist/src/model/account/Address'
import {
  NetworkType
} from 'tsjs-xpx-chain-sdk/dist/src/model/blockchain/NetworkType'
import {
  MosaicId
} from 'tsjs-xpx-chain-sdk/dist/src/model/mosaic/MosaicId'
import {
  NamespaceId
} from 'tsjs-xpx-chain-sdk/dist/src/model/namespace/NamespaceId'
import {
  TransactionType
} from 'tsjs-xpx-chain-sdk/dist/src/model/transaction/TransactionType'
import {
  SimpleWallet
} from 'tsjs-xpx-chain-sdk/dist/src/model/wallet/SimpleWallet'
import {
  Password
} from 'tsjs-xpx-chain-sdk/dist/src/model/wallet/Password'
import {
  UInt64
} from 'tsjs-xpx-chain-sdk/dist/src/model/UInt64'
import {
  Connections
} from '@/core/utils/connection'

let connection = []
/**
 *
 *
 * @param {*} connectionNodes
 */
function instanceConnectionApi (randomNode, protocol) {
  connection = new Connections(randomNode, protocol)
}

/**
 *
 *
 * @param {*} signedTransaction
 * @returns
 */
function announceTx (signedTransaction) {
  return connection.transactionHttp.announce(signedTransaction)
}

/**
 *
 *
 * @param {*} mosaicId
 * @param {*} mosaicAmount
 * @param {*} costValue
 * @param {*} type
 * @param {*} durationValue
 * @returns
 */
function addExchangeOffer (mosaicId, mosaicAmount, costValue, type, durationValue) {
  const amount = UInt64.fromUint(mosaicAmount)
  const cost = UInt64.fromUint(costValue)
  const duration = UInt64.fromUint(durationValue)
  return AddExchangeOfferTransaction.create(
    Deadline.create(10),
    [new AddExchangeOffer(mosaicId, amount, cost, type, duration)],
    this.typeNetwork
  )
}

/**
 *
 *
 * @param {*} address
 * @returns
 */
function createRawAddress (address) {
  return Address.createFromRawAddress(address)
}

/**
 *
 *
 * @param {*} name
 * @param {*} password
 * @param {*} [network=this.typeNetwork]
 * @returns
 */
function createSimpleWallet (name, password, network) {
  return SimpleWallet.create(name, createPassword(password), network)
}

/**
 *
 *
 * @param {*} name
 * @param {*} password
 * @param {*} privateKey
 * @param {*} [network=this.typeNetwork]
 * @returns
 */
function createSimpleWalletFromPrivateKey (name, password, privateKey, network) {
  return SimpleWallet.createFromPrivateKey(name, createPassword(password), privateKey, network)
}

/**
 *
 *
 * @param {*} password
 * @returns
 */
function createPassword (password) {
  return new Password(password)
}

/**
 *
 *
 * @param {*} date
 * @returns
 */
function dateFormatUTC (date) {
  return new Date(date.compact() + 1459468800 * 1000).toLocaleString()
}

/**
 *
 *
 * @param {*} password
 * @param {*} encryptedPrivateKey
 * @returns
 */
function decryptPrivateKey (common, account) {
  try {
    if (account && account.encrypted !== '' && common) {
      if (!crypto.passwordToPrivatekey(common, account, account.algo)) {
        return {
          status: false,
          msg: 'Invalid password'
        }
      }

      if (common.isHW) {
        return {
          status: false,
          msg: 'Invalid password'
        }
      }

      if (!isValidPrivateKey(common.privateKey)) {
        return {
          status: false,
          msg: 'Invalid Private Key'
        }
      }

      console.log(common)
      if (common.privateKey !== '') {
        return {
          status: true,
          msg: ''
        }
      } else {

      }
    } else {
      return {
        status: false,
        msg: 'You do not have a valid account selected'
      }
    }
  } catch (error) {
    console.log('error', error)
    return {
      status: false,
      msg: 'Has ocurred a error to decrypt your account.'
    }
  }
}

/**
 *
 * @param {*} isValidPrivateKey
 */
function isValidPrivateKey (value) {
  if (value && value !== '' && (value.length === 64 || value.length === 66) && isHexadecimal(value)) {
    return true
  } else {
    return false
  }
}

/**
 *
 *
 * @param {*} str
 * @returns
 */
function isHexadecimal (str) {
  return (str) ? str.match('^(0x|0X)?[a-fA-F0-9]+$') !== null : false
}

/**
 *
 *
 * @param {*} network
 * @param {boolean} [byString=true]
 * @returns
 */
function filterNetworkTypeFromString (network) {
  switch (network) {
    case 'MAIN_NET':
      return NetworkType.MAIN_NET
    case 'MIJIN_TEST':
      return NetworkType.MIJIN_TEST
    case 'TEST_NET':
      return NetworkType.TEST_NET
    case 'PRIVATE':
      return NetworkType.PRIVATE
  }
}

/**
 *
 *
 * @param {*} network
 * @returns
 */
function filterNetworkTypeFromNumber (network) {
  switch (network) {
    case NetworkType.MAIN_NET:
      return 'MAIN_NET'
    case NetworkType.MIJIN_TEST:
      return 'MIJIN_TEST'
    case NetworkType.TEST_NET:
      return 'TEST_NET'
    case NetworkType.PRIVATE:
      return 'PRIVATE'
  }
}

/**
 *
 *
 * @param {number} [height=1]
 * @param {string} [url='']
 * @returns
 */
function getBlockInfo (height = 1, url = '') {
  if (connection) return connection.blockHttp.getBlockByHeight(height)
  const c = new BlockHttp(url)
  return c.blockHttp.getBlockByHeight(height)
}

/**
 *
 *
 * @param {*} address
 * @returns
 */
function getAccountInfo (address) {
  return connection.accountHttp.getAccountInfo(address)
}

/**
 *
 *
 * @param {*} privateKey
 * @param {*} network
 * @returns
 */
function getAccountFromPrivateKey (privateKey, network) {
  return Account.createFromPrivateKey(privateKey, network)
}

/**
 *
 *
 * @param {*} address
 * @returns
 */
function getMultisigAccountInfo (address) {
  return connection.accountHttp.getMultisigAccountInfo(address)
}
/**
 *
 *
 * @param {*} publicAccount
 * @param {number} [queryParams=100]
 * @param {*} [id=null]
 * @param {*} [orderBy=null]
 * @returns
 */
function getTransactionsFromAccount (publicAccount, queryParams = 100, id = undefined) {
  const query = (id) ? new QueryParams(queryParams, id) : new QueryParams(queryParams)
  return connection.accountHttp.transactions(publicAccount, query)
}
/**
 * Gets a transaction for a transactionId
 * @param transactionId - Transaction id or hash.
 * @returns Observable<Transaction>
 */
function getTransactionId (transactionId) {
  return connection.transactionHttp.getTransaction(transactionId)
}
/**
 * Gets an array of transactions for which an account is the recipient of a transaction.
 * A transaction is said to be incoming with respect to an account if the account is the recipient of a transaction.
 * @param accountId - User public account or address (you can use address if public account is not known to the network just yet)
 * @param queryParams - (Optional) Query params
 * @returns Observable<Transaction[]>
 */
function getIncomingTransactions (publicAccount, queryParams = 100) {
  return connection.accountHttp.incomingTransactions(publicAccount, new QueryParams(queryParams))
}

/**
 * Gets an array of transactions for which an account is the sender a transaction.
 * A transaction is said to be outgoing with respect to an account if the account is the sender of a transaction.
 * @param publicAccount - User public account
 * @param queryParams - (Optional) Query params
 * @returns Observable<Transaction[]>
 */
function outgoingTransactions (publicAccount, queryParams) {
  return connection.accountHttp.outgoingTransactions(publicAccount, queryParams)
}

/**
 *
 *
 * @param {*} mosaicsId
 */
function getMosaics (mosaicsId) {
  return connection.mosaicHttp.getMosaics(mosaicsId)
}

/**
 *
 *
 * @param {*} mosaicsId
 * @returns
 */
function getMosaicsName (mosaicsId) {
  return connection.mosaicHttp.getMosaicsNames(mosaicsId)
}

/**
 *
 *
 * @param {*} id
 * @returns
 */
function getMosaicId (id) {
  return new MosaicId(id)
}

/**
 *
 *
 * @param {*} id
 * @returns
 */
function getNamespaceId (id) {
  return new NamespaceId(id)
}

/**
 *
 *
 * @param {*} privateKey
 * @returns
 */
function getPrefixAndPrivateKey (privateKey) {
  let pref = null
  let newPrivateKey = privateKey
  if (newPrivateKey && newPrivateKey.length > 64) {
    pref = newPrivateKey.slice(0, -64)
    newPrivateKey = newPrivateKey.slice(2)
  }

  return {
    pref: pref,
    pvk: newPrivateKey
  }
}

/**
 *
 *
 * @param {*} address
 * @returns
 */
function getNamespaceFromAccount (address) {
  return connection.namespaceHttp.getNamespacesFromAccount(address)
}

/**
 *
 *
 * @param {*} namespaceIds
 * @returns
 */
function getNamespacesName (namespaceIds) {
  return connection.namespaceHttp.getNamespacesName(namespaceIds)
}

/**
 *
 *
 * @param {*} namespace
 * @returns
 */
function getLinkedMosaicId (namespace) {
  return connection.namespaceHttp.getLinkedMosaicId(namespace)
}

/**
 *
 *
 * @returns
 */
function getNetworkTypes () {
  return [{
    text: 'Public Test',
    value: NetworkType.TEST_NET
  }, {
    text: 'Main Net',
    value: NetworkType.MAIN_NET
  }, {
    text: 'Private',
    value: NetworkType.PRIVATE
  }]
}

/**
 *
 *
 * @param {*} configInfo
 * @returns
 */
function getEnvironmentByNetworkType (configInfo) {
  let environment = null
  switch (configInfo.infoApp.version) {
    case 'TEST_NET':
      environment = configInfo.environment.TEST_NET
      break
    case 'MAIN_NET':
      environment = configInfo.environment.MAIN_NET
      break
    case 'MIJIN_TEST':
      environment = configInfo.environment.MIJIN_TEST
      break
  }
  return environment
}

/**
 *
 *
 * @param {*} value
 * @returns
 */
function getUint64 (value) {
  return new UInt64(value)
}

/**
 *
 *
 * @param {*} publicKey
 * @param {*} network
 * @returns
 */
function publicAccountFromPublicKey (publicKey, network) {
  return PublicAccount.createFromPublicKey(publicKey, network)
}

/**
 *
 *
 * @param {*} privateKey
 * @param {*} transaction
 * @param {*} network
 * @returns
 */
function signedTransaction (privateKey, transaction, network) {
  const currentNode = store.getters['nodeStore/generationHash']
  const account = getAccountFromPrivateKey(privateKey, currentNode.networkType)
  return account.sign(transaction, currentNode.generationHash)
}

/**
 *
 *
 * @returns
 */
function typeTransactions () {
  return {
    transfer: {
      id: TransactionType.TRANSFER,
      name: 'Transfer Transaction'
    },
    registerNamespace: {
      id: TransactionType.REGISTER_NAMESPACE,
      name: 'Register Namespace Transaction'
    },
    mosaicDefinition: {
      id: TransactionType.MOSAIC_DEFINITION,
      name: 'Mosaic definition'
    },
    mosaicSupplyChange: {
      id: TransactionType.MOSAIC_SUPPLY_CHANGE,
      name: 'Mosaic supply change'
    },
    modifyMultisigAccount: {
      id: TransactionType.MODIFY_MULTISIG_ACCOUNT,
      name: 'Modify multisig account'
    },
    aggregateComplete: {
      id: TransactionType.AGGREGATE_COMPLETE,
      name: 'Aggregate complete'
    },
    aggregateBonded: {
      id: TransactionType.AGGREGATE_BONDED,
      name: 'Aggregate bonded'
    },
    lock: {
      id: TransactionType.LOCK,
      name: 'Lock'
    },
    secretLock: {
      id: TransactionType.SECRET_LOCK,
      name: 'Secret lock'
    },
    secretProof: {
      id: TransactionType.SECRET_PROOF,
      name: 'Secret proof'
    },
    mosaicAlias: {
      id: TransactionType.MOSAIC_ALIAS,
      name: 'Mosaic Alias'
    },
    addressAlias: {
      id: TransactionType.ADDRESS_ALIAS,
      name: 'Address Alias'
    },
    modifyAccountPropertyAddress: {
      id: TransactionType.MODIFY_ACCOUNT_PROPERTY_ADDRESS,
      name: 'Modify Account Property Address'
    },
    modifyAccountPropertyMosaic: {
      id: TransactionType.MODIFY_ACCOUNT_PROPERTY_MOSAIC,
      name: 'Modify Account Property Mosaic'
    },
    modifyAccountPropertyEntityType: {
      id: TransactionType.MODIFY_ACCOUNT_PROPERTY_ENTITY_TYPE,
      name: 'Modify Account Entity Type'
    },
    linkAccount: {
      id: TransactionType.LINK_ACCOUNT,
      name: 'Link Account'
    },
    modifyAccountMetadata: {
      id: TransactionType.MODIFY_ACCOUNT_METADATA,
      name: 'Modify Account Metadata'
    },
    modifyMosaicMetadata: {
      id: TransactionType.MODIFY_MOSAIC_METADATA,
      name: 'Modify Mosaic Metadata'
    },
    modifyNamespaceMetadata: {
      id: TransactionType.MODIFY_NAMESPACE_METADATA,
      name: 'Modify Namespace Metadata'
    }
  }
}

export {
  instanceConnectionApi,
  addExchangeOffer,
  announceTx,
  createRawAddress,
  createSimpleWallet,
  createSimpleWalletFromPrivateKey,
  decryptPrivateKey,
  isValidPrivateKey,
  isHexadecimal,
  filterNetworkTypeFromString,
  filterNetworkTypeFromNumber,
  getAccountFromPrivateKey,
  getAccountInfo,
  getMosaics,
  getMosaicId,
  getMosaicsName,
  getMultisigAccountInfo,
  getNamespaceId,
  getLinkedMosaicId,
  getNetworkTypes,
  getIncomingTransactions,
  getEnvironmentByNetworkType,
  getUint64,
  publicAccountFromPublicKey,
  getTransactionsFromAccount,
  getNamespaceFromAccount,
  getNamespacesName,
  getPrefixAndPrivateKey,
  getBlockInfo,
  getTransactionId,
  typeTransactions,
  dateFormatUTC,
  signedTransaction,
  outgoingTransactions
}
