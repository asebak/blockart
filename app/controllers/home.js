const NebInvoke = require('../smartcontracts/invoke');
const Nas = require('nebulas');
this.account = Nas.Account.NewAccount();
/**
 * GET /
 * Home page.
 */
exports.index = (req, res) => {
  var contractId = process.env.NAS_RAP_CONTRACT_ID;
  this.getArtwork(this.account.getAddressString(), function(data){
    res.render('home', {
      title: 'Home',
      env: {
        endpoint: process.env.NAS_NETWORK_ENDPOINT,
        chain: process.env.NAS_NETWORK_CHAINID,
      },
      data: data
    });
  });

};

exports.addressIdToUsername = function(id, callback){
  try {
    
    var Neb = Nas.Neb;
    var neb = new Neb();
 
          var toAddress = process.env.NAS_USER_CONTRACT_ID;
          var amount = "0"
         var callArgs = "[\"" + id  + "\"]";   
 
          var nebInvoke = new NebInvoke(toAddress, this.account.getAddressString(), this.account.getAddressString());
          nebInvoke.rpcCall("get", callArgs, amount, function(response){
            if(response.result != null && response.result != "null"){
              var usersArt = [];
              var obj = JSON.parse(response.result);
              if(obj){
                callBack(obj.name) 
              }else{
              callBack({});
              }
            }else{
         
             callBack([]);
         }
           }, function(error){
             callBack([]);
           });
       
   } catch (err) {
     callBack([]);
   }
};

exports.getArtwork= function(id, callBack) {
  try {
   // var acc = account.fromAddress(req.user.addressId);
   //var id = acc.getAddressString();
   
   var Neb = Nas.Neb;
   var neb = new Neb();

         var toAddress = process.env.NAS_ART_CONTRACT_ID;
         var amount = "0"
        var callArgs = "[\"" + ''  + "\"]";   

         var nebInvoke = new NebInvoke(toAddress, id, id);
         nebInvoke.rpcCall("getAll", callArgs, amount, function(response){
           if(response.result != null && response.result != "null"){
             var usersArt = [];
             var obj = JSON.parse(response.result);
             if(obj && obj.length){
               for(var i =0; i< obj.length; i++){
                 if(obj[i] !== null){
                    usersArt.push(obj[i].art);
                }
               }
             }
             callBack(usersArt);
           }else{
        
            callBack([]);
        }
          }, function(error){
            callBack([]);
          });
      
  } catch (err) {
    callBack([]);
  }
}
