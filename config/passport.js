const passport = require('passport');
const request = require('request');
const User = require('../models/User');
const Nas = require('nebulas');
const { Strategy: LocalStrategy } = require('passport-local');
const NebInvoke = require('../smartcontracts/invoke');

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((req, user, done) => {
  var isValid = Nas.Account.isValidAddress(user.addressId);
  if(isValid){
    done(null, user);
  }else{
    //todo put error here
  }
});

/**
 * Sign in using Email and Password.
 */
passport.use(new LocalStrategy({ usernameField: 'jsoncontents', passwordField: 'password' }, (json, password, done) => {
    var account = Nas.Account;
    var key = JSON.parse(json);
    try {
      var acc = account.fromAddress(key.address);
      acc = acc.fromKey(key, password);
     var id = acc.getAddressString();
     
     var Neb = Nas.Neb;
     var neb = new Neb();
     //process.env.SESSION_SECRET,
     //todo put network in configuration
     neb.setRequest(new Nas.HttpRequest(process.env.NAS_NETWORK_ENDPOINT));
     neb.api.getAccountState(id)
     .then(function (resp) {
         if (resp.error) {
          return done(resp.error); 
         } else {
           var user = new User();
           user.addressId = id;
           user.profile.name = id;
           user.balance = Nas.Unit.fromBasic(Nas.Utils.toBigNumber(resp.balance), "nas").toNumber();
           user.key = key;
           user.profile.picture = '/images/logo2.png'
           user.nonce = parseInt(resp.nonce || 0) + 1
           var toAddress = process.env.NAS_USER_CONTRACT_ID;
           var amount = "0"
           var callArgs = "[\"" + id + "\"]";   

           var nebInvoke = new NebInvoke(toAddress, id, id);
           nebInvoke.rpcCall("get", callArgs, amount, function(response){
             if(response.result != null && response.result != "null"){
               var obj = JSON.parse(response.result);
              user.profile.name = obj.name;
              //user.profile.website = obj.website;
              //user.profile.location = obj.location;
              user.profile.picture = obj.avatar;
             }
           return done(null, user);
          }, function(error){
            return done(error); 
           });
         

           //return done(null, user);
         }
     })
     .catch(function (e) {
      return done(e.message); 
     });


      //return done(null, acc);
    } catch (err) {
      return done(err); 
    }
}));


/**
 * Login Required middleware.
 */
exports.isAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/login');
};

/**
 * Authorization Required middleware.
 */
exports.isAuthorized = (req, res, next) => {
  const provider = req.path.split('/').slice(-1)[0];
  const token = req.user.tokens.find(token => token.kind === provider);
  if (token) {
    next();
  } else {
    res.redirect(`/auth/${provider}`);
  }
};
