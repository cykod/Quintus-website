
/**
 * Module dependencies.
 */

var express = require('express')
  , stylus = require('stylus')
  , routes = require('./routes')
  , http = require('http')
  , path = require('path');


var app = express();

app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.cookieParser('fdasfkhfio34gt73489g9fw7f9ew7g'));
//  app.use(express.session());
  app.use(app.router);
  app.use(stylus.middleware({
      src: __dirname + '/views' // .styl files are located in `views/stylesheets`
    , dest: __dirname + '/public' // .styl resources are compiled `/stylesheets/*.css`
    , compile: function(str, path) { // optional, but recommended
		return stylus(str)
		.set('filename', path)
		.set('warn', true)
		.set('compress', true);
	}
  }));
  app.use(require('express-markdown')({
    directory: __dirname + '/public',
    view: "guide"
  }));
  
  app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

app.get('/', routes.index);
app.get('/documentation', routes.documentation);

app.get('/quintus/docs/:name',function(req,res) {
  var name = req.params.name
  res.redirect('/docs/' + name);
});


app.get('/guide', routes.guide);

app.use(express.favicon(__dirname + '/public/favicon.ico', { maxAge: 2592000000 }));
// Socket.i

var server = http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});

var io = require('socket.io').listen(server)


io.sockets.on('connection',function(socket) {
  
  socket.on('pinger', function(data,fn) {
    fn({ pong: new Date() });
  });

});

