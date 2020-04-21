import nem from 'nem-sdk'
import {
  Account,
  NEMLibrary,
  PublicAccount,
  NetworkTypes
} from 'nem-library'

/**
 *
 *
 * @param {*} privateKey
 * @returns
 */
function accountFromPrivateKey (privateKey) {
  return Account.createWithPrivateKey(privateKey)
}

/**
 *
 *
 * @param {*} password
 * @param {*} account
 * @returns
 */
function createCommon (account, password) {
  const common = nem.model.objects.create('common')(password)
  passwordToPrivatekey(account, common)
  return common
}

/**
 *
 *
 * @param {*} network
 * @returns
 */
function convertNetworkFromString (network) {
  switch (network) {
    case 'MAIN_NET':
      return {
        raw: 104,
        converted: NetworkTypes.MAIN_NET
      }
    case 'TEST_NET':
      return {
        raw: -104,
        converted: NetworkTypes.TEST_NET
      }
    case 'MIJIN':
      return {
        raw: 96,
        converted: NetworkTypes.MIJIN
      }
  }
}

/**
 *
 *
 * @param {*} network
 * @returns
 */
function convertNetworkFromNumber (network) {
  switch (network) {
    case 104:
      return 'MAIN_NET'
    case -104:
      return 'TEST_NET'
    case 96:
      return 'MIJIN'
    case NetworkTypes.MAIN_NET:
      return 'MAIN_NET'
    case NetworkTypes.TEST_NET:
      return 'TEST_NET'
    case NetworkTypes.MIJIN:
      return 'MIJIN'
  }
}

/**
 *
 *
 * @param {*} networkType
 */
function initBootstrap (networkType) {
  NEMLibrary.reset()
  NEMLibrary.bootstrap(networkType)
}

/**
 *
 *
 * @param {*} common
 * @param {*} account
 * @param {*} algo
 * @returns
 */
function passwordToPrivatekey (account, common) {
  return nem.crypto.helpers.passwordToPrivatekey(common, account, account.algo)
}

/**
 *
 *
 * @param {*} publicKey
 * @returns
 */
function publicAccountFromPublicKey (publicKey) {
  return PublicAccount.createWithPublicKey(publicKey)
}

/**
 *
 *
 * @param {*} privateKey
 * @returns
 */
function publicAccountFromPrivateKey (privateKey) {
  const account = accountFromPrivateKey(privateKey)
  return publicAccountFromPublicKey(account.publicKey)
}

export {
  accountFromPrivateKey,
  createCommon,
  convertNetworkFromString,
  convertNetworkFromNumber,
  initBootstrap,
  passwordToPrivatekey,
  publicAccountFromPublicKey,
  publicAccountFromPrivateKey
}
