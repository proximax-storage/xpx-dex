import {
    SimpleWallet
} from 'tsjs-xpx-chain-sdk/dist/src/model/wallet/SimpleWallet'
import { Password } from 'tsjs-xpx-chain-sdk/dist/src/model/wallet/Password'
import { NetworkType } from 'tsjs-xpx-chain-sdk/dist/src/model/blockchain/NetworkType'
import { Account } from 'tsjs-xpx-chain-sdk/dist/src/model/account/Account'

export class BlockchainProvider {

    /**
     *
     *
     * @param {NetworkType} networkType
     * @returns
     * @memberof BlockchainProvider
     */
    static createNewAccount(networkType: NetworkType) {
        return Account.generateNewAccount(networkType)
    }

    /**
     *
     *
     * @static
     * @param {string} walletName
     * @param {Password} password
     * @param {NetworkType} network
     * @returns {SimpleWallet}
     * @memberof BlockchainProvider
     */
    static createWalletSimple(walletName: string, password: Password, network: NetworkType): SimpleWallet {
        return SimpleWallet.create(walletName, password, network)
    }

    /**
     *
     *
     * @static
     * @param {string} value
     * @returns
     * @memberof BlockchainProvider
     */
    static createPassword(value: string) {
        return new Password(value)
    }
}