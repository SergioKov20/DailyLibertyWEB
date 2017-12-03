
var express  = require('express');
var app      = express();
var http = require('http');
var https = require('https');
var mongoose = require('mongoose');
var passport = require('passport');
var flash    = require('connect-flash');
var morgan       = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser   = require('body-parser');
var session      = require('express-session');
var forceSSL = require('express-force-ssl');
var fs = require('fs');

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

require('./app/routes.js')(app,passport,newspaper); // load our routes

//HTTPS/SSL
var key = fs.readFileSync('encryption/privatekey.pem','utf8');
var cert = fs.readFileSync( 'encryption/certificate.pem','utf8' );
var certOptions = {
  key: key,
  cert: cert,
};
app.set('forceSSLOptions', {
  enable301Redirects: true,
  trustXFPHeader: false,
  httpsPort: 443,
  sslRequiredMessage: 'SSL Required.'
});
var server = http.createServer(app);
var secureServer = https.createServer(certOptions, app);
app.use(forceSSL);
secureServer.listen(443);
server.listen(80);

console.log('Server started');
