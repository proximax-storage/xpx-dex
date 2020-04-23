// import {
//   AccountHttp,
//   BlockHttp,
//   DiagnosticHttp,
//   ChainHttp,
//   MetadataHttp,
//   MosaicHttp,
//   NamespaceHttp,
//   TransactionHttp
// } from 'tsjs-xpx-chain-sdk'

import {
  AccountHttp
} from 'tsjs-xpx-chain-sdk/dist/src/infrastructure/AccountHttp'

import {
  BlockHttp
} from 'tsjs-xpx-chain-sdk/dist/src/infrastructure/BlockHttp'
import {
  ExchangeHttp
} from 'tsjs-xpx-chain-sdk/dist/src/infrastructure/ExchangeHttp'
import {
  MosaicHttp
} from 'tsjs-xpx-chain-sdk/dist/src/infrastructure/MosaicHttp'

import {
  NamespaceHttp
} from 'tsjs-xpx-chain-sdk/dist/src/infrastructure/NamespaceHttp'

import {
  TransactionHttp
} from 'tsjs-xpx-chain-sdk/dist/src/infrastructure/TransactionHttp'

class Connections {
  constructor (node, protocol) {
    this.url = this.getBuildUrl(node, protocol)
    this.accountHttp = new AccountHttp(this.url)
    this.blockHttp = new BlockHttp(this.url)
    this.mosaicHttp = new MosaicHttp(this.url)
    this.namespaceHttp = new NamespaceHttp(this.url)
    this.transactionHttp = new TransactionHttp(this.url)
    this.exchangeHttp = new ExchangeHttp(this.url)
  }

  getBuildUrl (node, protocol) {
    switch (protocol) {
      case 'http':
        return `${protocol}://${node}:3000`
      case 'https':
        return `${protocol}://${node}:443`
    }
  }
}

export { Connections }
