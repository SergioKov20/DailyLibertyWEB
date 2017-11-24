
var express  = require('express');
var app      = express();
var port     = process.env.PORT || 8080;
var mongoose = require('mongoose');
var passport = require('passport');
var flash    = require('connect-flash');
var morgan       = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser   = require('body-parser');
var session      = require('express-session');


require('./config/passport')(passport);

//Init user sessions
app.use(session({secret: 'mySecretKey'}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

app.use(morgan('dev')); // log every request to the console
app.use(cookieParser()); // read cookies (needed for auth)
app.use(bodyParser()); // get information from html forms

app.use('/', express.static('public'));

var configDB = require('./config/database.js');
mongoose.connect(configDB.url); // connect to our database

app.set('view engine', 'ejs'); // set up ejs for templating

var newspaper = require('./app/newspaper.js');
var editprofile = require('./app/editprofile.js');

require('./app/routes.js')(app,passport,newspaper,editprofile); // load our routes

app.listen(port);
console.log('Server started on port ' + port);
