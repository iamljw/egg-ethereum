'use strict';

const abi = require('human-standard-token-abi');
const EthereumTx = require('ethereumjs-tx');
const SimpleKeyring = require('eth-simple-keyring');
const { privateToPublic, keccak256, isValidAddress, isValidPrivate, toBuffer } = require('ethereumjs-util');
const validRule = require('../rules/validator.json');
const { validate } = require('../errors/validator');

module.exports = {
    /**
     * 创建一个或多个以太坊账号,并获取私钥和公钥
     * @return {Array} 账号信息
     * @param {number} amount 创建账号的数量(可选)
     */
    async createAccounts(amount) {
        validate(validRule.createAccounts, { amount }, this);
        amount = amount || 1;
        const simpleKeyring = new SimpleKeyring();
        const address = await simpleKeyring.addAccounts(amount);
        const accounts = [];
        for (const temp of address) {
            const privatekey = await simpleKeyring.exportAccount(temp);
            const publickey = await privateToPublic(keccak256(privatekey));
            const account = {
                address: temp.toLowerCase(),
                privatekey,
                publickey: publickey.toString('Hex')
            };
            accounts.push(account);
        }
        return accounts;
    },
    /**
     * 检查是否为有效的以太坊地址
     * @return {boolean} false:无效的以太坊地址
     * @param {string} address 以太坊地址
     */
    isValidAddress(address) {
        validate(validRule.isValidAddress, { address }, this);
        return isValidAddress(address);
    },
    /**
     * 检查是否为有效的私钥
     * @return {boolean} false:无效的私钥
     * @param {string} privatekey 账户私钥
     */
    isValidPrivate(privatekey) {
        validate(validRule.isValidPrivate, { privatekey }, this);
        return isValidPrivate(toBuffer(`0x${privatekey}`));
    },
    /**
     * 获取账户余额
     * @return {object} 对象包括余额以及精度
     * @param {string} address 账户地址
     * @param {string} tokenAddress 代币合约地址(可选)
     */
    async getBalance(address, tokenAddress) {
        validate(validRule.getBalance, { address, tokenAddress }, this);
        const result = { decimals: '18' };
        if (tokenAddress) {
            const token = new this.web3.eth.Contract(abi, tokenAddress);
            const tokenInfo = await this.getTokenInfo(tokenAddress);
            result.balance = await token.methods.balanceOf(address).call();
            result.decimals = tokenInfo ? tokenInfo.decimals : void 0;
        } else {
            result.balance = await this.web3.eth.getBalance(address);
        }
        return result;
    },
    /**
     * 查询ERC20规范代币信息
     * @return {object} 代币信息
     * @param {string} address 代币合约地址
     */
    async getTokenInfo(address) {
        validate(validRule.isValidAddress, { address }, this);
        const token = new this.web3.eth.Contract(abi, address);
        const [name, symbol, decimals] = await Promise.all([
            token.methods.name().call(),
            token.methods.symbol().call(),
            token.methods.decimals().call()
        ]);
        return { name, symbol, decimals };
    },
    /**
     * 根据交易哈希获取交易信息
     * @return {object} 交易信息
     * @param {string} txHash 交易哈希
     */
    async getTransactionInfo(txHash) {
        validate(validRule.getTokenInfo, { txHash }, this);
        const [transaction, receipt] = await Promise.all([
            this.web3.eth.getTransaction(txHash),
            this.web3.eth.getTransactionReceipt(txHash)
        ]);
        return Object.assign(transaction, receipt);
    },
    /**
     * 发送代币交易
     * @return {object} 事件对象,交易哈希,交易参数
     * @param {object} txParam 交易初始的参数
     */
    async sendTokenTransaction(txParam) {
        validate(validRule.sendTokenTransaction, txParam, this);
        const { gas, gasLimit, gasPrice } = await this.GasTool.getLastestGas();
        const { from, privatekey, to, amount, tokenAddress } = txParam;

        const nonce = await this.web3.eth.getTransactionCount(from, 'pending');
        const token = new this.web3.eth.Contract(abi, tokenAddress);

        const txParams = {
            from,
            nonce: '0x' + nonce.toString(16),
            gasPrice, // 10Gwei
            gasLimit, // 80000Gas * 1Gwei
            to: tokenAddress, // must be contract address
            value: '0x0', // must be 0
            gas, // 80000gas
            data: token.methods.transfer(to, amount).encodeABI()
        };

        const { tx, txHash } = this.ethSign(txParams, privatekey);
        const listener = this.web3.eth.sendSignedTransaction('0x' + tx.toString('hex'));

        return { listener, txHash, txParams };
    },
    /**
     * 发送ETH交易
     * @return {object} 事件对象,交易哈希,交易参数
     * @param {object} txParam 交易初始的参数
     */
    async sendEthTransaction(txParam) {
        validate(validRule.sendEthTransaction, txParam, this);
        const BN = this.web3.utils.BN;
        const { gas, gasLimit, gasPrice } = await this.GasTool.getLastestGas();
        const { from, privatekey, to, amount } = txParam;
        const nonce = await this.web3.eth.getTransactionCount(from, 'pending');

        const txParams = {
            from,
            nonce: '0x' + nonce.toString(16),
            gasPrice, // 10Gwei
            gasLimit, // 80000Gas * 1Gwei
            to, // address of receiver
            value: '0x' + (new BN(amount)).toString(16),
            gas, // 80000gas
            data: '0x'
        };

        const { tx, txHash } = this.ethSign(txParams, privatekey);
        const listener = this.web3.eth.sendSignedTransaction('0x' + tx.toString('hex'));

        return { listener, txHash, txParams };
    },
    /**
     * 交易签名
     * @return {object} 签名的交易数据,交易哈希
     * @param {object} params 交易参数
     * @param {string} privatekey 发送方私钥
     */
    ethSign(params, privatekey) {
        validate(validRule.ethSign, { params, privatekey }, this);
        let tx = new EthereumTx(params);
        tx.sign(Buffer.from(privatekey, 'hex'));
        const txHash = '0x' + tx.hash().toString('hex');
        tx = tx.serialize();
        return { tx, txHash };
    },
    /**
     * 估算矿工费
     * @return {string} 估算出的矿工费
     * @param {string} from 发送方地址
     * @param {string} to 接收方地址
     * @param {string} amount 数额
     * @param {string} tokenAddress 代币合约地址
     */
    async estimateGas(from, to, amount, tokenAddress) {
        validate(validRule.estimateGas, { from, to, amount, tokenAddress }, this);
        let gas;
        if (tokenAddress) {
            const token = new this.web3.eth.Contract(abi, tokenAddress);
            const transferObj = token.methods.transfer(to, amount);
            gas = await transferObj.estimateGas({ from, to: tokenAddress, value: '0x0', data: transferObj.encodeABI() });
        } else {
            gas = await this.web3.eth.estimateGas({ from, to, value: this.web3.utils.toHex(amount) });
        }
        const gasPrice = await this.web3.eth.getGasPrice();
        return this.getGasCost(gasPrice, gas);
    },
    /**
     * 计算矿工费用
     * @return {string} 预计费用
     * @param {string} gasPrice 当前的gas价格,这个值由最近几个块的gas价格的中值决定
     * @param {int} gasUsed 消耗数量
     */
    getGasCost(gasPrice, gasUsed) {
        validate(validRule.getGasCost, { gasPrice, gasUsed }, this);
        const BN = this.web3.utils.BN;
        let gasPriceBN;
        if (gasPrice.substring(0, 2) === '0x') {
            gasPrice = gasPrice.substring(2, gasPrice.length);
            gasPriceBN = new BN(gasPrice, 16);
        } else {
            gasPriceBN = new BN(gasPrice, 10);
        }
        const gasUsedBN = new BN(gasUsed, 10);
        return gasPriceBN.mul(gasUsedBN).toString();
    }
};
