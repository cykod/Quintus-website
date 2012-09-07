
/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('index', { page: "home" });
};


exports.documentation = function(req,res) {
  res.render('documentation', { page: "documentation" });
}
