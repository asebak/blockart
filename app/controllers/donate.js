const Nas = require('nebulas');
const NebInvoke = require('../smartcontracts/invoke');
this.account = Nas.Account.NewAccount();

exports.getDonate = (req, res) => {
    var artId = req.params.artId;
    this.getArtwork(req, artId, function(data){
        res.render('art/donate', {
            title: 'Donate Art',
            env: {
              endpoint: process.env.NAS_NETWORK_ENDPOINT,
              chain: process.env.NAS_NETWORK_CHAINID
            },
            data: data
          });
    });

  };

  exports.getArtwork= function(req, txId, callBack) {
    try {
      var id = "";
      if(req.user){
     id = req.user.addressId;
      } else{
        id = this.account.getAddressString();
      }
     
     var Neb = Nas.Neb;
     var neb = new Neb();
  
           var toAddress = process.env.NAS_ART_CONTRACT_ID;
           var amount = "0"
          var callArgs = "[\"" + txId  + "\"]";   
  
           var nebInvoke = new NebInvoke(toAddress, id, id);
           nebInvoke.rpcCall("get", callArgs, amount, function(response){
             if(response.result != null && response.result != "null"){
               var usersArt = [];
               var obj = JSON.parse(response.result);
               if(obj && obj.art){
                callBack(obj.art);
               }else{
                callBack({});
               }
             }else{          
              callBack({});
            }
            }, function(error){
              callBack({});
            });
        
    } catch (err) {
      callBack({});
    }
  }
  

 
  exports.postDonate = (req, res, next) => {
try{
  var fromAddress = req.user.addressId;
  var toAddress = req.body.toUserId;
  var balance = req.user.balance;
  var amount = req.body.amount;
  var acc = Nas.Account.fromAddress(fromAddress); 
  acc = acc.fromKey(req.user.key, req.body.password); 
  var nebInvoke = new NebInvoke(toAddress, fromAddress, acc);
  nebInvoke.txCall(null, null, amount, function(response){
      req.flash('success', { msg: 'Donation has been made with id: ' + response.txhash });
      res.redirect('/');
  }, function(error){
    req.flash('errors', { msg: 'Artwork could not be uploaded : ' + error.message });
    res.redirect('/');
  });
} catch (error) {
  req.flash('errors', { msg: error.message });
  res.redirect('/');
}
};


 