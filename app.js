// Module Dependencies

var express = require('express')
  , fs = require('fs')
  , mongoose = require('mongoose')
  , async = require('async')
	, stylus = require('stylus')
	, faceplate = require('faceplate')
  , url = require('url')
  , RedisStore = require('connect-redis')(express);

// Create Server

if(process.env.NODE_ENV == 'development'){
  var app = module.exports = express.createServer({
    key: fs.readFileSync('./ssl/pond.key'),
    cert: fs.readFileSync('./ssl/pond.crt')
  });
} else {
  var app = module.exports = express.createServer();
}

// Socket.IO Server Object

var io = require('socket.io').listen(app);
io.configure(function () {
  io.set("transports", ["xhr-polling"]); 
  io.set("polling duration", 10);
});

// Redis Session

var rtg, redis;
if(process.env.REDISTOGO_URL) {
  rtg = url.parse(process.env.REDISTOGO_URL);
  redis = require('redis').createClient(rtg.port, rtg.hostname);
  redis.auth(rtg.auth.split(':')[1]);
} else {
  redis = require('redis').createClient();
}

// Server Configuration

app.configure(function(){
  app.use(stylus.middleware({ src: __dirname+'/public' }));
  app.set('views', __dirname + '/views');
  app.set('view engine', 'ejs');
  app.set('namespace', process.env.FACEBOOK_NAMESPACE);
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.cookieParser());
  app.use(express.session({
    store: new RedisStore({client:redis}),
    secret: process.env.CLIENT_SECRET || 'incipian'
  }));
  app.use(faceplate.middleware({
    app_id: process.env.FACEBOOK_APP_ID,
    secret: process.env.FACEBOOK_SECRET,
    scope:  'email'
  }));
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
  mongoose.connect('mongodb://localhost/pond');
});

app.configure('production', function(){
  app.use(express.errorHandler());
  mongoose.connect(process.env.MONGOHQ_URL);
});

// Helpers

app.dynamicHelpers({
  url: function(req,res){
    return function(path){
      var host = req.headers['host'];
      // var scheme = req.headers['x-forwarded-proto'] || 'https';
      var scheme = 'https';
      return scheme + "://" + host + path;
    }
  },
  appID: function(req,res){
    return process.env.FACEBOOK_APP_ID;
  }
});

// Connect Router(s)

require('./routes')(app);

// Connect Socket.IO Handler(s)

require('./sockets')(io);

// Listener

var port = process.env.PORT || 3000;
app.listen(port, function(){
  console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
});