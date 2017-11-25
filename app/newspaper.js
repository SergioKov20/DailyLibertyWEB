var Article = require('./models/article');

exports.getArticles = function () {

	var ret = [];
	Article.find({}, function(err, articles) {
		return articles;
	});
}

exports.getTendencies = function () {

	var t1 = "El Girona Futbol Club fa història davant del tot poderós Reial Madrid";
	var s1 = "El Reial Madrid perd tres punts i comença a dir adéu a la lliga";
	var t2 = "Puigdemont i part del seu govern són a Brussel·les";
	var s2 = "El president de la Generalitat hi hauria anat per entrevistar-se amb dirigents flamencs";
    var articles = [{portada: "/img/ciencia.jpg", category: "ESPORTS", title: t1, subtitle: s1, author: "Edgar Lorenzo"},
					{portada: "/img/puigdemont.jpg", category: "POLITICA", title: t2, subtitle: s2, author: "Edgar Lorenzo"},
					{portada: "/img/ciencia.jpg", category: "ESPORTS", title: t1, subtitle: s1, author: "Edgar Lorenzo"},
					{portada: "/img/puigdemont.jpg", category: "POLITICA", title: t2, subtitle: s2, author: "Edgar Lorenzo"},
					{portada: "/img/ciencia.jpg", category: "ESPORTS", title: t1, subtitle: s1, author: "Edgar Lorenzo"},
					{portada: "/img/puigdemont.jpg", category: "POLITICA", title: t2, subtitle: s2, author: "Edgar Lorenzo"},
					{portada: "/img/ciencia.jpg", category: "ESPORTS", title: t1, subtitle: s1, author: "Edgar Lorenzo"},
					{portada: "/img/puigdemont.jpg", category: "POLITICA", title: t2, subtitle: s2, author: "Edgar Lorenzo"}];
	return articles;
}

exports.newArticle = function(req,res) {

	var newArticle = new Article();
	newArticle._id 		= require("randomstring").generate(7);
	newArticle.category = req.body.category;
	newArticle.title    = req.body.title;
	newArticle.subtitle = req.body.subtitle;
	newArticle.content	= req.body.content;
	newArticle.author 	= req.user.username;

	//use schema.create to insert data into the db
	Article.create(newArticle, function (err) {
		if (err) { return next(err); }
		else { return res.redirect('/')  }
	});
}

exports.editArticle = function(req,res) {
	var articleID = req.param('e');
	Article.findById(articleID, function(err,article) {
		if (err) res.render('error/500.ejs');
		else if (!article) res.render('error/wrongArticle.ejs');
		if (article) {
			if (article.author != req.user.username) res.render('error/forbidden.ejs');
			else {
				article.category = req.body.category;
				article.title    = req.body.title;
				article.subtitle = req.body.subtitle;
				article.content	= req.body.content;
				article.author 	= req.user.username;

				article.save(function (err, updatedArticle) {
			    	if (err) res.render('error/500.ejs');
			    	else res.redirect('/profile');
		  		});
		}
		}

	});
}

exports.editProfile = function(req,res) {

	var formidable = require('formidable');
	var fs = require('fs');
	var form = new formidable.IncomingForm();

	form.parse(req, function (err, fields, files) {
				var User = require('./models/user');

				//COMPROVACIÓ DE CONFLICTE I VALIDESA DE MAILS:
				var mail = fields.mail.substring(0,35);
				User.findOne({'email': mail }, function(err,found) {
					if (found && (found.username != req.user.username)) {
						return res.redirect('/profile');
					}
					else {
						if (mail.indexOf('@') < 1) {
							return res.redirect('/profile');
						}
		        User.findOne({ 'username' :  req.user.username }, function(err, user) {
								//COMPROVAR NAME VALID
								var name = fields.fullname1.substring(0,10);
								var surname = fields.fullname2.substring(0,24);
			        	if(name.length > 1) user.firstName = name;
								else return res.redirect('/profile');
			        	if(surname.length > 1) user.lastName = surname;
								else return res.redirect('/profile');
								user.email = mail;
		          	//COMPROVAR DATA VALID
								var data = fields.birth.substring(0,10);
								var comp = data.split('/');
								var d = parseInt(comp[0], 10);
								var m = parseInt(comp[1], 10);
								var y = parseInt(comp[2], 10);
								var date = new Date(y,m-1,d);
								if (date.getFullYear() == y && date.getMonth() + 1 == m && date.getDate() == d) {
								    user.birthdate = data;
								}
								else return res.redirect('/profile');
								//COMPROVAR ABOUT
								var about = fields.aboutme.substring(0,300);
		          	user.aboutme = about;
								//COMPROVAR FOTO
		          	if (fields.calborrar == "1"){
		          		user.fotourl = "/multimedia/profilepics/default.png";
		          	}
		          	else if (files.filetoupload.size != 0){
		          		var oldpath = files.filetoupload.path;
		          		var extension = "";
		          		if (files.filetoupload.type == 'image/png') extension = ".png";
		          		else if(files.filetoupload.type == 'image/jpeg') extension = ".jpg";
		          		else { res.render('error/wrongFileExt.ejs'); return; }
		          		var newpath = './public/multimedia/profilepics/' + fields.username + extension;
		          		fs.rename(oldpath, newpath, function (err) {
			            	if (err) res.render('error/500.ejs');
		            	});
		            	user.fotourl = '/multimedia/profilepics/' + fields.username + extension;
		          	}
		          	user.save(function(err) {
										if (err) res.render('error/500.ejs');
				        		else res.redirect('/profile');
				        });
        		});
					}
				});
    });
}
