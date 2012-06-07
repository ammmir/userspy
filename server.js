/**
 * server.js
 * UserSpy server
 */

var express = require('express'),
         io = require('socket.io');

var app = express.createServer();

app.configure(function() {
  // log all requests
  app.use(express.logger('dev'));
  
  // serve static files out of public dir for matching URIs
  app.use(express.static(__dirname + '/public'));
  
  // parse query strings into the req.query object
  app.use(express.query());
  
  // setup routes
  app.use(express.router(router));
  
  // dump errors to the browser
  app.use(express.errorHandler({showStack: true}));
});

// bind Socket.IO to the server
io = io.listen(app);

io.configure(function() {
  io.set('log level', '1');
});

app.listen(3000, function() {
  console.log('UserSpy server started.');
});

io.sockets.on('connection', on_connection);

function router(app) {
  app.get('/hello', function(req, res) {
    res.write('Hello, ' + req.query['name'] + '!');
    res.end();
  });

  app.get('/api/visitors', function(req, res) {
    var page_url = req.query['url'];

    res.json(VISITORS[page_url]);
    res.end();
  });
}

var VISITORS = {}; // url -> socket.id -> { page info ... }
var SOCKET_URL = {}; // socket.id -> url

function on_connection(socket) {
  socket.on('page info', function(info) {
    VISITORS[info.url] = VISITORS[info.url] || (VISITORS[info.url] = {});
    VISITORS[info.url][socket.id] = info;
    SOCKET_URL[socket.id] = info.url;
    
    socket.emit('ok');
  });
  
  socket.on('events', function(events) {
    var page_url = SOCKET_URL[socket.id];
    
    if(!page_url)
      return;
    
    socket.broadcast.to(page_url + '#' + socket.id).emit('events', events);
  });
  
  socket.on('spy', function(spy_params) {
    var current_users = VISITORS[spy_params.url] || {};
    
    if(!current_users[spy_params.socket_id])
      return socket.emit('error', 'no such socket_id connected');
    
    var page_info = VISITORS[spy_params.url][spy_params.socket_id];
    
    socket.emit('page info', page_info);
    socket.join(spy_params.url + '#' + spy_params.socket_id);
  });
  
  socket.on('disconnect', function() {
    for(var page_url in VISITORS) {
      if(socket.id in VISITORS[page_url])
        delete VISITORS[page_url][socket.id];
    }
  });
}
