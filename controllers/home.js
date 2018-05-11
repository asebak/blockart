/**
 * GET /
 * Home page.
 */
exports.index = (req, res) => {
  var contractId = process.env.NAS_RAP_CONTRACT_ID;
  
  res.render('home', {
    title: 'Home',
    env: {
      endpoint: process.env.NAS_NETWORK_ENDPOINT,
      chain: process.env.NAS_NETWORK_CHAINID
    }
  });
};
