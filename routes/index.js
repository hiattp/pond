var mongoose = require('mongoose')
  , User = mongoose.model('User');

module.exports = function(app){

  app.get('/', function(req,res,next){
    User.findOrCreateUser(req.facebook, function(err,user){
      if(err) next(err);
      res.render('index',{
        userId : user._id
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