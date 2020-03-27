import { crypto } from 'js-xpx-chain-library'
import axios from 'axios'
import {
  Account,
  BlockHttp,
  ChainHttp,
  MosaicHttp,
  AccountHttp,
  NamespaceHttp,
  TransactionHttp,
  SimpleWallet,
  Password,
  DiagnosticHttp,
  MetadataHttp,
  NetworkType,
  Address,
  PublicAccount,
  NamespaceId,
  MosaicId,
  ExchangeOffer,
  ExchangeOfferTransaction,
  UInt64,
  Deadline
} from 'tsjs-xpx-chain-sdk'
import { ExchangeHttp } from 'tsjs-xpx-chain-sdk/dist/src/infrastructure/ExchangeHttp'
import { GeneralService } from './general'

class BlockchainProvider {
  constructor (node, protocol, typeNetwork, coingecko) {
    this.urlCoingecko = coingecko
    this.url = this.buildURL(node, protocol)
    this.typeNetwork = NetworkType[typeNetwork]
    this.accountHttp = new AccountHttp(this.url)
    this.blockHttp = new BlockHttp(this.url)
    this.chainHttp = new ChainHttp(this.url)
    this.diagnosticHttp = new DiagnosticHttp(this.url)
    this.metadataHttp = new MetadataHttp(this.url)
    this.mosaicHttp = new MosaicHttp(this.url)
    this.namespaceHttp = new NamespaceHttp(this.url)
    this.transactionHttp = new TransactionHttp(this.url)
    this.exchangeHttp = new ExchangeHttp(this.url)
    this.generalService = new GeneralService()
    this.generationHash = '56D112C98F7A7E34D1AEDC4BD01BC06CA2276DD546A93E36690B785E82439CA9'
  }

  /**
   *
   *
   * @param {*} node
   * @param {*} protocol
   * @returns
   * @memberof BlockchainProvider
   */
  buildURL (node, protocol) {
    let url = null
    switch (protocol) {
      case 'http':
        url = `${protocol}://${node}:3000`
        break
      case 'https':
        url = `${protocol}://${node}:443`
        break
    }

    return url
  }

  /**
   *
   *
   * @param {*} walletName
   * @param {*} password
   * @param {*} [network=this.typeNetwork]
   * @returns
   * @memberof BlockchainProvider
   */
  createSimpleWallet (name, password, network = this.typeNetwork) {
    return SimpleWallet.create(name, this.createPassword(password), network)
  }

  /**
   *
   *
   * @param {*} nameWallet
   * @param {*} password
   * @param {*} privateKey
   * @param {*} network
   * @returns
   * @memberof BlockchainProvider
   */
  createSimpleWalletFromPrivateKey (name, password, privateKey, network = this.typeNetwork) {
    const pass = this.createPassword(password)
    return SimpleWallet.createFromPrivateKey(name, pass, privateKey, network)
  }

  /**
   *
   *
   * @param {*} value
   * @returns
   * @memberof BlockchainProvider
   */
  createPassword (password) {
    return new Password(password)
  }

  /**
   *
   *
   * @param {*} publicKey
   * @param {*} network
   * @returns
   * @memberof BlockchainProvider
   */
  createPublicAccount (publicKey, network) {
    return PublicAccount.createFromPublicKey(publicKey, network)
  }

  /**
   *
   *
   * @param {*} address
   * @returns
   * @memberof BlockchainProvider
   */
  createFromRawAddress (address) {
    return Address.createFromRawAddress(address)
  }

  /**
   *
   *
   * @param {*} privateKey
   * @param {*} network
   * @param {*} address
   * @returns
   * @memberof BlockchainProvider
   */
  checkAddress (privateKey, network, address) {
    return privateKey && privateKey !== ''
      ? Account.createFromPrivateKey(privateKey, network).address.plain() === address
      : null
  }

  /**
   *
   *
   * @param {*} common
   * @param {*} account
   * @param {*} [network=this.typeNetwork]
   * @returns
   * @memberof BlockchainProvider
   */
  decrypt (common, account, network) {
    try {
      if (account && account.encrypted !== '' && common) {
        if (!crypto.passwordToPrivatekey(common, account, account.algo)) {
          return { status: false, msg: 'Invalid password' }
        }

        if (common.isHW) {
          return { status: false, msg: 'Invalid password' }
        }

        if (
          !this.isValidPrivateKey(common.privateKey) ||
          !this.checkAddress(common.privateKey, network, account.address)
        ) {
          return { status: false, msg: 'Invalid password' }
        }

        return { status: true, msg: '' }
      } else {
        return { status: false, msg: 'You do not have a valid account selected' }
      }
    } catch (error) {
      return { status: false, msg: 'You do not have a valid account selected.' }
    }
  }

  /**
   *
   *
   * @param {*} privateKey
   * @returns
   * @memberof BlockchainProvider
   */
  isValidPrivateKey (privateKey) {
    if (privateKey && privateKey.length !== 64 && privateKey.length !== 66) {
      // console.error('Private key length must be 64 or 66 characters !')
      return false
    } else if (privateKey && !this.generalService.isHexadecimal(privateKey)) {
      // console.error('Private key must be hexadecimal only !')
      return false
    } else {
      // console.error('fine !')
      return true
    }
  }

