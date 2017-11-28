
exports.getUser = function (req,res) {

	var username = req.query.v;
	if (req.isAuthenticated() && username == req.user.username) res.redirect('/profile');
	else {
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
						var siguiendo = "notloggedin";
						if(req.isAuthenticated()) {
								var followed = req.user.username;
								var index = user.followers.indexOf(followed);
								if (index > -1) siguiendo = "yes";
								else siguiendo = "no";
						}

	        	res.render('user.ejs', {
		            user : user, // get the user out of session and pass to template
								me: req.user, //para tener mi foto en la barra de arriba
		            isLoggedIn: req.isAuthenticated(),
								isFollowing: siguiendo
	        	});
	        }
		});
	}
}

exports.followUser = function (req,res) {

	var username = req.body.user;
	var action = req.body.action;
	if (!req.isAuthenticated()) res.redirect('/login');
	else {
			var me = req.user;
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

							var follower = me.username;
							var followed = user.username;
							if(action == "follow") {
									var index = user.followers.indexOf(follower);
									if(index < 0) { //No le sigo
										 user.followers.push(follower);
											user.save(function(err) {
													if (err) res.render('error/500.ejs');
											});
											me.following.push(followed);
											me.save(function(err) {
													if (err) res.render('error/500.ejs');
											});
											res.redirect('/user?v=' + user.username);
									}
							}
							else if(action == "unfollow") {
									var index = user.followers.indexOf(follower);
									if(index > -1) { // Le sigo
											user.followers.splice(index, 1);
											user.save(function(err) {
													if (err) res.render('error/500.ejs');
											});
											var index2 = me.following.indexOf(followed);
											me.following.splice(index2, 1);
											me.save(function(err) {
													if (err) res.render('error/500.ejs');
											});
											res.redirect('/user?v=' + user.username);
									}
							}
		        }
			});
		}
}

exports.getUserFollowers = function (req,res) {

	var username = req.query.v;
	if (req.isAuthenticated() && username == req.user.username) {
		res.render('followers.ejs', {
				user : req.user, // get the user out of session and pass to template
				me: req.user, //para tener mi foto en la barra de arriba
				followers: req.user.followers,
				isLoggedIn : req.isAuthenticated()
		});
	}
	else {
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
							res.render('followers.ejs', {
									user : user, // get the user out of session and pass to template
									me: req.user, //para tener mi foto en la barra de arriba
									followers: user.followers,
									isLoggedIn : req.isAuthenticated()
							});
	        }
			});
		}
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

exports.likeArticle = function (req,res) {

	/*TO DO: Al següent commit
	var articleID = req.param('a');
	var action = req.body.action;
	var user = req.user;
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
									user : user,
		            	isLoggedIn : req.isAuthenticated()
	        		});
	          	}
	        });
        }
	});*/
}
