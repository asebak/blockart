const Nas = require('nebulas');

function NebInvoke(contractId, addressId, account) {
    this.contractId = contractId;
    this.addressId = addressId;
    this.chainId = parseInt(process.env.NAS_NETWORK_CHAINID);
    this.gaslimit = "200000";
    this.gasprice = "1000000";
    this.account = account;
  }
  // class methods
  NebInvoke.prototype.rpcCall = function(method, callArgs, amount, cbSuccess, cbError) {
    var neb = new Nas.Neb();
    neb.setRequest(new Nas.HttpRequest(process.env.NAS_NETWORK_ENDPOINT));
    var fromAddress = this.addressId;
    var toAddress = this.contractId;
    var chainId = this.chainId;
    var gasprice = this.gasprice;
    var gaslimit = this.gaslimit;
    var account = this.account;
    
    neb.api.getAccountState(this.addressId)
    .then(function (resp) {
        if (resp.error) {
            return cbError(e.message);
        } else {
          var nonce = parseInt(resp.nonce || 0) + 1

          var contract = {function: method, args: callArgs}
         var result = neb.api.call({
            from: fromAddress,
            to: toAddress,
            value:  Nas.Unit.nasToBasic(Nas.Utils.toBigNumber(amount)),
            nonce: nonce,
            gasPrice: gasprice,
            gasLimit: gaslimit,
            contract: contract
        }).then(cbSuccess)
        .catch(cbError);
        }
    })
    .catch(cbError);

  };

  NebInvoke.prototype.txCall = function(method, callArgs, amount, cbSuccess, cbError) {
    var neb = new Nas.Neb();
    neb.setRequest(new Nas.HttpRequest(process.env.NAS_NETWORK_ENDPOINT));
    var fromAddress = this.addressId;
    var toAddress = this.contractId;
    var chainId = this.chainId;
    var gasprice = this.gasprice;
    var gaslimit = this.gaslimit;
    var account = this.account;
    
    neb.api.getAccountState(this.addressId)
    .then(function (resp) {
        if (resp.error) {
            return cbError(e.message);
        } else {
          var balance  = Nas.Unit.fromBasic(Nas.Utils.toBigNumber(resp.balance), "nas").toNumber();
          var nonce = parseInt(resp.nonce || 0) + 1
          var contract = {};
          if(method != null && callArgs != null){
          contract = {function: method, args: callArgs}
          } else{
            contract = null;
          }
         var gTx = new Nas.Transaction(chainId, account, toAddress, 
            Nas.Unit.nasToBasic(Nas.Utils.toBigNumber(amount)), parseInt(nonce), gasprice, gaslimit, contract);
            var response;
           gTx.signTransaction();
           gTx && neb.api.sendRawTransaction(gTx.toProtoString())
           .then(cbSuccess)
           .catch(cbError);
           
        }
    })
    .catch(cbError);

  };
  // export the class
  module.exports = NebInvoke;