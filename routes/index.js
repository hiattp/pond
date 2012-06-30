
/*
 * GET home page.
 */

module.exports = function(app){
  
  app.get('/', function(req,res){
    console.log(req.facebook);
    req.facebook.me(function(user){
      res.render('index', {
        user: user
      });
    });
  });
  
  app.post('/', function(req,res){
    res.redirect('/');
  });
  
}