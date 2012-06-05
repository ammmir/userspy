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

app.listen(3000, function() {
  console.log('UserSpy server started.');
});

function router(app) {
  app.get('/hello', function(req, res) {
    res.write('Hello, ' + req.query['name'] + '!');
    res.end();
  });
}