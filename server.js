
var express  = require('express');
var app      = express();
var port     = process.env.PORT || 8080;
var mongoose = require('mongoose');

var configDB = require('./config/database.js');
mongoose.connect(configDB.url); // connect to our database

app.set('view engine', 'ejs'); // set up ejs for templating

require('./app/routes.js')(app); // load our routes

app.listen(port);
console.log('Server started on port ' + port);
