# 基于自建以太链的数据存储系统

项目核心分支 ExpressForDapp

使用 express 与 web3.js 创建服务端与区块链交互接口

## 项目构成

```

DappDemo/dappdemo/app 服务端与区块链交互接口

DappDemo/dappdemo/contracts 自建以太链的智能合约文件

DappDemo/dappdemo/truffle-config.js 部署区块链智能合约的配置文件

```

## 部署流程

#### 自建区块链（测试环境）

安装所需工具(需要 node.js 和 npm 环境)

```shell
$ npm install -g ganache-cli
$ npm install -g truffle
$ npm install -g vue-cli
```

创建 truffle 工程 编写自己的智能合约（可选）

如果想创建一个空工程，可以用下面的命令：

```shell
$ truffle init
```

#### 编译和部署合约

把智能合约部署到链上需要设置 IP、端口、网络 ID

修改 truffle.js：

```
module.exports = {
  networks: {
    development: {
      host: "localhost",
      port: "7545",
      network_id: "*", // Match any network id
    },
  },
};
```

默认 使用本机的 ganache 测试环境为 “localhost:7545"

使用下面两条命令编译和部署：

```shell
$ truffle compile
$ truffle migrate
```

#### 测试运行智能合约

```shell
$ truffle test
```

#### 部署服务端与区块链交互接口 

安装依赖启动项目
```shell
$ npm install 
$ npm run serve
```