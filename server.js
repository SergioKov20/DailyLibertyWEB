
var express  = require('express');
var app      = express();
var port     = process.env.PORT || 8080;

app.set('view engine', 'ejs'); // set up ejs for templating

require('./app/routes.js')(app); // load our routes

app.listen(port);
console.log('Server started on port ' + port);
