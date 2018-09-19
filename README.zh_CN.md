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

## 依赖说明

### 依赖的 egg 版本

egg-ethereum 版本 | egg 1.x
--- | ---
1.x | 😁
0.x | ❌

## 安装

```bash
$ npm i egg-ethereum --save
```

## 开启插件

```js
// config/plugin.js
exports.ethereum = {
  enable: true,
  package: 'egg-ethereum',
};
```

## 详细配置
```
exports.ethereum = {
    // 以太坊节点
    httpProvider: 'https://rinkeby.infura.io/metamask'
    // 是否开启参数校验
    validate: true
};
```
请到 [config/config.default.js](config/config.default.js) 查看详细配置项说明。

## 如何使用
该插件所有方法都会对参数进行校验,并在参数错误的情况下抛出异常.如需禁用它,请在配置中将**validate**设置为`false`

## 挂载在app上的实例
### app.web3
>应用在启动时已经为你创建了一个web3实例
```
app.web3
app.web3.eth
...
```
### app.GasTool
>GasTool为一个类,开始时已经为你创建了一个它的实例
#### 属性
`gasLimit`-油费限制,默认值为'0x44364c5bb0000'  
`gas`-发起方提供的油费,默认值为'0x13880'
#### 方法
1. setGas(gas):覆盖默认值  
  参数:  
    - `Object`-一个包含gas和gasLimit的对象,可以只包含其中的一项
2. getLastestGas(): 获取交易时的油费  
  返回值:  
  `Object`-包含以下信息:  
      - `gasPrice`- 当前的gas价格。这个值由最近几个块的gas价格的中值决定 
      - `gas`-发起方提供的油费  
      - `gasLimit`-油费限制
## 挂载在app上的方法
### app.createAccounts([amount])
>创建一个或多个以太坊账户

是否异步：是

参数
  - `amount`(可选)-int类型,创建数量,默认值为1

返回值  
`Array`-多个账户对象
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
>检查是否为有效的以太坊地址

是否异步：否

参数  
  - `address`-String类型,以太坊地址

返回值  
`boolean`-当返回值为false时表明该地址是无效的
### app.isValidPrivate(privatekey)
>检查是否为有效的私钥

是否异步：否

参数  
  - `privatekey`-String类型,账户私钥

返回值  
`boolean`-当返回值为false时表明该私钥是无效的
### app.getBalance(address[,tokenAddress])
>获取账户余额

是否异步：是

参数  
  - `address`-String类型,以太坊地址
  - `tokenAddress`(可选)-String类型,代币合约地址,如果为空则查询Eth余额

返回值  
`Object`-余额对象  
  - `balance`-String类型,余额
  - `decimals`-String类型,精度
  ```
  {
      "decimals": "18",
      "balance": "0"
  }
  ```
### app.getTokenInfo(address)
>查询ERC20规范代币信息

是否异步：是

参数  
  - `address`-String类型,代币合约地址

返回值  
`Object`-代币信息对象  
  - `name`-String类型,代币名称
  - `symbol`-String类型,代币符号
  - `decimals` -String类型,代币的精度
  ```
  {
      "name": "TIC",
      "symbol": "TIC",
      "decimals": "18"
  }
  ```
### app.getTransactionInfo(txHash)
>根据交易哈希获取交易信息

是否异步：是

参数  
  - `txHash`-String类型,交易哈希值

返回值  
`Object`-一个交易对象(如果该交易已完成,则同时包含收据信息)  
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
        "logsBloom": "0x00000000000000001000000000000000000000000008000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000008000000000000000000000000000000000000001000000000000000000000000000000000200000000000000000000010000000000000000000000000000000000000000000000000000000000000000000000000002000000000400000000000000000000000000000000000000000000000000000000002000000000000000000800000000000000000000000000000001000000000000000000000000000000000000000000000000001000000000000000000",
        "status": true,
        "transactionHash": "0xd1fb747c4a42035a981f73f525b583e929bd7b42abdc233a0e696753295eeae6"
}
```

[查看transaction对象属性](https://web3js.readthedocs.io/en/1.0/web3-eth.html#gettransaction)

[查看transactionReceipt对象属性](https://web3js.readthedocs.io/en/1.0/web3-eth.html#gettransactionreceipt)
### app.sendTokenTransaction(txParam)
>发送代币交易

是否异步：是

参数  
  - `txParam`-Object类型,交易初始参数对象,应包含以下信息:  
    - `from`-发送方地址
    - `privatekey`-私钥
    - `to`-接收方地址
    - `amount`-交易金额
    - `tokenAddress`-代币合约地址

返回值  
`Object`-对象包含以下属性  
  - `listener`-事件对象
  - `txHash`-交易哈希
  - `txParams`-交易参数
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
>发送ETH交易

是否异步：是

参数  
  - `txParam`-Object类型,交易初始参数对象,应包含以下信息:
    - `from`-发送方地址
    - `privatekey`-私钥
    - `to`-接收方地址
    - `amount`-交易金额

返回值  
`Object`-对象包含以下属性  
  - `listener`-事件对象
  - `txHash`-交易哈希
  - `txParams`-交易参数
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
>交易签名

是否异步：否

参数  
  - `params`-Object类型,应包含以下信息:
    - `from`-发送方地址
    - `nonce`-指定地址发送的交易数量
    - `gasPrice`- 当前的gas价格。这个值由最近几个块的gas价格的中值决定  
    - `gas`-发起方提供的油费  
    - `gasLimit`-油费限制
    - `to`-接收方地址(如果为代币交易,则是合约地址)
    - `value`-交易数额(如果为代币交易,则为'0x0')
    - `data`-如果为代币交易则为代币交易的信息,ETH交易为'0x'
  - `privatekey`-String类型,发送方私钥
返回值  
`Object`-对象包含以下属性  
  - `tx`-签名的交易数据
  - `txHash`-交易哈希
### app.estimateGas(from,to,amount[,tokenAddress])
>估算油费

是否异步：是

参数  
  - `from`-发送方地址
  - `to`-接收方地址
  - `amount`-交易金额
  - `tokenAddress`(可选)-代币合约地址

返回值  
`string`-预计费用
### app.getGasCost(gasPrice, gasUsed)
>计算油费

是否异步：否

参数  
  - `gasPrice`-当前的gas价格,这个值由最近几个块的gas价格的中值决定
  - `gasUsed`-消耗数量

返回值  
`string`-预计费用

## 提问交流

请到 [egg issues](https://github.com/iamljw/egg-ethereum/issues) 异步交流。

## License

[MIT](LICENSE)
