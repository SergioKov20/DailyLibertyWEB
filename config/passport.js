
var LocalStrategy   = require('passport-local').Strategy;
var User            = require('../app/models/user');

module.exports = function(passport) {
  passport.serializeUser(function(user, done) {
    done(null, user.id);
  });
  passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
      done(err, user);
    });
  });

  passport.use('login', new LocalStrategy({
    usernameField : 'username',
    passwordField : 'password',
    passReqToCallback : true // allows us to pass back the entire request to the callback
    },
    function(req, username, password, done) {
      console.log("inside login!");
      User.findOne({ 'username' :  username }, function(err, user) {
        // if there are any errors, return the error before anything else
        if (err) return done(err);
        // if no user is found, return the message
        if (!user) return done(null, false, req.flash('loginMessage', 'No user found.'));
        // if the user is found but the password is wrong
        if (!user.validPassword(password))
            return done(null, false, req.flash('loginMessage', 'Oops! Wrong password.'));
        // all is well, return successful user
        return done(null, user);
      });
    }
  ));

  passport.use('signup', new LocalStrategy({
    usernameField : 'username',
    passwordField : 'password',
    passReqToCallback : true // allows us to pass back the entire request to the callback
    },
    function(req, username, password, done) {
      process.nextTick(function() {
        console.log("inside signup!");
        if (req.body.password != req.body.confirm) return done(null, false, req.flash('signupMessage', 'Passwords do not match.'));
        User.findOne({ 'username': username }, function(err, user) {
          if (err) return done(err);
          // check to see if theres already a user with that email
          if (user) return done(null, false, req.flash('signupMessage', 'Username already taken.'));
          else {
            var email = req.body.email;
            User.findOne({'email': email }, function(err,found) {
              if (err) return done(err);
              if (found) return done(null, false, req.flash('signupMessage', 'Email already taken.'));
              else {
                var newUser = new User();
                newUser.firstName = req.body.firstName.substring(0, 10);
                newUser.lastName = req.body.lastName.substring(0, 24);
                newUser.username = username;
                newUser.email    = email.substring(0,35);
                newUser.birthdate    = "01/01/1900";
                newUser.aboutme    = "";
                newUser.rating    = 0;
                newUser.fotourl = "/multimedia/profilepics/default.png";
                newUser.password = newUser.generateHash(password);
                // save the user
                newUser.save(function(err) {
                    if (err)
                        throw err;
                    return done(null, newUser);
                });
              }
            });
          }
        });
      });
    }
  ));
};
