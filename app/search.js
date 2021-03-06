
exports.getUser = function (req,res) {

	var username = req.query.v;
	if (req.isAuthenticated() && username == req.user.username) res.redirect('/profile');
	else {
		var User = require('./models/user');
		User.findOne({ 'username' :  username }, function(err, user) {
			if (err) {
				res.render('error.ejs', {
					error: "500 Internal Server Error"
				});
			}
	        // if no user is found, return the message
	        if (!user){
						res.render('error.ejs', {
							error: "404 User Not Found"
						});
	        }
	        if (user){
						var siguiendo = "notloggedin";
						if(req.isAuthenticated()) {
								var followed = req.user.username;
								var index = user.followers.indexOf(followed);
								if (index > -1) siguiendo = "yes";
								else siguiendo = "no";
						}

						var Article = require('./models/article');
				    Article.find({}, function(err, articles) {
				      res.render('user.ejs', {
								user: user,
								me: req.user,
				        articles: articles, //Per obtenir estadistiques d'articles.
				        isLoggedIn: req.isAuthenticated(),
								isFollowing: siguiendo
				      });
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
					res.render('error.ejs', {
						error: "500 Internal Server Error"
					});
				}
		        // if no user is found, return the message
		        if (!user){
							res.render('error.ejs', {
								error: "404 User Not Found"
							});
		        }
		        if (user){

							var follower = me.username;
							var followed = user.username;
							if(action == "follow") {
									var index = user.followers.indexOf(follower);
									if(index < 0) { //No le sigo
										 user.followers.push(follower);
											user.save(function(err) {
													if (err) res.render('error.ejs', {
													  error: "500 Internal Server Error"
													});
											});
											me.following.push(followed);
											me.save(function(err) {
													if (err) res.render('error.ejs', {
													  error: "500 Internal Server Error"
													});
											});
											res.redirect('/user?v=' + user.username);
									}
							}
							else if(action == "unfollow") {
									var index = user.followers.indexOf(follower);
									if(index > -1) { // Le sigo
											user.followers.splice(index, 1);
											user.save(function(err) {
													if (err) {
														res.render('error.ejs', {
															error: "500 Internal Server Error"
														});
													}
											});
											var index2 = me.following.indexOf(followed);
											me.following.splice(index2, 1);
											me.save(function(err) {
													if (err) {
														res.render('error.ejs', {
															error: "500 Internal Server Error"
														});
													}
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
				res.render('error.ejs', {
				  error: "500 Internal Server Error"
				});
			}
	        // if no user is found, return the message
	        if (!user){
						res.render('error.ejs', {
							error: "404 User Not Found"
						});
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
			res.render('error.ejs', {
			  error: "500 Internal Server Error"
			});
		}
        // if no user is found, return the message
        if (!article){
					res.render('error.ejs', {
						error: "404 Article Not Found"
					});
        }
        if (article){
        	if (article.author == req.user.username){
	        	res.render('article.ejs', {
								user : req.user,
		            article : article, // get the user out of session and pass to template
	        	});
	        }
	        else {
						res.render('error.ejs', {
							error: "Forbidden: Access Denied"
						});
					}
        }
	});
}

exports.getArticle = function (req,res) {

	var articleID = req.param('a');
	var Article = require('./models/article');
	var likestatus = "notloggedin";
	Article.findOne({ '_id' :  articleID }, function(err, article) {
		if (err) {
			res.render('error.ejs', {
			  error: "500 Internal Server Error"
			});
		}
        if (!article){
					res.render('error.ejs', {
						error: "404 Article Not Found"
					});
        }
        if (article){
        	article.views++;

					if(req.isAuthenticated()) {
							var index = article.likes.indexOf(req.user.username);
							if(index < 0) {
									index = article.dislikes.indexOf(req.user.username);
									if(index > -1) likestatus = "dislike";
									else likestatus = "none";
							}
							else likestatus = "like";
					}

	        article.save(function(err, updatedArticle) {
	        	if (err) res.render('error.ejs', {
						  error: "500 Internal Server Error"
						});
	        	else {
	          		res.render('read.ejs', {
		            	article : updatedArticle,
									user : req.user,
									likestatus: likestatus,
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
			query: query+"~"
		}
	},
	{from:0, size:25, hydrate: true}, function(err, results) {
		console.log(results.hits.hits);
		res.render('index.ejs', {
	    	user: req.user,
	    	articles: results.hits.hits,
	    	isLoggedIn: req.isAuthenticated()
    	});
	});
}
