var connect = require('connect');

var helloWorld = require('./hello_World');
var app = connect.createServer(helloWorld);
app.listen(8080);