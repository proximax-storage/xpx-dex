import { SimpleWallet } from 'tsjs-xpx-chain-sdk/dist/src/model/wallet/SimpleWallet';
import { Password } from 'tsjs-xpx-chain-sdk/dist/src/model/wallet/Password';
import { NetworkType } from 'tsjs-xpx-chain-sdk/dist/src/model/blockchain/NetworkType';
import { Account } from 'tsjs-xpx-chain-sdk/dist/src/model/account/Account';
export declare class BlockchainProvider {
    static createNewAccount(networkType: NetworkType): Account;
    static createWalletSimple(walletName: string, password: Password, network: NetworkType): SimpleWallet;
    static createPassword(value: string): Password;
}
