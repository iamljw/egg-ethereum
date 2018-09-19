# egg-ethereum

[![NPM version][npm-image]][npm-url]
[![build status][travis-image]][travis-url]
[![Test coverage][codecov-image]][codecov-url]
[![David deps][david-image]][david-url]
[![Known Vulnerabilities][snyk-image]][snyk-url]
[![npm download][download-image]][download-url]

[npm-image]: https://img.shields.io/npm/v/egg-ethereum.svg?style=flat-square
[npm-url]: https://npmjs.org/package/egg-ethereum
[travis-image]: https://img.shields.io/travis/eggjs/egg-ethereum.svg?style=flat-square
[travis-url]: https://travis-ci.org/eggjs/egg-ethereum
[codecov-image]: https://img.shields.io/codecov/c/github/eggjs/egg-ethereum.svg?style=flat-square
[codecov-url]: https://codecov.io/github/eggjs/egg-ethereum?branch=master
[david-image]: https://img.shields.io/david/eggjs/egg-ethereum.svg?style=flat-square
[david-url]: https://david-dm.org/eggjs/egg-ethereum
[snyk-image]: https://snyk.io/test/npm/egg-ethereum/badge.svg?style=flat-square
[snyk-url]: https://snyk.io/test/npm/egg-ethereum
[download-image]: https://img.shields.io/npm/dm/egg-ethereum.svg?style=flat-square
[download-url]: https://npmjs.org/package/egg-ethereum

<!--
Description here.
-->

## Install

```bash
$ npm i egg-ethereum --save
```

## Usage

```js
// {app_root}/config/plugin.js
exports.ethereum = {
  enable: true,
  package: 'egg-ethereum',
};
```

## Configuration

```js
// {app_root}/config/config.default.js
exports.ethereum = {
    // ethereum node
    httpProvider: 'https://rinkeby.infura.io/metamask'
    // Whether to enable parameter verification
    validate: true
};
```

see [config/config.default.js](config/config.default.js) for more detail.

## how to use
All methods of the plugin will check the parameters and throw an exception if the parameters are wrong. To disable it, set **validate** to `false` in the configuration.

## Mounting an instance on the app
### app.web3
>The app has created a web3 instance for you at startup
```
App.web3
App.web3.eth
...
```
### app.GasTool
>GasTool is a class that has already created an instance of it for you at the beginning.
#### Attributes
`gasLimit` - fuel fee limit, default value is '0x44364c5bb0000'
`gas`- the fuel fee provided by the initiator, the default value is '0x13880'
#### methods
1. setGas(gas): override the default value
   Parameters:
     - `Object` - an object containing gas and gasLimit, which can contain only one of them
2. getLastestGas(): Get the fuel cost of the transaction
   return value: 
   `Object`- contains the following information:
       - `gasPrice`- current gas price. This value is determined by the median of the gas prices of the last few blocks.
       - `gas`- the fuel fee provided by the originator
       - `gasLimit` - oil fee limit
## Mounting methods on the app
### app.createAccounts([amount])
>Create one or more Ethereum accounts

Whether asynchronous: yes

parameter  
  - `amount` (optional) - int type, create quantity, default value is 1

return value  
`Array` - multiple account objects
```
[
    {
        "address": "0x34673af9cacf9af6d61e52f264527af2165d0c29",
        "privatekey": "d5a34df6bd6334fe77cfb07edc2c0288db598bb9186ca577f2c5997373d6b93f",
        "publickey": "b39988cc26dbe84223faa05d0472ab277476e6367db79b39789427bee55f69ade7094b3b81f4c37c2711a53e3f9e57423141db70802302365a0f60ec239760ad"
    },
    {
        "address": "0xf826251e60306d778a9c62e20f5d3f92cc4ac3a8",
        "privatekey": "f2cb16bab57e253407b68cfcdbdcae70a37c8a25c1eb1a1fee60199c59c1d97a",
        "publickey": "798c99c689b7b6ece946b5ea85bd010977f9382904eb0aafe5f7633a1c6230cfd3f6c2e3f2190c61724843404eedcbef357a30cb6f0335d5c1b36f8005d79de3"
    }
]
```
### app.isValidAddress(address)
>Check if it is a valid Ethereum address

