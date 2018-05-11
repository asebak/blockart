const Nas = require('nebulas');
const NebInvoke = require('../smartcontracts/invoke');

exports.getSubmitArt = (req, res) => {
    res.render('art/submit', {
      title: 'Submit Art',
      env: {
        endpoint: process.env.NAS_NETWORK_ENDPOINT,
        chain: process.env.NAS_NETWORK_CHAINID
      }
    });
  };
 
  exports.postSubmitArt = (req, res, next) => {
try{
  var fromAddress = req.user.addressId;
  var toAddress = process.env.NAS_ART_CONTRACT_ID;
  var title = req.body.title;
  var picture = req.body.artworkbytes || '';
  var balance = req.user.balance;
  var amount = "0"
  var acc = Nas.Account.fromAddress(fromAddress); 
  var callArgs = "[\"" + title  + "\", \"" + picture + "\"]";   
  acc = acc.fromKey(req.user.key, req.body.password); 
  var nebInvoke = new NebInvoke(toAddress, fromAddress, acc);
  nebInvoke.txCall("submit", callArgs, amount, function(response){
      req.flash('success', { msg: 'Artwork has been upload with id: ' + response.txhash + ".  It might take a moment to process..." });
      res.redirect('/art/' + response.txhash);
  }, function(error){
    req.flash('errors', { msg: 'Artwork could not be uploaded : ' + error.message });
    res.redirect('/submitartwork');
  });
} catch (error) {
  req.flash('errors', { msg: error.message });
  res.redirect('/submitartwork');
}
};


  exports.getArt = (req, res) => {
    var artId = req.params.artId;

    var account = Nas.Account;
    try {
      var acc = account.fromAddress(req.user.addressId);
     var id = acc.getAddressString();
     
     var Neb = Nas.Neb;
     var neb = new Neb();

           var toAddress = process.env.NAS_ART_CONTRACT_ID;
           var amount = "0"
           var callArgs = "[\"" + artId + "\"]";   

           var nebInvoke = new NebInvoke(toAddress, id, id);
           nebInvoke.rpcCall("get", callArgs, amount, function(response){
             if(response.result != null && response.result != "null"){

             res.render('art/context', {
              title: 'Artwork Details',
              data:  JSON.parse(response.result).art,
              env: {
                endpoint: process.env.NAS_NETWORK_ENDPOINT,
                chain: process.env.NAS_NETWORK_CHAINID
              }
              
            });
          } else{
            res.render('art/context', {
              title: 'Artwork details',
              env: {
                endpoint: process.env.NAS_NETWORK_ENDPOINT,
                chain: process.env.NAS_NETWORK_CHAINID
              }
          });
        }
            }, function(error){
              req.flash('errors', { msg: 'Page could not be loaded : ' + error.message });
              res.render('art/context', {
                title: 'Rap battle',
                artId: artId,
                env: {
                  endpoint: process.env.NAS_NETWORK_ENDPOINT,
                  chain: process.env.NAS_NETWORK_CHAINID
                }
              });
            });
        
    } catch (err) {
      req.flash('errors', { msg: 'Page could not be loaded : ' + err.message });
      res.render('art/context', {
        title: 'Rap battle',
        artId: artId
      });
    }
  };

  exports.getMyArtList = (req, res) => {
    var account = Nas.Account;
    try {
      var acc = account.fromAddress(req.user.addressId);
     var id = acc.getAddressString();
     
     var Neb = Nas.Neb;
     var neb = new Neb();

           var toAddress = process.env.NAS_ART_CONTRACT_ID;
           var amount = "0"
          var callArgs = "[\"" + id  + "\"]";   

           var nebInvoke = new NebInvoke(toAddress, id, id);
           nebInvoke.rpcCall("getAll", callArgs, amount, function(response){
             if(response.result != null && response.result != "null"){
               var usersArt = [];
               var obj = JSON.parse(response.result);
               if(obj && obj.length){
                 for(var i =0; i< obj.length; i++){
                   if(obj[i] !== null){
                    if(obj[i].art.userId === id){
                      usersArt.push(obj[i].art);
                    }
                  }
                 }
               }
               res.render('art/myart', {
                title: 'My Artwork',
                data: usersArt,
                env: {
                  endpoint: process.env.NAS_NETWORK_ENDPOINT,
                  chain: process.env.NAS_NETWORK_CHAINID
                }
              });
             }else{
             res.render('art/myart', {
              title: 'My Artwork',
              data: [],
              env: {
                endpoint: process.env.NAS_NETWORK_ENDPOINT,
                chain: process.env.NAS_NETWORK_CHAINID
              }
            });
          }
            }, function(error){
              req.flash('errors', { msg: 'Page could not be loaded : ' + err.message });
              res.render('art/myart', {
                title: 'My Artwork',
                data: usersArt,
                env: {
                  endpoint: process.env.NAS_NETWORK_ENDPOINT,
                  chain: process.env.NAS_NETWORK_CHAINID
                }
              });                
            });
        
    } catch (err) {
      req.flash('errors', { msg: 'Page could not be loaded : ' + err.message });
      res.render('art/myart', {
        title: 'My Artwork',
        data: usersArt,
        env: {
          endpoint: process.env.NAS_NETWORK_ENDPOINT,
          chain: process.env.NAS_NETWORK_CHAINID
        }
      });    
    }
  };

