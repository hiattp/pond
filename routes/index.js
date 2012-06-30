
/*
 * GET home page.
 */

module.exports = function(app){
  
  app.get('/', function(req,res){
    // console.dir(req.facebook.plate);
    req.facebook.me(function(user){
      res.render('index', {
        user: user
      });
    });
  });
  
  app.post('/', function(req.res){
    console.log(req.body);
    res.redirect('/');
  });
  
}