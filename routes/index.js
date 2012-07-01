
/*
 * GET home page.
 */

module.exports = function(app){
  
  app.get('/', function(req,res){
    req.facebook.me(function(err,user){
      res.render('index', {
        user: user
      });
    });
  });
  
  app.post('/', function(req,res){
    if(req.facebook.token){
      res.redirect('/');
    } else {
      // TODO: Add 'state' to this auth call to protect against request forgery
      var authURLBase = "https://www.facebook.com/dialog/oauth/";
      var clientID = "client_id=" + req.facebook.plate.options.app_id;
      var redirectURL = "redirect_uri=" + encodeURI("https://apps.facebook.com/" + app.settings.namespace + "/");
      var scope = "scope=" + req.facebook.plate.options.scope;
      res.render('auth_redirect', {
        layout : false,
        authURLBase : authURLBase,
        clientID : clientID,
        redirectURL : redirectURL,
        scope : scope
      });
    }
  });
  
}