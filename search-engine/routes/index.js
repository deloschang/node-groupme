
/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('index', { title: 'GroupMe Search Engine' });
};

exports.helloworld = function(req, res){
  res.render('helloworld', { title: 'Hello, World!' });
};