  /**
   *
   *
   * @param {*} privateKey
   * @param {*} network
   * @returns
   * @memberof BlockchainProvider
   */
  getAccountFromPrivateKey (privateKey, network) {
    return Account.createFromPrivateKey(privateKey, network)
  }
  /**
   *
   *
   * @param {*} address
   * @returns
   * @memberof BlockchainProvider
   */
  getAccountInfo (address) {
    const adss = Address.createFromRawAddress(address)
    return this.accountHttp.getAccountInfo(adss)
  }
  /**
   *
   *
   * @param {*} Idmosaic
   * @param {*} type
   * @returns
   * @memberof BlockchainProvider
   */
  getExchangeOffersfromId (Idmosaic, type) {
    console.log('tipe:', type)
    const id = new MosaicId(Idmosaic)
    return this.exchangeHttp.getExchangeOffers(type, id)
  }

  /**
   *
   *
   * @param {Address} address
   * @memberof BlockchainProvider
   */
  getNamespaceFromAccount (address) {
    return this.namespaceHttp.getNamespacesFromAccount(address)
  }
  /**
   *
   *
   * @param {NamespaceInfo} namespaceInfo
   * @memberof BlockchainProvider
   */

  getNamespacesName (namespaceIds) {
    return this.namespaceHttp.getNamespacesName(namespaceIds)
  }
  /**
   * Get namespace id
   *
   * @param {any} id
   * @returns
   * @memberof BlockchainProvider
   */
  getNamespaceId (id) {
    return new NamespaceId(id)
  }
  /**
   *
   *
   * @param {MosaicId[]} mosaicIsd
   * @memberof BlockchainProvider
   */
  getMosaics (mosaicIsd) {
    return this.mosaicHttp.getMosaics(mosaicIsd)
  }

  /**
   *
   *
   * @param {MosaicId[]} mosaicIsd
   * @memberof BlockchainProvider
   */
  getMosaicsName (mosaicsId) {
    return this.mosaicHttp.getMosaicsNames(mosaicsId).toPromise()
  }
  /**
   *
   *
   * @param {(string | number[])} id
   * @returns {MosaicId}
   * @memberof BlockchainProvider
   */
  getMosaicId (id) {
    return new MosaicId(id)
  }

  /**
   *
   *
   * @param {NamespaceId} namespace
   * @memberof BlockchainProvider
   */
  getLinkedMosaicId (namespace) {
    return this.namespaceHttp.getLinkedMosaicId(namespace)
  }
  /**
   *
   *
   * @param {*} privateKey
   * @returns
   * @memberof BlockchainProvider
   */
  getPrefixAndPrivateKey (privateKey) {
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
   * @param {string} coinId
   * @returns
   * @memberof ProximaxProvider
   */
  coingecko (coinId) {
    return axios.get(`${this.urlCoingecko.url}${coinId}`)
  }
  /**
   * @param {Transaction} transaction
   * @param {PrivateKey} privateKey
   * @returns {SignedTransaction}
   * @memberof ProximaxProvider
   */
  signedTransaction (privateKey, transaction) {
    console.log('privateKey', privateKey)
    const account = Account.createFromPrivateKey(privateKey, this.typeNetwork)
    return account.sign(transaction, this.generationHash)
  }
  /**
   * @param {SignedTransaction} signedTransaction
   * @returns
   * @memberof ProximaxProvider
   */
  announceTx (signedTransaction) {
    return this.transactionHttp.announce(signedTransaction)
  }

  /**
   * @param {MosaicId} mosaicId MosaicId
   * @param {Number} mosaicAmount
   * @param {Number} cost
   * @param {Int} type
   * @param {PublicAccount} publicAccount
   * @returns
   * @memberof ProximaxProvider
   */
  exchangeOffer (mosaicId, mosaicAmount, costValue, type, publicAccount) {
    const amount = UInt64.fromUint(mosaicAmount)
    const cost = UInt64.fromUint(costValue)
    return ExchangeOfferTransaction.create(
      Deadline.create(10),
      [new ExchangeOffer(mosaicId, amount, cost, type, publicAccount)],
      this.typeNetwork
    )
  }
  /**
   * @param {MosaicId} mosaicId MosaicId
   * @param {Number} mosaicAmount
   * @param {Number} cost
   * @param {Int} type
   * @param {PublicAccount} publicAccount
   * @returns
   * @memberof ProximaxProvider
   */
  exchangeOfferDb (mosaicId, mosaicAmount, costValue, type, publicAccount) {
    const amount = UInt64.fromUint(mosaicAmount)
    const cost = UInt64.fromUint(costValue)
    return new ExchangeOffer(mosaicId, amount, cost, type, publicAccount)
  }
  /**
   *
   *
   * @returns
   * @memberof BlockchainProvider
   */
  getNetworkTypes () {
    return {
      testnet: {
        text: 'Public Test',
        value: NetworkType.TEST_NET
      },
      mainnet: {
        text: 'Main Net',
        value: NetworkType.MAIN_NET
      }
    }
  }

  uInt64 (value) {
    return new UInt64(value)
  }
}

export { BlockchainProvider }
