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

// attach socket.io server to app
io = io.listen(app);

io.configure(function() {
  io.set('log level', '1');
});

io.on('connection', on_new_connection);

app.listen(3000, function() {
  console.log('UserSpy server started.');
});

var VISITORS = {}; // url -> socket.id -> { page info ... }
var SOCKET_URL = {}; // socket.id -> url
var SPY_PARAMS = {}; // socket.id -> spy_params

function router(app) {
  app.get('/api/visitors', function(req, res) {
    // TODO
  });
}

function on_new_connection(socket) {
  socket.on('page info', function(info) {
    // TODO
  });
  
  socket.on('events', function(events) {
    // TODO
  });
  
  socket.on('spy', function(spy_params) {
    // TODO
  });
  
  socket.on('disconnect', function() {
    // TODO
  });
}
