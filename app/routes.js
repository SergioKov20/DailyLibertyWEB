module.exports = function(app,passport,newspaper) {

    app.get('/', function(req, res) {
        newspaper.getIndex(req,res);
    });

    app.get('/login', function(req, res) {
        if(req.isAuthenticated()) {
            res.redirect('/');
        }
        else res.render('login.ejs', { message: req.flash('loginMessage') });
    });
    app.post('/login', passport.authenticate('login', {
        successRedirect : '/?a=wlcm', // redirect to the secure profile section
        failureRedirect : '/login', // redirect back to the signup page if there is an error
        failureFlash : true // allow flash messages
    }));

    app.get('/register', function(req, res) {
      if(req.isAuthenticated()) {
          res.redirect('/');
      }
      else res.render('register.ejs', { message: req.flash('signupMessage') });
    });
    app.post('/register', passport.authenticate('signup', {
        successRedirect : '/?a=wlcm', // redirect to the secure profile section
        failureRedirect : '/register', // redirect back to the signup page if there is an error
        failureFlash : true // allow flash messages
    }));

	app.get('/logout', function(req, res) {
		req.logout();
		res.redirect('/');
	});

	app.get('/profile', isLoggedIn, function(req,res){
    var Article = require('./models/article');
    var error = req.param('err');
    Article.find({}, function(err, articles) {
      res.render('profile.ejs', {
        user: req.user,
        error: error,
        articles: articles, //Per obtenir estadistiques d'articles.
        isLoggedIn: req.isAuthenticated()
      });
    });
	});

    app.post('/profile', isLoggedIn, function(req, res) {
        newspaper.editProfile(req,res);
    });

    app.get('/user', function(req,res){
        require('./search.js').getUser(req,res);
    });

    app.post('/user', function(req,res){
        require('./search.js').followUser(req,res);
    });

    app.get('/following', isLoggedIn, function(req, res) {
        res.render('following.ejs', {
            user : req.user,
            following : req.user.following
        } );
    });

    app.get('/followers', function(req, res) {
        require('./search.js').getUserFollowers(req,res);
    });

	app.get('/article', isLoggedIn, function(req, res) {
        var articleID = req.param('e');
        if (articleID == null) res.render('./article.ejs', {
          user: req.user,
          article: null
        });
        else  require('./search.js').editArticle(req,res);
    });
    app.post('/article', isLoggedIn, function(req,res) {
        if (req.param('e') == "0") newspaper.newArticle(req,res);
        else newspaper.editArticle(req,res);
    });

    app.get('/read', function(req,res){
        if(req.param("act") == "del") newspaper.deleteArticle(req, res);
        else if(req.param("like") != null) newspaper.likeArticle(req, res);
        else require('./search.js').getArticle(req,res);
    });
    app.post('/read', function(req,res){
        if(req.param("act") == "com") newspaper.comentar(req,res);
        else {
          res.render('error.ejs', {
            error: "404 Article Not Found"
          });
        }
    });

    app.get('/tendencies', function(req, res) {
        newspaper.getTendencies(req,res);
    });

    app.get('/results', function(req,res) {
        if (req.param('q') == null) res.redirect('/');
        else res.redirect('/');
    });

    app.get('/category', function(req,res){
        var category = req.param('c');
        if (category == null) {
          res.render('error.ejs', {
            error: "404 Category Not Found"
          });
        }
        else  newspaper.getCategory(req,res);
    });

    app.get('/about', function(req, res) {
        res.render('about.ejs', {
            user : req.user,
            isLoggedIn: req.isAuthenticated()
        });
    });

    app.get('/questions', function(req, res) {
        res.render('questions.ejs', {
            user : req.user,
            isLoggedIn: req.isAuthenticated()
        } );
    });
}

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) return next();
    res.redirect('/login');
}
