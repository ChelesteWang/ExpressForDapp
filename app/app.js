// 对象' contract '在这里被注入，它包含了所有合约的所有数据，按合约名称键值:
Contracts['HelloWorld'] = {
 abi: [],
//  契约实例的地址 
 address: "0x...",
// 服务器地址端口连接
 endpoint: "127.0.0.1:7545"
}

//创建智能契约的实例，将其作为属性传递，
//它允许web3.js与之交互。
function HelloWorld(Contract) {
    this.web3 = null;
    this.instance = null;
    this.Contract = Contract;
  }
  
  //初始化“HelloWorld”对象并创建一个web3.js库的实例。
  HelloWorld.prototype.init = function () {
    // 使用提供程序创建一个新的Web3实例
    // Learn more: https://web3js.readthedocs.io/en/v1.2.0/web3.html
    this.web3 = new Web3(
      (window.web3 && window.web3.currentProvider) ||
        new Web3.providers.HttpProvider(this.Contract.endpoint)
    );
  
    // 使用web3.js契约对象创建契约接口
    // Learn more: https://web3js.readthedocs.io/en/v1.2.0/web3-eth-contract.html#new-contract
    var contract_interface = this.web3.eth.contract(this.Contract.abi);
  
    // 定义契约实例的地址
    this.instance = this.Contract.address
      ? contract_interface.at(this.Contract.address)
      : { message: () => {} };
  };
  
  // 获取存储在契约实例上的“message”值。
  HelloWorld.prototype.getMessage = function (cb) {
    this.instance.message(function (error, result) {
      cb(error, result);
    });
  };
  
  // 更新契约实例上的“message”值。
  // 当用户点击界面中的“发送”按钮时触发此功能。
  HelloWorld.prototype.setMessage = function () {
    var that = this;
    var msg = $("#message-input").val();
    this.showLoader(true);
  
    // 使用智能合约的公共更新功能设置消息
    this.instance.update(
      msg,
      {
        from: window.web3.eth.accounts[0],
        gas: 100000,
        gasPrice: 100000,
        gasLimit: 100000,
      },
      function (error, txHash) {
        if (error) {
          console.log(error);
          that.showLoader(false);
        }
        // 如果成功，等待交易确认，
        // 然后清除形式值
        else {
          that.waitForReceipt(txHash, function (receipt) {
            that.showLoader(false);
            if (receipt.status) {
              console.log({ receipt });
              $("#message-input").val("");
            } else {
              console.log("error");
            }
          });
        }
      }
    );
  };
  
  // 等待接收交易
  HelloWorld.prototype.waitForReceipt = function (hash, cb) {
    var that = this;
  
    // 使用web3.js库方法检查交易收据
    this.web3.eth.getTransactionReceipt(hash, function (err, receipt) {
      if (err) {
        error(err);
      }
      if (receipt !== null) {
        // 交易经历
        if (cb) {
          cb(receipt);
        }
      } else {
        // 2秒后再试一次
        window.setTimeout(function () {
          that.waitForReceipt(hash, cb);
        }, 2000);
      }
    });
  };
  
  // 使用web3js的“getBlockNumber”函数获取最新的块号
  // Learn more: https://web3js.readthedocs.io/en/v1.2.1/web3-eth.html#getblocknumber
  HelloWorld.prototype.getBlockNumber = function (cb) {
    this.web3.eth.getBlockNumber(function (error, result) {
      cb(error, result);
    });
  };
  
  // 在执行异步操作时隐藏或显示加载程序
  HelloWorld.prototype.showLoader = function (show) {
    document.getElementById("loader").style.display = show ? "block" : "none";
    document.getElementById("message-button").style.display = show
      ? "none"
      : "block";
  };
  
  
  // 然后调用上面定义的函数' getMessage '和' getBlockNumber '
  // 将DOM元素文本设置为它们返回的值或显示错误消息
  HelloWorld.prototype.updateDisplay = function () {
    var that = this;
    this.getMessage(function (error, result) {
      if (error) {
        $(".error").show();
        return;
      }
      $("#message").text(result);
  
      that.getBlockNumber(function (error, result) {
        if (error) {
          $(".error").show();
          return;
        }
        $("#blocknumber").text(result);
        setTimeout(function () {
          that.updateDisplay();
        }, 1000);
      });
    });
  };
  
  // 将setMessage函数绑定到在app.html中定义的按钮
  HelloWorld.prototype.bindButton = function () {
    var that = this;
  
    $(document).on("click", "#message-button", function () {
      that.setMessage();
    });
  };
  
  // 删除欢迎内容，并显示主要内容。
  // 在合约部署后调用
  HelloWorld.prototype.updateDisplayContent = function () {
    this.hideWelcomeContent();
    this.showMainContent();
  };
  
  // 合约的地址在被部署之前是不会被设置的
  HelloWorld.prototype.hasContractDeployed = function () {
    return this.instance && this.instance.address;
  };
  
  HelloWorld.prototype.hideWelcomeContent = function () {
    $("#welcome-container").addClass("hidden");
  };
  
  HelloWorld.prototype.showMainContent = function () {
    $("#main-container").removeClass("hidden");
  };
  
  // 创建“HelloWorld”对象实例的JavaScript样板
  // 以上定义，并在页面上显示HTML元素:
  HelloWorld.prototype.main = function () {
    $(".blocknumber").show();
    $(".message").show();
    this.updateDisplay();
  };
  
  HelloWorld.prototype.onReady = function () {
    this.init();
  // 不要显示交互UI元素，比如input/button
  // 合约已经部署。
    if (this.hasContractDeployed()) {
      // 删除欢迎内容，并显示主要内容。
      this.updateDisplayContent();
      // 绑定按钮
      this.bindButton();
    }
    this.main();
  };
  
  if (typeof Contracts === "undefined")
    var Contracts = { HelloWorld: { abi: [] } };
  
  var helloWorld = new HelloWorld(Contracts["HelloWorld"]);
  
  // 网站预加载时执行
  $(document).ready(function () {
    helloWorld.onReady();
  });
  