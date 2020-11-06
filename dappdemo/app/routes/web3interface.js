var express = require("express");
const Web3 = require("web3");
var web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:7545"));
var router = express.Router();
var Contract = {
  abi: [],
  address: "0x598a366C768aAA60697cC0c254aC4F57c29D6c07",
  endpoint: "http://localhost:7545",
};
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

router.post("/sendMessage", function (req, res, next) {
//   let { msg, from, to } = req.body;
  var msg = "helloworld";
  let data = web3.utils.toHex(msg);
  var from = "0xa4D36E545C786f9aFf568B369deb2DA9c08583B8";
  var to = "0x598a366C768aAA60697cC0c254aC4F57c29D6c07";
  let transaction = {
    from,
    to,
    value: "0x00",
    data: data,
  };
  console.log(transaction);
  web3.eth.sendTransaction(transaction, (error, hash) => {
    console.log(hash);
    var result = web3.utils.toAscii(hash);
    console.log(result);
    res.send(result);
  });
});
module.exports = router;
