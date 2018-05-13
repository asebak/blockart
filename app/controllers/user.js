const { promisify } = require('util');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const passport = require('passport');
const User = require('../models/User');
const fs = require('fs')
const randomBytesAsync = promisify(crypto.randomBytes);
const NebInvoke = require('../smartcontracts/invoke');
const Nas = require('nebulas');

/**
 * GET /login
 * Login page.
 */
exports.getLogin = (req, res) => {
  if (req.user) {
    return res.redirect('/');
  }
  res.render('account/login', {
    title: 'Login',
    env: {
      endpoint: process.env.NAS_NETWORK_ENDPOINT,
      chain: process.env.NAS_NETWORK_CHAINID
    }
  });
};

/**
 * POST /login
 * Sign in using email and password.
 */
exports.postLogin = (req, res, next) => {
  req.assert('jsoncontents', 'Keystore is not valid').notEmpty();
  req.assert('password', 'Password cannot be blank').notEmpty();


  const errors = req.validationErrors();

  if (errors) {
    req.flash('errors', errors);
    return res.redirect('/login');
  }



  passport.authenticate('local', (err, user, info) => {
    if (err) { 
      //return next(err);
      req.flash('errors', { msg: err.message });
      return res.redirect('/login');
    }
    if (!user) {
      req.flash('errors', info);
      return res.redirect('/login');
    }
    req.logIn(user, (err) => {
      //return res.redirect('/login');
      if (err) { return next(err); }
      req.flash('success', { msg: 'Success! You are logged in.' });
      res.redirect(req.session.returnTo || '/');
    });
  })(req, res, next);
};

/**
 * GET /logout
 * Log out.
 */
exports.logout = (req, res) => {
  req.logout();
  req.session.destroy((err) => {
    if (err) console.log('Error : Failed to destroy the session during logout.', err);
    req.user = null;
    res.redirect('/');
  });
};

/**
 * GET /signup
 * Signup page.
 */
exports.getSignup = (req, res) => {
  if (req.user) {
    return res.redirect('/');
  }
  res.render('account/signup', {
    title: 'Create Account',
    env: {
      endpoint: process.env.NAS_NETWORK_ENDPOINT,
      chain: process.env.NAS_NETWORK_CHAINID
    }
  });
};

/**
 * POST /signup
 * Create a new local account.
 */
exports.postSignup = (req, res, next) => {
  req.assert('confirmPassword', 'Passwords do not match').equals(req.body.password);

  const errors = req.validationErrors();

  if (errors) {
    req.flash('errors', errors);
    return res.redirect('/signup');
  }
  var account = Nas.Account.NewAccount();
  var address = account.getAddressString();
  var keyStr = account.toKeyString(req.body.password);
  var name = account.toKeyString(req.body.name);

  res.render('account/signup', { 
    address: address,
    key: keyStr,
    name: name,
    env: {
      endpoint: process.env.NAS_NETWORK_ENDPOINT,
      chain: process.env.NAS_NETWORK_CHAINID
    }
   });
};

/**
 * GET /account
 * Profile page.
 */
exports.getAccount = (req, res) => {
  res.render('account/profile', {
    title: 'Account Management',
    env: {
      endpoint: process.env.NAS_NETWORK_ENDPOINT,
      chain: process.env.NAS_NETWORK_CHAINID
    }
  });
};

exports.postUpdateProfile = (req, res, next) => { 
  try {
    
  
  var name = req.body.name || '';
  var picture = req.body.picturebytes || '';
  var fromAddress = req.user.addressId;
  var toAddress = process.env.NAS_USER_CONTRACT_ID;
  var balance = req.user.balance;
  var amount = "0"
  var acc = Nas.Account.fromAddress(fromAddress); 
  var callArgs = "[\"" + name + "\", \"" + picture + "\"]";   
  acc = acc.fromKey(req.user.key, req.body.password); 
  var nebInvoke = new NebInvoke(toAddress, fromAddress, acc);
  nebInvoke.txCall("save", callArgs, amount, function(response){
      req.user.profile.name = name
      req.user.profile.picture = picture
      req.flash('success', { msg: 'Profile information has been updated. TX Hash: ' + response.txhash });
    res.redirect('/account');


   // req.flash('success', { msg: 'Profile information has been updated. It might take a few seconds to reflect. TX Hash: ' + response.txhash });
   // res.redirect('/account');
  }, function(error){
    req.flash('errors', { msg: 'Profile could not be updated: ' + error.message });
    res.redirect('/account');
  });
} catch (error) {
  req.flash('errors', { msg: error.message });
  res.redirect('/account');
}

  };
