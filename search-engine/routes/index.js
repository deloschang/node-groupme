
/*
 * GET home page.
 */

exports.index = function(req, res){
  console.log(req);
  res.render('index', { title: 'GroupMe Search Engine'});
};

exports.filterName = function(req, res){
  // The query will be in req.body
  var query = req.body['srch-term']
  
  if (query){
    // Use the ScraperApp API to grab
    var scraper = require('../ScraperApp');
    res.render('index', { title: 'Searching '+query });
  }
};