Whether asynchronous: no

Parameter  
  - `address`-String type, Ethereum address

return value  
`boolean`- indicates that the address is invalid when the return value is false
### app.isValidPrivate(privatekey)
>Check if it is a valid private key

Whether asynchronous: no

Parameter  
  - `privatekey`-String type, account private key

return value  
`boolean`- indicates that the private key is invalid when the return value is false
### app.getBalance(address[,tokenAddress])
>Get account balance

Whether asynchronous: yes

Parameter  
  - `address`-String type, Ethereum address
  - `tokenAddress` (optional) - String type, token contract address, if empty, query Eth balance

return value  
`Object`- balance object
  - `balance`-String type, balance
  - `decimals`-String type, precision
```
  {
      "decimals": "18",
      "balance": "0"
  }
```
### app.getTokenInfo(address)
>Query ERC20 specification token information

Whether asynchronous: yes

Parameter  
  - `address`-String type, token contract address

return value  
`Object`-token information object
  - `name`-String type, token name
  - `symbol`-String type, token symbol
  - `decimals` -String type, the precision of the token
```
  {
      "name": "TIC",
      "symbol": "TIC",
      "decimals": "18"
  }
```
### app.getTransactionInfo(txHash)
>Get transaction information based on transaction hash

Whether asynchronous: yes

Parameter  
  - `txHash`-String type, transaction hash value

return value  
`Object` - a transaction object (if the transaction is completed, it also contains receipt information)
```
{
        "blockHash": "0xf1f0b73dafd2bf44dcec2157a83a2efa16766e44d89f34380713b865294d243d",
        "blockNumber": 3014689,
        "from": "0x34673af9cacf9af6d61e52f264527af2165d0c29",
        "gas": 80000,
        "gasPrice": "1000000086",
        "hash": "0xd1fb747c4a42035a981f73f525b583e929bd7b42abdc233a0e696753295eeae6",
        "input": "0xa9059cbb000000000000000000000000f826251e60306d778a9c62e20f5d3f92cc4ac3a8000000000000000000000000000000000000000000000000002386f26fc10000",
        "nonce": 1,
        "r": "0x19aa0861dede0f87790a753314eeb58144ba834b997ca3628b65f79983f282f1",
        "s": "0x72937a832a17b6409f8209c3a3d650a60e09afe7eb6f23b21810b1c5cb0f2bf9",
        "to": "0x0519751ee117747b12cad3b9259c5d0845894fb8",
        "transactionIndex": 3,
        "v": "0x1b",
        "value": "0",
        "contractAddress": null,
        "cumulativeGasUsed": 186438,
        "gasUsed": 53271,
        "logs": [
            {
                "address": "0x0519751EE117747b12cAd3B9259c5d0845894fB8",
                "blockHash": "0xf1f0b73dafd2bf44dcec2157a83a2efa16766e44d89f34380713b865294d243d",
                "blockNumber": 3014689,
                "data": "0x000000000000000000000000000000000000000000000000002386f26fc10000",
                "logIndex": 1,
                "removed": false,
                "topics": [
                    "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef",
                    "0x00000000000000000000000034673af9cacf9af6d61e52f264527af2165d0c29",
                    "0x000000000000000000000000f826251e60306d778a9c62e20f5d3f92cc4ac3a8"
                ],
                "transactionHash": "0xd1fb747c4a42035a981f73f525b583e929bd7b42abdc233a0e696753295eeae6",
                "transactionIndex": 3,
                "id": "log_f78df7fd"
            }
        ],
        "logsBloom": "0x00000000000000001000000000000000000000000000000000000000000000000000000000000000000000000000000000000008000000000000000000000000000000000000000000000000000000000000000000002000000000000000000000100000000000000000000000000000000000000000000000000000000000000000000000000000000040000000000000000000000000000000000000000000000000000200000000000000000080000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000"
        "status": true,
        "transactionHash": "0xd1fb747c4a42035a981f73f525b583e929bd7b42abdc233a0e696753295eeae6"
}
```

