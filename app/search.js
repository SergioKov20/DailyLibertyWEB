
exports.getUser = function (req,res) {

	var username = req.param('v');
	if (req.isAuthenticated() && username == req.user.username) res.redirect('/profile');
	var User = require('./models/user');
	User.findOne({ 'username' :  username }, function(err, user) {
		if (err) {
			res.render('error/500.ejs');
		}
        // if no user is found, return the message
        if (!user){
        	res.render('error/wrongUser.ejs');
        }
        if (user){
        	res.render('user.ejs', {
	            user : user, // get the user out of session and pass to template
	            isLoggedIn: req.isAuthenticated()
        	});
        }
	});
}

exports.editArticle = function (req,res) {

	var articleID = req.param('e');
	var Article = require('./models/article');
	Article.findOne({ '_id' :  articleID }, function(err, article) {
		if (err) {
			res.render('error/500.ejs');
		}
        // if no user is found, return the message
        if (!article){
        	res.render('error/wrongArticle.ejs');
        }
        if (article){
        	if (article.author == req.user.username){
	        	res.render('article.ejs', {
		            article : article, // get the user out of session and pass to template
	        	});
	        }
	        else res.render('error/forbidden.ejs');
        }
	});
}

exports.getArticle = function (req,res) {

	var articleID = req.param('a');
	var Article = require('./models/article');
	Article.findOne({ '_id' :  articleID }, function(err, article) {
		if (err) {
			res.render('error/500.ejs');
		}
        if (!article){
        	res.render('error/wrongArticle.ejs');
        }
        if (article){
	        res.render('read.ejs', {
		            article : article,
		            isLoggedIn : req.isAuthenticated()
	        });
        }
	});
}