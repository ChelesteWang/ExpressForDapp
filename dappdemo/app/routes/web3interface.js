var express = require("express");
const Web3 = require("web3");
var web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:7545"));
var router = express.Router();

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

router.post("/1234", function (req, res, next) {
  let { msg } = req.body;
});

router.get("/getBlockNumber", function (req, res, next) {
  web3.eth.getBlockNumber(function (error, result) {
    if (!error) res.send(JSON.stringify(result));
    else res.send(JSON.stringify(error));
  });
});

module.exports = router;
