
/*
 * GET home page.
 */

exports.index = function(req, res){
  console.log(req);
  res.render('index', { title: 'GroupMe Search Engine'});
};

exports.filterName = function(req, res, callback){
  // The query will be in req.body
  var query = req.body['srch-term'];
  
  if (query){
    var search_terms = [];
    search_terms.push(query);

    callback(search_terms, 'nickname'); 

    // Use the ScraperApp API to grab
    res.render('index', { title: 'Searching '+query });
  }
};
