module.exports = function(app,passport,newspaper) {

    app.get('/', function(req, res) {
        res.render('index.ejs', { 
            articles: newspaper.getArticles(), 
            isLoggedIn: req.isAuthenticated() 
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
    app.get('/user', function(req,res){
        require('./search.js').getUser(req,res,username);
    });

	app.get('/article', isLoggedIn, function(req, res) {
        var articleID = req.param('e');
        if (articleID == null) res.render('./article.ejs', { article: null });
        else  require('./search.js').getArticle(req,res);
    });
    app.post('/article', isLoggedIn, function(req,res) {
        newspaper.newArticle(req,res);
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
