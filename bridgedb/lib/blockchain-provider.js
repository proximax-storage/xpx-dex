const sdk = require('tsjs-xpx-chain-sdk')

class BlockchainProvider {
  constructor (node) {
    console.log(node)
  }
  /**
   *
   *
   * @param {(string | number[])} id
   * @returns {MosaicId}
   * @memberof BlockchainProvider
   */
  getMosaicId (id) {
    return new sdk.MosaicId(id)
  }
}
module.exports = BlockchainProvider
