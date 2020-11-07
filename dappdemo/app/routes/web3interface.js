var express = require("express");
const Web3 = require("web3");
var web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:7545"));
var router = express.Router();

var Contract = {
  abi: [
    {
      constant: false,
      inputs: [
        {
          name: "newMessage",
          type: "string",
        },
      ],
      name: "update",
      outputs: [],
      payable: false,
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      constant: true,
      inputs: [],
      name: "message",
      outputs: [
        {
          name: "",
          type: "string",
        },
      ],
      payable: false,
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          name: "initMessage",
          type: "string",
        },
      ],
      payable: false,
      stateMutability: "nonpayable",
      type: "constructor",
    },
  ],
  address: "0x598a366C768aAA60697cC0c254aC4F57c29D6c07",
  endpoint: "http://localhost:7545",
};

var contract_interface = new web3.eth.Contract(Contract.abi, Contract.address);
var instance = contract_interface;

// 区块链用户
router.get("/getAccounts", function (req, res, next) {
  web3.eth.getAccounts(function (error, result) {
    if (!error) {
      res.send(JSON.stringify(result));
      console.log("success", JSON.stringify(result));
    } else {
      res.send(JSON.stringify.error);
      console.log("fail");
    }
  });
  //   res.render('index', { title: 'Express' });
});

// 区块链节点数
router.get("/getBlockNumber", function (req, res, next) {
  web3.eth.getBlockNumber(function (error, result) {
    if (!error) res.send(JSON.stringify(result));
    else res.send(JSON.stringify(error));
  });
});

// 区块链 gas 价格
router.get("/getGasPrice", function (req, res, next) {
  web3.eth.getGasPrice(function (error, result) {
    if (!error) res.send(JSON.stringify(result));
    else res.send(JSON.stringify(error));
  });
});

// 上传交易信息(发送数据)
router.get("/sendMessage", function (req, res, next) {
  // let { msg, from, to } = req.body;
  var msg = "5258661615151";
  var from = "0xa4D36E545C786f9aFf568B369deb2DA9c08583B8";
  var to = "0x598a366C768aAA60697cC0c254aC4F57c29D6c07";
  let data = web3.utils.toHex(msg);
  let transaction = {
    from,
    to,
    value: "0x00",
    data: data,
  };
  console.log(transaction);
  web3.eth.sendTransaction(transaction, (error, hash) => {
    console.log(hash);
    res.send(hash);
  });
});

// abi 接口调用 暂不能使用
router.get("/sendMessage1", function (req, res, next) {
  // let { msg, from, to } = req.body;
  var msg = "helloworld";
  instance.methods.update(msg).call(
    {
      from: web3.eth.accounts[0],
      gas: 100000,
      gasPrice: 100000,
      gasLimit: 100000,
    },
    // function (error, txHash) {
    //   if (error) {
    //     console.log(error);
    //   } else {
    //     console.log(txHash)
    //     getTransactionReceipt(txHash,function(receipt){
    //       if(receipt.status){
    //         console.log({ receipt });
    //         res.send(receipt)
    //       }
    //     })
    //   }
    // }
  );
  res.send("123456")
});

// var getTransactionReceipt = function(hash,cb) {
//   web3.eth.getTransactionReceipt(hash, function (err, receipt) {
//     if (err) {
//       error(err);
//     }
//     if (receipt !== null) {
//       if (cb) {
//         cb(receipt);
//       }
//     }
//   });
// }

// 获取交易信息(获取数据)
router.get("/getMessage", function (req, res, next) {
  var hash =
    "0x0a9dab32007cb7c0a0235ba106858e63e10768358cdaedb06554a13cdbac7787";
  web3.eth.getTransaction(hash, (error, result) => {
    var { input } = result;
    res.send(input);
  });
});

module.exports = router;
