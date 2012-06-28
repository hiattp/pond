
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , async = require('async')
  , url = require('url')
  , RedisStore = require('connect-redis')(express);
  
// redis session
var rtg, redis;
if(process.env.REDISTOGO_URL) {
  rtg = url.parse(process.env.REDISTOGO_URL);
  redis = require('redis').createClient(rtg.port, rtg.hostname);
  redis.auth(rtg.auth.split(':')[1]);
} else {
  redis = require('redis').createClient();
}

var app = module.exports = express.createServer();

// Configuration

app.configure(function(){
  app.use(stylus.middleware({ src: __dirname+'/public' }));
  app.set('views', __dirname + '/views');
  app.set('view engine', 'ejs');
  
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.cookieParser());
  app.use(express.session({ secret: 'your secret here' }));
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function(){
  app.use(express.errorHandler());
});

// Routes

app.get('/', routes.index);

app.listen(3000, function(){
  console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
});
