
/*
 * GET home page.
 */

module.exports = function(app){
  
  app.get('/', function(req,res){
    console.log(req.facebook);
    console.log("token there?");
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