[View transaction object properties](https://web3js.readthedocs.io/en/1.0/web3-eth.html#gettransaction)

[View transactionReceipt object properties](https://web3js.readthedocs.io/en/1.0/web3-eth.html#gettransactionreceipt)
### app.sendTokenTransaction(txParam)
>Send token transactions

Whether asynchronous: yes

Parameter
  - `txParam`-Object type, transaction initial parameter object, should contain the following information:
  - `from`- sender address
  - `privatekey`-private key
  - `to`-recipient address
  - `amount`-transaction amount
  - `tokenAddress` - token contract address

return value  
`Object`-object contains the following properties
  - `listener`-event object
  - `txHash`-transaction hash
  - `txParams`-transaction parameters
```
  {
      "listener": {},
      "txHash": "0xd1fb747c4a42035a981f73f525b583e929bd7b42abdc233a0e696753295eeae6",
      "txParams": {
          "from": "0x34673af9cacf9af6d61e52f264527af2165d0c29",
          "nonce": "0x1",
          "gasPrice": "0x3b9aca56",
          "gasLimit": "0x44364c5bb0000",
          "to": "0x0519751ee117747b12cad3b9259c5d0845894fb8",
          "value": "0x0",
          "gas": "0x13880",
          "data": "0xa9059cbb000000000000000000000000f826251e60306d778a9c62e20f5d3f92cc4ac3a8000000000000000000000000000000000000000000000000002386f26fc10000"
      }
  }
```
### app.sendEthTransaction(txParam)
>Send ETH transactions

Whether asynchronous: yes

Parameter  
  - `txParam`-Object type, transaction initial parameter object, should contain the following information:
    - `from`- sender address
    - `privatekey`-private key
    - `to`-recipient address
    - `amount`-transaction amount

return value  
`Object`-object contains the following properties
  - `listener`-event object
  - `txHash`-transaction hash
  - `txParams`-transaction parameters
```
  {
      "listener": {},
      "txHash": "0x3b39cdee2bc420abf29e8200c6aa1bed866dce34ac9e3d17bee20477e5185654",
      "txParams": {
          "from": "0x34673af9cacf9af6d61e52f264527af2165d0c29",
          "nonce": "0x0",
          "gasPrice": "0x3b9aecb9",
          "gasLimit": "0x44364c5bb0000",
          "to": "0xf826251e60306d778a9c62e20f5d3f92cc4ac3a8",
          "value": "0x2386f26fc10000",
          "gas": "0x13880",
          "data": "0x"
      }
  }
```
### app.ethSign(params,privatekey)
>Transaction signature

Whether asynchronous: no

Parameter  
  - `params`-Object type, should contain the following information:
    - `from`- sender address
    - `nonce` - the number of transactions sent by the specified address
    - `gasPrice`- current gas price. This value is determined by the median of the gas prices of the last few blocks.
    - `gas`- the fuel fee provided by the originator
    - `gasLimit` - oil fee limit
    - `to`-recipient address (or contract address if it is a token transaction)
    - `value`-the transaction amount (or '0x0' if it is a token transaction)
    - `data`- If the token transaction is a token transaction, the ETH transaction is '0x'
  - `privatekey`-String type, sender private key
return value  
`Object`-object contains the following properties
  - `tx`-signed transaction data
  - `txHash`-transaction hash
### app.estimateGas(from,to,amount[,tokenAddress])
> Estimated fuel fee

Whether asynchronous: yes

Parameter  
  - `from`- sender address
  - `to`-recipient address
  - `amount`-transaction amount
  - `tokenAddress` (optional) - token contract address

return value  
`string`-expected cost
### app.getGasCost(gasPrice, gasUsed)
> Calculate fuel costs

Whether asynchronous: no

Parameter
  - `gasPrice` - the current gas price, which is determined by the median of the gas prices of the last few blocks
  - `gasUsed` - consumption quantity

return value 
`string`-expected cost

## Questions & Suggestions

Please open an issue [here](https://github.com/iamljw/egg-ethereum/issues).

## License

[MIT](LICENSE)
