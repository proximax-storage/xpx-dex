"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BlockchainProvider = void 0;
const SimpleWallet_1 = require("tsjs-xpx-chain-sdk/dist/src/model/wallet/SimpleWallet");
const Password_1 = require("tsjs-xpx-chain-sdk/dist/src/model/wallet/Password");
const Account_1 = require("tsjs-xpx-chain-sdk/dist/src/model/account/Account");
class BlockchainProvider {
    static createNewAccount(networkType) {
        return Account_1.Account.generateNewAccount(networkType);
    }
    static createWalletSimple(walletName, password, network) {
        return SimpleWallet_1.SimpleWallet.create(walletName, password, network);
    }
    static createPassword(value) {
        return new Password_1.Password(value);
    }
}
exports.BlockchainProvider = BlockchainProvider;
