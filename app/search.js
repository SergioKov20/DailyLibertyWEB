
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
							me: req.user, //para tener mi foto en la barra de arriba
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
								user : req.user,
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
        	article.views++;

	        article.save(function(err, updatedArticle) {
	        	if (err) res.render('error/500.ejs');
	        	else {
	          		res.render('read.ejs', {
		            	article : updatedArticle,
						user : req.user,
		            	isLoggedIn : req.isAuthenticated()
	        		});
	          	}
	        });
        }
	});
}

exports.searchArticles = function(req,res) {
	var Article = require('./models/article');
	var query = req.param('q');
	console.log(query);
	Article.search({
		query_string: {
			query: query
		}
	},{hydrate: true}, function(err, results) {
		console.log(results.hits.hits);
		res.render('index.ejs', {
	    	user: req.user,
	    	articles: results.hits.hits,
	    	isLoggedIn: req.isAuthenticated()
    	});
	});
}
