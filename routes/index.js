
/*
 * GET home page.
 */

module.exports = function(app){
  
  app.get('/', function(req,res){
    req.facebook.me(function(user){
      res.render('index', {
        user: user
      });
    });
  });
  
  app.post('/', function(req,res){
    req.facebook.plate.parse_signed_request(req.body.signed_request, function(result){
      console.dir(result);
      res.redirect('/');
    });
  });
  
}