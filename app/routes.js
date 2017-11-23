module.exports = function(app,passport,newspaper) {

    app.get('/', function(req, res) {
        require('./models/article').find({}, function(err, articles) {
            if(err) console.log(err);
            else {
                res.render('index.ejs', {
                    articles: articles,
                    isLoggedIn: req.isAuthenticated()
                });
            }
        });
    });

    app.get('/login', function(req, res) {
        res.render('login.ejs', { message: req.flash('loginMessage') });
    });
    app.post('/login', passport.authenticate('login', {
        successRedirect : '/profile', // redirect to the secure profile section
        failureRedirect : '/login', // redirect back to the signup page if there is an error
        failureFlash : true // allow flash messages
    }));

    app.get('/register', function(req, res) {
        res.render('register.ejs', { message: req.flash('signupMessage') });
    });
    app.post('/register', passport.authenticate('signup', {
        successRedirect : '/profile', // redirect to the secure profile section
        failureRedirect : '/register', // redirect back to the signup page if there is an error
        failureFlash : true // allow flash messages
    }));

	app.get('/logout', function(req, res) {
		req.logout();
		res.redirect('/');
	});

	app.get('/profile', isLoggedIn, function(req,res){
		res.render('profile.ejs', {
            user : req.user, // get the user out of session and pass to template
        });
	});

  app.post('/profile', isLoggedIn, function(req, res) {
      var username = req.body.username;
      var name = req.body.fullname1;
      var surname = req.body.fullname2;
      var mail = req.body.mail;
      var birth = req.body.birth;
      var about = req.body.aboutme;

      var User = require('./models/user');
      User.findOne({ 'username' :  username }, function(err, user) {
        user.firstName = name;
        user.lastName = surname;
        user.email = mail;
        user.save(function(err) {
            if (err)
                throw err;
            else res.redirect('/profile');
        });
      });
  });

  app.get('/user', function(req,res){
      require('./search.js').getUser(req,res);
  });

	app.get('/article', isLoggedIn, function(req, res) {
        var articleID = req.param('e');
        if (articleID == null) res.render('./article.ejs', { article: null });
        else  require('./search.js').editArticle(req,res);
    });
    app.post('/article', isLoggedIn, function(req,res) {
        newspaper.newArticle(req,res);
    });

    app.get('/read', function(req,res){
        require('./search.js').getArticle(req,res);
    });

    app.get('/tendencies', function(req, res) {
        res.render('tendencies.ejs', {
            tendencies: newspaper.getTendencies(),
            isLoggedIn: req.isAuthenticated()
        } );
    });

    app.get('/results', function(req,res) {
        //Elastic search
    })
}

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) return next();
    res.redirect('/');
}
